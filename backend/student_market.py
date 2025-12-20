from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from osm.osm_service import fetch_nearby_places
from ml.bert_shop_ranker import rank_shops_bert

student_market_bp = Blueprint("student_market", __name__)

@student_market_bp.route("/api/student/nearby-shops", methods=["POST"])
@jwt_required()
def nearby_shops():
    if get_jwt().get("role") != "student":
        return jsonify({"error": "Access denied"}), 403

    query = request.json.get("query", "").strip()
    if not query:
        return jsonify({"error": "Query required"}), 400

    places = fetch_nearby_places()
    results = rank_shops_bert(query, places)

    return jsonify({
        "query": query,
        "count": len(results),
        "results": results
    })
