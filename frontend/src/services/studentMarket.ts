const API_BASE = "http://localhost:5000";

export async function searchNearbyShops(query: string, token: string) {
  const res = await fetch(`${API_BASE}/api/student/nearby-shops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch nearby shops");
  }

  return res.json();
}
