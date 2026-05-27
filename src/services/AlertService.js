const BASE_URL = "http://127.0.0.1:5000";

// =========================
// GET ALL ALERTS
// =========================
export const fetchAlerts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/alerts`);

    if (!response.ok) {
      throw new Error("Failed to fetch alerts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching alerts:", error);
    return [];
  }
};

// =========================
// OPTIONAL: CLEAR ALERTS
// =========================
export const clearAlerts = async () => {
  try {
    await fetch(`${BASE_URL}/alerts`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("❌ Error clearing alerts:", error);
  }
};