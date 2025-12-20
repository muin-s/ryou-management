from datetime import datetime
from extensions import db

# ---------------- USER ----------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="student")
    room_no = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ---------------- WORKER ----------------
class WorkerInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), unique=True)
    worker_type = db.Column(db.String(100))
    user = db.relationship("User", backref=db.backref("worker_info", uselist=False))

# ---------------- ISSUE ----------------
class Issue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    room_number = db.Column(db.String(20))
    status = db.Column(db.String(20), default="Pending")
    created_by = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Missing fields used in issues.py
    upvotes = db.Column(db.Integer, default=0)
    voters = db.Column(db.Text)  # Comma-separated emails
    assigned_to = db.Column(db.Integer, db.ForeignKey("user.id"))
    assigned_at = db.Column(db.DateTime)
    predicted_category = db.Column(db.String(100))
    ml_model_version = db.Column(db.String(20))

    assignee = db.relationship("User", backref=db.backref("assigned_issues", lazy=True))

# ---------------- NOTICE ----------------
class Notice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author = db.Column(db.String(50), default="Admin")

# ---------------- MESS (⬅️ THIS WAS MISSING) ----------------
class Mess(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(20), nullable=False)
    breakfast = db.Column(db.String(255), default="")
    lunch = db.Column(db.String(255), default="")
    snacks = db.Column(db.String(255), default="")
    dinner = db.Column(db.String(255), default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

# ---------------- DOCTOR ----------------
class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    available_today = db.Column(db.Boolean, default=False)
    arrival_time = db.Column(db.String(10))
    leave_time = db.Column(db.String(10))

# ---------------- STUDENT MEDICAL ----------------
class StudentMedical(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(150))
    email = db.Column(db.String(120))
    prescribed_medicine = db.Column(db.Text)
    
class HostelExit(db.Model):
    __tablename__ = "hostel_exit"

    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    raw_input = db.Column(db.Text, nullable=False)

    exit_type = db.Column(db.String(30))  # REGULAR_EXIT / HOSTEL_LEAVE

    leave_datetime = db.Column(db.DateTime)
    return_datetime = db.Column(db.DateTime)

    room_type = db.Column(db.String(10))  # 2_seater / 4_seater
    emergency_contact = db.Column(db.String(20))

    risk_level = db.Column(db.String(10))  # low / medium / high
    calculated_fee = db.Column(db.Integer)

    status = db.Column(db.String(10), default="pending")  # pending / approved / rejected

    created_at = db.Column(db.DateTime, default=datetime.utcnow)