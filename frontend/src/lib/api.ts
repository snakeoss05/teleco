export const API_URL =
  import.meta.env.VITE_API_URL || "https://teleco-production.up.railway.app";

export const createEquipment = async (data: any) => {
  const res = await fetch(`${API_URL}/api/equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to create equipment");
  }
  return result;
};

export const deleteEquipment = async (id: string) => {
  const res = await fetch(`${API_URL}/api/equipment/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete equipment");
  }
  return data;
};

export const fetchEquipment = async () => {
  const res = await fetch(`${API_URL}/api/equipment`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch equipment");
  }
  return data.equipment;
};
export const fetchEquipmentById = async (id: string) => {
  const res = await fetch(`${API_URL}/api/equipment/${id}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch equipment");
  }
  return data.equipment;
};
