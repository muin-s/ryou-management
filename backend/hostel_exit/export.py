from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from flask import send_file
from model import HostelExit
import os

def generate_exit_pdf():
    file_path = "hostel_exit_report.pdf"

    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("<b>Hostel Exit Report</b>", styles["Title"]))
    elements.append(Spacer(1, 12))

    exits = HostelExit.query.order_by(HostelExit.created_at.desc()).all()

    for r in exits:
        text = f"""
        Student ID: {r.student_id}<br/>
        Type: {r.exit_type}<br/>
        Leave: {r.leave_datetime}<br/>
        Return: {r.return_datetime}<br/>
        Room: {r.room_type}<br/>
        Risk: {r.risk_level}<br/>
        Fee: ₹{r.calculated_fee}<br/>
        Status: {r.status}
        """
        elements.append(Paragraph(text, styles["Normal"]))
        elements.append(Spacer(1, 10))

    doc.build(elements)
    return file_path
