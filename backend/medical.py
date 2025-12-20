from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from model import db, Doctor, StudentMedical
import re

medical_bp = Blueprint("medical", __name__, url_prefix="/api/medical")

TIME_RE = re.compile(r"^([01]?\d|2[0-3]):([0-5]\d)$")

# --- Doctors ---
@medical_bp.get("/doctors")
@jwt_required(optional=True)
def get_doctors():
    doctors = Doctor.query.all()
    return jsonify([
        {
            "id": d.id,
            "name": d.name,
            "available_today": bool(d.available_today),
            "arrival_time": d.arrival_time,
            "leave_time": d.leave_time,
        }
        for d in doctors
    ])


@medical_bp.post("/doctors")
@jwt_required()
def create_doctor():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json() or {}
    name = data.get("name")
    available = bool(data.get("available_today", False))
    arrival = data.get("arrival_time")
    leave = data.get("leave_time")

    if not name:
        return jsonify({"error": "Missing doctor name"}), 400
    if arrival and not TIME_RE.match(arrival):
        return jsonify({"error": "Invalid arrival_time format, expected HH:MM"}), 400
    if leave and not TIME_RE.match(leave):
        return jsonify({"error": "Invalid leave_time format, expected HH:MM"}), 400

    d = Doctor(name=name, available_today=available, arrival_time=arrival, leave_time=leave)
    db.session.add(d)
    db.session.commit()
    return jsonify({"message": "Doctor created", "doctor": {"id": d.id}}), 201


@medical_bp.put("/doctors/<int:doc_id>")
@jwt_required()
def update_doctor(doc_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    d = Doctor.query.get(doc_id)
    if not d:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json() or {}
    name = data.get("name")
    if name:
        d.name = name
    if "available_today" in data:
        d.available_today = bool(data.get("available_today"))
    if "arrival_time" in data:
        arrival = data.get("arrival_time")
        if arrival and not TIME_RE.match(arrival):
            return jsonify({"error": "Invalid arrival_time format, expected HH:MM"}), 400
        d.arrival_time = arrival
    if "leave_time" in data:
        leave = data.get("leave_time")
        if leave and not TIME_RE.match(leave):
            return jsonify({"error": "Invalid leave_time format, expected HH:MM"}), 400
        d.leave_time = leave

    db.session.commit()
    return jsonify({"message": "Doctor updated"})


@medical_bp.delete("/doctors/<int:doc_id>")
@jwt_required()
def delete_doctor(doc_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    d = Doctor.query.get(doc_id)
    if not d:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(d)
    db.session.commit()
    return jsonify({"message": "Doctor deleted"})


# --- Student Records ---
@medical_bp.get("/student-records") # Changed from /students
@jwt_required()
def get_students():
    claims = get_jwt()
    role = claims.get("role")
    user_email = claims.get("email")

    if role == "admin":
        recs = StudentMedical.query.all()
    else:
        # Students can only view their own records
        recs = StudentMedical.query.filter_by(email=user_email).all()

    return jsonify([
        {
            "id": r.id,
            "student_name": r.student_name,
            "email": r.email,
            "prescribed_medicine": r.prescribed_medicine,
        }
        for r in recs
    ])


@medical_bp.post("/student-records") # Changed from /students
@jwt_required()
def create_student_record():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    data = request.get_json() or {}
    name = data.get("student_name")
    email = data.get("email")
    med = data.get("prescribed_medicine") or ""

    if not name or not email:
        return jsonify({"error": "Missing fields"}), 400

    r = StudentMedical(student_name=name, email=email, prescribed_medicine=med)
    db.session.add(r)
    db.session.commit()
    return jsonify({"message": "Record created", "id": r.id}), 201


@medical_bp.put("/student-records/<int:rid>") # Changed from /students
@jwt_required()
def update_student_record(rid):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    r = StudentMedical.query.get(rid)
    if not r:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json() or {}
    if "student_name" in data:
        r.student_name = data.get("student_name")
    if "email" in data:
        r.email = data.get("email")
    if "prescribed_medicine" in data:
        r.prescribed_medicine = data.get("prescribed_medicine")
    db.session.commit()
    return jsonify({"message": "Record updated"})


@medical_bp.delete("/student-records/<int:rid>") # Changed from /students
@jwt_required()
def delete_student_record(rid):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    r = StudentMedical.query.get(rid)
    if not r:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(r)
    db.session.commit()
    return jsonify({"message": "Record deleted"})
