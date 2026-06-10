const BASE_URL = "http://192.168.0.8:5000";

export const fetchEvents = async () => {
  try {
    const res = await fetch(`${BASE_URL}/events`);
    if (!res.ok) throw new Error("Failed to fetch events");

    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    return [];
  }
};