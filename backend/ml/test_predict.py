from predict_category import predict_category

test_cases = [
    "WiFi is not working properly in my room",
    "There is no water supply since morning",
    "The study table and chair are broken"
]

for text in test_cases:
    print(text, "->", predict_category(text))
