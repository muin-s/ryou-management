# backend/ml/product_mapper.py

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from ml.nlp_preprocess import preprocess_text

# Categories with semantic descriptions
CATEGORIES = {
    "electronics": "earbuds earphones headphones charger mobile phone laptop tablet electronics gadgets",
    "furniture": "table chair desk bed cupboard furniture wooden",
    "stationery": "pen notebook book register marker stationery",
    "general_store": "daily needs grocery convenience store"
}

# Prepare corpus
category_names = list(CATEGORIES.keys())
category_texts = list(CATEGORIES.values())

vectorizer = TfidfVectorizer()
category_vectors = vectorizer.fit_transform(category_texts)

OSM_TAGS = {
    "electronics": [{"key": "shop", "value": "electronics"}],
    "furniture": [{"key": "shop", "value": "furniture"}],
    "stationery": [{"key": "shop", "value": "stationery"}],
    "general_store": [{"key": "shop", "value": "convenience"}],
}

def map_product_to_osm(query: str):
    processed_query = preprocess_text(query)

    query_vector = vectorizer.transform([processed_query])
    similarities = cosine_similarity(query_vector, category_vectors)[0]

    best_index = similarities.argmax()
    best_category = category_names[best_index]

    return {
        "category": best_category,
        "osm_tags": OSM_TAGS[best_category],
        "confidence": float(similarities[best_index])
    }
