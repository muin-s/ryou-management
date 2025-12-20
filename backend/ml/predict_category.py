import os
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# --- One-time NLP tools ---
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

# --- Load model only once ---
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "issue_category_svm.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("❌ SVM model not found. Train model first.")

model = joblib.load(MODEL_PATH)


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    tokens = text.split()
    tokens = [
        lemmatizer.lemmatize(w)
        for w in tokens
        if w not in stop_words
    ]
    return " ".join(tokens)


def predict_category(description: str) -> str:
    cleaned = clean_text(description)
    prediction = model.predict([cleaned])
    return prediction[0]
