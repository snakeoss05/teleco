export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const createEquipment = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/api/equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to create equipment");
  }
  return result;
};

export const deleteEquipment = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/api/equipment/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete equipment");
  }
  return data;
};

export const fetchEquipment = async (token: string) => {
  const res = await fetch(`${API_URL}/api/equipment`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch equipment");
  }
  return data.equipment;
};
export const fetchEquipmentById = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/api/equipment/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch equipment");
  }
  return data.equipment;
};
