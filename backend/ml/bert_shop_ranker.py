from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

BLOCKED_AMENITIES = {
    "place_of_worship", "temple", "theatre", "cinema",
    "college", "school", "university", "library",
    "bank", "atm"
}

def shop_to_text(shop):
    parts = []
    if shop.get("name"):
        parts.append(shop["name"])
    if shop.get("shop"):
        parts.append(shop["shop"])
    if shop.get("amenity"):
        parts.append(shop["amenity"])
    return " ".join(parts).lower()

def is_valid_shop(shop):
    if shop.get("shop"):
        return True
    if shop.get("amenity") in {
        "pharmacy", "clinic", "hospital",
        "cafe", "restaurant", "fast_food"
    }:
        return True
    return False

def rank_shops_bert(query, shops, top_k=10):
    filtered = []
    for s in shops:
        if s.get("amenity") in BLOCKED_AMENITIES:
            continue
        if is_valid_shop(s):
            filtered.append(s)

    if not filtered:
        return []

    texts = [shop_to_text(s) for s in filtered]

    q_emb = model.encode(query, convert_to_tensor=True)
    s_emb = model.encode(texts, convert_to_tensor=True)

    scores = util.cos_sim(q_emb, s_emb)[0]

    ranked = []
    for shop, score in zip(filtered, scores):
        score = float(score)
        if score >= 0.30:
            ranked.append({**shop, "nlp_score": score})

    ranked.sort(key=lambda x: (-x["nlp_score"], x.get("distance_km", 999)))
    return ranked[:top_k]
