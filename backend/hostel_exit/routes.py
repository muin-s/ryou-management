from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from extensions import db
from model import HostelExit

from .llm_engine import run_llm
from .prompt import build_prompt
from .risk import assess_risk
from .fee import calculate_fee
from .export import generate_exit_pdf
import json, re
import dateparser
from datetime import datetime, timedelta

hostel_exit_bp = Blueprint("hostel_exit", __name__)




def normalize(dt_str):
    if not dt_str:
        print("normalize: Empty datetime string")
        return None

    # 1️⃣ Try strict ISO first (fast + correct)
    try:
        dt = datetime.fromisoformat(dt_str)
        print(f"normalize: ISO parse success: {dt}")
        return dt
    except Exception as e:
        print(f"normalize: ISO parse failed: {e}")

    # 2️⃣ Fallback to NLP parsing (LLM-safe)
    try:
        dt = dateparser.parse(
            dt_str,
            settings={
                "RELATIVE_BASE": datetime.now(),
                "PREFER_DATES_FROM": "future",
                "TIMEZONE": "Asia/Kolkata",
                "RETURN_AS_TIMEZONE_AWARE": False,
            },
        )
        if dt:
            print(f"normalize: dateparser success: {dt}")
            return dt
        else:
            print(f"normalize: dateparser returned None for: {dt_str}")
            return None
    except Exception as e:
        print(f"normalize: dateparser error: {e}")
        return None

# ---------------- STUDENT CREATE ----------------
@hostel_exit_bp.post("/api/hostel-exit")
@jwt_required()
def create_exit():
    user_id = int(get_jwt_identity())

    # Accept JSON or form-data
    data = request.get_json(silent=True) or request.form or {}

    text = (
        data.get("description")
        or data.get("text")
        or data.get("reason")
        or ""
    ).strip()

    print("RAW REQUEST:", request.data)
    print("PARSED DATA:", data)
    print("FINAL TEXT:", text)

    if len(text) < 10:
        return jsonify({
            "error": "Description too short. Please provide clear leave and return dates."
        }), 400

    # Run LLM
    try:
        llm_out = run_llm(build_prompt(text))
        print("LLM OUTPUT:", llm_out)
    except Exception as e:
        print("LLM error:", e)
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Unable to understand the details. Please rewrite clearly."
        }), 400

    # Parse LLM output
    if isinstance(llm_out, dict):
        parsed = llm_out
        print("PARSED LLM OUTPUT:", parsed)
    else:
        print("ERROR: LLM output is not a dict, type:", type(llm_out), "value:", llm_out)
        return jsonify({"error": "Invalid LLM output format"}), 500

    leave_dt_str = parsed.get("leave_datetime", "").strip()
    return_dt_str = parsed.get("return_datetime", "").strip()
    print("DATE STRINGS - Leave:", leave_dt_str, "Return:", return_dt_str)

    # Check for placeholder values and try fallback extraction from original text
    if not leave_dt_str or leave_dt_str == "..." or len(leave_dt_str) < 5:
        # Try to extract leave date directly from original text
        # Pattern: "24 december 2025 at 10 am" or "on 24 dec 2025 at 10:00"
        leave_match = re.search(
            r'(?:leave|leaving|exit|on)\s+(\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm))?)',
            text, 
            re.IGNORECASE
        )
        if leave_match:
            leave_dt_str = leave_match.group(1)
            print("FALLBACK: Extracted leave date from text:", leave_dt_str)
        else:
            return jsonify({
                "error": "Could not extract leave date/time from your message. Please specify clearly like: 'Leaving on 24 December 2025 at 10:00 AM'"
            }), 400
    
    if not return_dt_str or return_dt_str == "..." or len(return_dt_str) < 5:
        # Try to extract return date directly from original text
        return_match = re.search(
            r'(?:return|returning|come back|back|on)\s+(\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm))?)',
            text, 
            re.IGNORECASE
        )
        if return_match:
            return_dt_str = return_match.group(1)
            print("FALLBACK: Extracted return date from text:", return_dt_str)
        else:
            return jsonify({
                "error": "Could not extract return date/time from your message. Please specify clearly like: 'Returning on 28 December 2025 at 2:00 PM'"
            }), 400

    leave_dt = normalize(leave_dt_str)
    return_dt = normalize(return_dt_str)
    print("NORMALIZED DATES - Leave:", leave_dt, "Return:", return_dt)

    # 🔒 VALIDATE FIRST
    if not leave_dt or not return_dt:
        error_msg = "Unable to understand leave or return time. "
        if not leave_dt:
            error_msg += f"Could not parse leave time: '{leave_dt_str}'. "
        if not return_dt:
            error_msg += f"Could not parse return time: '{return_dt_str}'. "
        error_msg += "Please specify clearly like: 'Leaving on 20 December 2025 at 10:00 AM and returning on 27 December 2025 at 6:00 PM.'"
        return jsonify({"error": error_msg}), 400

    # ✅ POST-PROCESS: Fix relative time calculations from text
    # Check if return time mentions "same day" or relative hours
    text_lower = text.lower()
    if "same day" in text_lower or "same day" in return_dt_str.lower():
        # Return is same date as leave, but keep the time from LLM
        return_dt = leave_dt.replace(hour=return_dt.hour, minute=return_dt.minute, second=return_dt.second)
        print("POST-PROCESS: Fixed same-day return date")
    
    # Check for "after X hours" or "in X hours" patterns
    hours_match = re.search(r'(?:after|in)\s+(\d+)\s+hours?', text_lower)
    if hours_match:
        hours = int(hours_match.group(1))
        return_dt = leave_dt + timedelta(hours=hours)
        print(f"POST-PROCESS: Fixed return time to {hours} hours after leave time")
    
    # Check for "after X days" pattern
    days_match = re.search(r'(?:after|in)\s+(\d+)\s+days?', text_lower)
    if days_match:
        days_to_add = int(days_match.group(1))
        return_dt = leave_dt + timedelta(days=days_to_add)
        print(f"POST-PROCESS: Fixed return time to {days_to_add} days after leave time")

    # ✅ SAFE TO COMPUTE DAYS NOW
    days = (return_dt.date() - leave_dt.date()).days
    hours_diff = (return_dt - leave_dt).total_seconds() / 3600

    # Always recalculate intent based on actual time difference
    if hours_diff <= 24:
        exit_type = "REGULAR_EXIT"
    else:
        exit_type = "HOSTEL_LEAVE"
    
    print(f"INTENT CALCULATION: {hours_diff} hours = {days} days -> {exit_type}")

    # Extract room_type from text if not provided or is "unknown"
    room_type = parsed.get("room_type", "unknown")
    if room_type == "unknown" or not room_type:
        # Try to extract from text
        room_match = re.search(r'(\d+)[\s-]?(?:seater|seat)', text_lower)
        if room_match:
            seats = room_match.group(1)
            room_type = f"{seats}_seater"
            print(f"POST-PROCESS: Extracted room_type from text: {room_type}")
    
    # Extract emergency contact from text if not provided
    emergency_contact = parsed.get("emergency_contact", "")
    if not emergency_contact or emergency_contact == "":
        # Try to extract phone number from text
        phone_match = re.search(r'(\d{10,})', text.replace(" ", "").replace("-", ""))
        if phone_match:
            emergency_contact = phone_match.group(1)
            print(f"POST-PROCESS: Extracted phone from text: {emergency_contact}")

    risk = assess_risk(leave_dt, return_dt, emergency_contact)
    fee = calculate_fee(leave_dt, return_dt, room_type)

    entry = HostelExit(
        student_id=user_id,
        raw_input=text,
        exit_type=exit_type,
        leave_datetime=leave_dt,
        return_datetime=return_dt,
        room_type=room_type,
        emergency_contact=emergency_contact,
        risk_level=risk,
        calculated_fee=fee,
        status="pending"
    )

    db.session.add(entry)
    db.session.commit()

    return jsonify({"ok": True})

# ---------------- STUDENT HISTORY ----------------
@hostel_exit_bp.get("/api/hostel-exit/my")
@jwt_required()
def my_exits():
    user_id = int(get_jwt_identity())
    rows = HostelExit.query.filter_by(student_id=user_id).order_by(HostelExit.created_at.desc()).all()

    return jsonify([{
        "id": r.id,
        "exit_type": r.exit_type,
        "leave_datetime": r.leave_datetime.isoformat() if r.leave_datetime else None,
        "return_datetime": r.return_datetime.isoformat() if r.return_datetime else None,
        "risk_level": r.risk_level,
        "calculated_fee": r.calculated_fee,
        "status": r.status,
    } for r in rows])

# ---------------- ADMIN LIST ----------------
@hostel_exit_bp.get("/api/hostel-exit")
@jwt_required()
def list_all():
    if get_jwt().get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    rows = HostelExit.query.order_by(HostelExit.created_at.desc()).all()
    return jsonify([{
        "id": r.id,
        "student_id": r.student_id,
        "exit_type": r.exit_type,
        "leave_datetime": r.leave_datetime.isoformat() if r.leave_datetime else None,
        "return_datetime": r.return_datetime.isoformat() if r.return_datetime else None,
        "risk_level": r.risk_level,
        "calculated_fee": r.calculated_fee,
        "status": r.status,
    } for r in rows])

# ---------------- ADMIN ACTIONS ----------------
@hostel_exit_bp.post("/api/hostel-exit/<int:id>/approve")
@jwt_required()
def approve(id):
    if get_jwt().get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403
    r = HostelExit.query.get_or_404(id)
    r.status = "approved"
    db.session.commit()
    return jsonify({"ok": True})

@hostel_exit_bp.post("/api/hostel-exit/<int:id>/reject")
@jwt_required()
def reject(id):
    if get_jwt().get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403
    r = HostelExit.query.get_or_404(id)
    r.status = "rejected"
    db.session.commit()
    return jsonify({"ok": True})

# ---------------- ADMIN PDF ----------------
@hostel_exit_bp.get("/api/hostel-exit/export/pdf")
@jwt_required()
def export_exit_pdf():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    path = generate_exit_pdf()
    return send_file(path, as_attachment=True)
