# backend/ml/shop_ranker.py

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def build_shop_text(shop: dict) -> str:
    """
    Convert shop JSON to text for NLP
    """
    parts = []
    if shop.get("name"):
        parts.append(shop["name"])
    if shop.get("shop"):
        parts.append(shop["shop"])
    if shop.get("amenity"):
        parts.append(shop["amenity"])
    if shop.get("office"):
        parts.append(shop["office"])

    return " ".join(parts).lower()


def rank_shops_by_query(query: str, shops: list, top_k=10):
    """
    Rank nearby shops by NLP relevance + distance
    """
    if not shops:
        return []

    shop_texts = [build_shop_text(s) for s in shops]
    corpus = [query.lower()] + shop_texts

    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform(corpus)

    query_vec = vectors[0]
    shop_vecs = vectors[1:]

    similarities = cosine_similarity(query_vec, shop_vecs)[0]

    ranked = []
    for shop, score in zip(shops, similarities):
        ranked.append({
            **shop,
            "nlp_score": float(score)
        })

    # sort by:
    # 1. NLP relevance
    # 2. distance
    ranked.sort(
        key=lambda x: (-x["nlp_score"], x.get("distance_km", 999))
    )

    return ranked[:top_k]
