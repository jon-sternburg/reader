import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const favorites_Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: [true, "Favorite already exists"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Favorites ||
  mongoose.model("Favorites", favorites_Schema);
