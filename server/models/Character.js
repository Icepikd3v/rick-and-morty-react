const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    species: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "RmUser", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RmCharacter", characterSchema);
