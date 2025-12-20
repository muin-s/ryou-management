from sentence_transformers import SentenceTransformer, util, CrossEncoder
from marketplace.category_utils import detect_category_from_query, is_pure_category_query

CE_THRESHOLD = 0.25

bi_encoder = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


def rank_marketplace_items(query, items, top_k=10):
    if not items or not query.strip():
        return []

    query = query.lower().strip()

    # ---------------------------
    # 1️⃣ CATEGORY-BASED FILTERING (taxonomy)
    # ---------------------------
    query_category = detect_category_from_query(query)
    pure_category_query = (
        query_category is not None and
        is_pure_category_query(query, query_category)
    )
    if query_category:
        items = [i for i in items if i.category == query_category]

    if not items:
        return []

    # ---------------------------
    # 2️⃣ BUILD SEMANTIC TEXT
    # ---------------------------
    texts = [
        f"{i.description}. Category: {i.category}. Marketplace product."
        for i in items
    ]

    # ---------------------------
    # 3️⃣ BI-ENCODER (candidate generation)
    # ---------------------------
    q_emb = bi_encoder.encode(query, convert_to_tensor=True)
    i_embs = bi_encoder.encode(texts, convert_to_tensor=True)

    cos_scores = util.cos_sim(q_emb, i_embs)[0]

    TOP_N = min(20, len(items))
    top_results = cos_scores.topk(k=TOP_N)

    candidates = []
    for idx in top_results.indices:
        candidates.append({
            "item": items[int(idx)],
            "text": texts[int(idx)]
        })

    # ---------------------------
    # 4️⃣ CROSS-ENCODER (semantic ranking)
    # ---------------------------
    cross_inputs = [(query, c["text"]) for c in candidates]
    cross_scores = cross_encoder.predict(cross_inputs)

    # ---------------------------
    # 5️⃣ SEMANTIC REJECTION
    # ---------------------------
    results = []
    for c, score in zip(candidates, cross_scores):
        ce_score = float(score)
        if not pure_category_query and ce_score < CE_THRESHOLD:
            continue

        item = c["item"]
        results.append({
            "id": item.id,
            "description": item.description,
            "category": item.category,
            "image_url": item.image_url,
            "contact_info": item.contact_info,
            "price": item.price,
            "status": item.status,
            "seller_id": item.seller_id,
            "semantic_score": ce_score
        })

    results.sort(key=lambda x: -x["semantic_score"])
    return results[:top_k]
