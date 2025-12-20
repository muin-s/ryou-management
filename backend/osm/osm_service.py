import requests
import time
from math import radians, sin, cos, sqrt, atan2

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

LAT = 21.1649329
LON = 79.0518565
RADIUS = 10000

_CACHE = {"timestamp": 0, "data": []}
CACHE_TTL = 3600  # 1 hour

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
    return 2 * R * atan2(sqrt(a), sqrt(1-a))

def fetch_nearby_places():
    now = time.time()

    if now - _CACHE["timestamp"] < CACHE_TTL:
        return _CACHE["data"]

    query = f"""
    [out:json][timeout:25];
    (
      node["shop"](around:{RADIUS},{LAT},{LON});
      node["amenity"](around:{RADIUS},{LAT},{LON});
    );
    out;
    """

    try:
        res = requests.post(OVERPASS_URL, data=query, timeout=30)
        res.raise_for_status()
        data = res.json()
    except Exception as e:
        print("Overpass error:", e)
        return _CACHE["data"]

    places = []
    for el in data.get("elements", []):
        lat, lon = el.get("lat"), el.get("lon")
        places.append({
            "id": el.get("id"),
            "name": el.get("tags", {}).get("name", "Unnamed"),
            "shop": el.get("tags", {}).get("shop"),
            "amenity": el.get("tags", {}).get("amenity"),
            "lat": lat,
            "lon": lon,
            "distance_km": haversine(LAT, LON, lat, lon)
        })

    _CACHE["timestamp"] = now
    _CACHE["data"] = places
    return places
