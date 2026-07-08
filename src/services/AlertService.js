const BASE_URL = "http://10.160.32.213:5000";

// GET ALL ALERTS
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
