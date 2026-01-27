import Equipment from "../models/equipment.model.js";

// POST /api/equipment
export const createEquipment = async (req, res) => {
  try {
    const { name, type, lat, lng, ports, status, zone, notes } = req.body;
    console.log("Creating equipment with data:", req.body);
    if (!name || !type || !lat || !lng) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const equipment = await Equipment.create({
      name: name,
      type,
      status: status || "active",
      zone: zone || "",
      notes: notes || "",
      ports: ports ? Number(ports) : 0,
      lat: lat,
      lng: lng,
      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      },
    });

    res.status(201).json({
      message: "Equipment created successfully",
      data: equipment,
    });
  } catch (error) {
    console.error("Equipment creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, lat, lng, ports, status, zone, notes } = req.body;

    const updateData = {
      ...(name && { name }),
      ...(type && { type }),
      ...(status && { status }),
      ...(zone !== undefined && { zone }),
      ...(notes !== undefined && { notes }),
      ...(ports !== undefined && { ports: Number(ports) }),
      updatedAt: new Date(),
    };

    if (lat !== undefined && lng !== undefined) {
      updateData.location = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      };
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedEquipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    res.json({
      message: "Equipment updated successfully",
      data: updatedEquipment,
    });
  } catch (error) {
    console.error("Equipment update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// GET /api/equipment
export const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    res.json({ equipment });
  } catch (error) {
    console.error("Equipment fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// DELETE /api/equipment/:id
export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Equipment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    res.json({ message: "Equipment deleted successfully" });
  } catch (error) {
    console.error("Equipment delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// GET /api/equipment/:id
export const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.json({ equipment });
  } catch (error) {
    console.error("Equipment fetch by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
