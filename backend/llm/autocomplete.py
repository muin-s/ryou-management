import os
import requests

def get_autocomplete_suggestions(query: str):
    api_key = os.getenv("API_KEY")
    endpoint = "https://api.perplexity.ai/chat/completions"

    if not api_key:
        print("Error: API_KEY not found in environment")
        return []

    prompt = f"""
You are helping hostel students search products and nearby shops.
Given a partial query, suggest 5 short autocomplete search phrases.
Return ONLY a JSON array of strings. No explanation.

Query: "{query}"
"""

    payload = {
        "model": "sonar",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 80
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        res = requests.post(endpoint, json=payload, headers=headers, timeout=15)
        res.raise_for_status()
        content = res.json()["choices"][0]["message"]["content"].strip()

        # Expecting JSON list
        # Remove markdown if present
        import re
        content = re.sub(r"^```json\s*", "", content)
        content = re.sub(r"\s*```$", "", content)

        import json
        return json.loads(content)

    except Exception as e:
        print("Autocomplete LLM error:", e)
        return []
