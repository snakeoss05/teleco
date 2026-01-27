import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["fdt", "fdh", "IP_MSAN", "SPLITTER", "cabinet", "odf", "pole"],
    },
    status: { type: String, default: "active" },
    zone: { type: String, default: "" },
    notes: { type: String, default: "" },
    ports: { type: Number, default: 0 },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { timestamps: true },
);

// Geo index for map queries
equipmentSchema.index({ location: "2dsphere" });

export default mongoose.model("Equipment", equipmentSchema);
