CATEGORY_KEYWORDS = {
    "sports": [
        "sport", "sports",
        "cricket", "football", "volleyball", "badminton", "basketball",
        "bat", "ball", "stumps", "racket", "shuttle",
        "gym", "dumbbell", "yoga", "mat", "fitness", "skipping"
    ],

    "electronics": [
        "mobile", "phone", "smartphone",
        "laptop", "tablet",
        "charger", "cable", "usb", "type-c",
        "earphone", "headphone", "earbuds",
        "mouse", "keyboard", "pendrive",
        "powerbank", "adapter", "extension"
    ],

    "food": [
        "food", "snack", "snacks",
        "biscuit", "chips", "namkeen",
        "noodles", "maggi", "pasta",
        "chocolate", "sweets",
        "coffee", "tea", "milk powder",
        "protein", "oats", "peanut butter",
        "tiffin", "lunch box", "mug"
    ],

    "cloth": [
        "cloth", "clothing",
        "shirt", "tshirt", "t-shirt",
        "jeans", "pants", "trousers",
        "shorts", "trackpant",
        "sweater", "hoodie", "jacket", "coat",
        "uniform",
        "cap", "belt", "scarf"
    ],

    "books": [
        "book", "books", "textbook", "guide", "reference",
        "notes", "record", "journal",
        "exam", "gate", "jee", "neet", "upsc",
        "novel", "magazine",
        "notebook", "register", "file","coding","DSA",
        "pen", "pencil", "calculator"
    ],
}


def detect_category_from_query(query: str):
    q = query.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(k in q for k in keywords):
            return category
    return None


def is_pure_category_query(query, category):
    return query.strip().lower() == category