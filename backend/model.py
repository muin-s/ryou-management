from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")
    room_no = db.Column(db.String(20), nullable=True)  
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class WorkerInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    worker_type = db.Column(db.String(100), nullable=False)
    user = db.relationship("User", backref=db.backref("worker_info", uselist=False))

class Issue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    room_number = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Pending')
    created_by = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    upvotes = db.Column(db.Integer, nullable=False, default=0)
    voters = db.Column(db.Text, nullable=True, default='')
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    assigned_at = db.Column(db.DateTime, nullable=True)
    assignee = db.relationship("User", backref=db.backref("assigned_issues", lazy=True))


class Notice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    author = db.Column(db.String(50), nullable=False, default='Admin')

class Mess(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(20), nullable=False)  # Monday, Tuesday, etc.
    breakfast = db.Column(db.String(255), nullable=False, default='')
    lunch = db.Column(db.String(255), nullable=False, default='')
    snacks = db.Column(db.String(255), nullable=False, default='')
    dinner = db.Column(db.String(255), nullable=False, default='')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    __table_args__ = (db.UniqueConstraint('day', name='unique_day'),)


class Doctor(db.Model):
    __tablename__ = 'doctor'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    available_today = db.Column(db.Boolean, nullable=False, default=False)
    arrival_time = db.Column(db.String(10), nullable=True)  # store as HH:MM
    leave_time = db.Column(db.String(10), nullable=True)

class StudentMedical(db.Model):
    __tablename__ = 'student_medical'
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    prescribed_medicine = db.Column(db.Text, nullable=True)