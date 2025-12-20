from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from marketplace.model import MarketplaceItem
from marketplace.image_upload import save_image
from marketplace.marketplace_ranker import rank_marketplace_items
from osm.osm_service import fetch_nearby_places
from ml.bert_shop_ranker import rank_shops_bert


marketplace_bp = Blueprint("marketplace", __name__)

@marketplace_bp.route("/api/marketplace", methods=["GET"])
@jwt_required()
def get_items():
    items = MarketplaceItem.query.order_by(
        MarketplaceItem.created_at.desc()
    ).all()

    return jsonify([
        {
            "id": i.id,
            "description": i.description,
            "price": i.price,
            "image_url": i.image_url,
            "contact_info": i.contact_info,   # ✅ visible
            "status": i.status,
            "seller_id": i.seller_id
        } for i in items
    ])


@marketplace_bp.route("/api/marketplace", methods=["POST"])
@jwt_required()
def post_item():
    seller_id = int(get_jwt_identity())

    description = request.form.get("description")
    category = request.form.get("category")  # ✅ NEW
    contact = request.form.get("contact")
    price = request.form.get("price")

    image = request.files.get("image")
    image_url = save_image(image) if image else None

    item = MarketplaceItem(
        seller_id=seller_id,
        description=description,
        category=category,
        contact_info=contact,
        price=price,
        image_url=image_url,
        status="available"
    )

    db.session.add(item)
    db.session.commit()
    return jsonify({"success": True})


@marketplace_bp.route("/api/marketplace/<int:item_id>/status", methods=["PATCH"])
@jwt_required()
def update_status(item_id):
    user_id = int(get_jwt_identity())
    item = MarketplaceItem.query.get_or_404(item_id)

    if item.seller_id != user_id:
        return jsonify({"error": "Not allowed"}), 403

    status = request.json.get("status")
    if status not in ["available", "sold"]:
        return jsonify({"error": "Invalid status"}), 400

    item.status = status
    db.session.commit()

    return jsonify({"success": True, "status": status})


@marketplace_bp.route("/api/marketplace/search", methods=["POST"])
@jwt_required()
def search_marketplace():
    query = request.json.get("query", "")

    items = MarketplaceItem.query.all()
    ranked_items = rank_marketplace_items(query, items)

    places = fetch_nearby_places()
    nearby_shops = rank_shops_bert(query, places)

    return jsonify({
        "items": ranked_items,
        "nearby_shops": nearby_shops
    })
