import pandas as pd
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from ml.nlp_preprocess import preprocess

# Get the directory where this file is located
ML_DIR = os.path.dirname(os.path.abspath(__file__))

# Load dataset
DATA_PATH = os.path.join(ML_DIR, "issue_dataset.csv")
df = pd.read_csv(DATA_PATH)

# Preprocess text
df["clean_text"] = df["description"].apply(preprocess)

X = df["clean_text"]
y = df["category"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# TF-IDF + Linear SVM
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        ngram_range=(1, 2),
        max_df=0.9,
        min_df=2
    )),
    ("svm", LinearSVC())
])

model.fit(X_train, y_train)

# Evaluation
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Save model
MODEL_PATH = os.path.join(ML_DIR, "issue_category_svm.pkl")
joblib.dump(model, MODEL_PATH)

print("✅ Model trained and saved at:", MODEL_PATH)
