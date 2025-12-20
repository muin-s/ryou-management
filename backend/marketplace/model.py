import datetime
from extensions import db
class MarketplaceItem(db.Model):
    __tablename__ = "marketplace_item"

    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, nullable=False)

    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(20), nullable=False)  # ✅ NEW

    image_url = db.Column(db.String(255))
    contact_info = db.Column(db.String(100))
    price = db.Column(db.Integer)

    status = db.Column(db.String(20), default="available")

    created_at = db.Column(
        db.DateTime,
        default=datetime.datetime.utcnow
    )
