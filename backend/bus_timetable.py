from flask import request, jsonify
from model import db
from flask import Blueprint

bus_bp = Blueprint("bus_timetable", __name__)

class BusTimetable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    route_name = db.Column(db.String(100), nullable=False)
    schedule = db.Column(db.Text, nullable=False)

@bus_bp.route('/api/timetable', methods=['GET'])
def get_timetable():
    timetables = BusTimetable.query.all()
    data = [{"id": t.id, "route_name": t.route_name, "schedule": t.schedule} for t in timetables]
    return jsonify(data)

@bus_bp.route('/api/timetable', methods=['POST'])
def update_timetable():
    data = request.get_json()
    route = data.get("route_name")
    schedule = data.get("schedule")

    existing = BusTimetable.query.filter_by(route_name=route).first()
    if existing:
        existing.schedule = schedule
    else:
        new_entry = BusTimetable(route_name=route, schedule=schedule)
        db.session.add(new_entry)

    db.session.commit()
    return jsonify({"message": "Timetable updated successfully!"})
