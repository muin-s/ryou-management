from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from llm.autocomplete import get_autocomplete_suggestions

llm_bp = Blueprint("llm", __name__)

@llm_bp.route("/api/autocomplete", methods=["POST"])
@jwt_required()
def autocomplete():
    query = request.json.get("query", "").strip()

    if len(query) < 2:
        return jsonify({"suggestions": []})

    suggestions = get_autocomplete_suggestions(query)

    return jsonify({"suggestions": suggestions})
