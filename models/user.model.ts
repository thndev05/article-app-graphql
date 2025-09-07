import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
}, {
  timestamps: true,
  versionKey: false
});

const User = mongoose.model("User", userSchema, "users");

export default User;
