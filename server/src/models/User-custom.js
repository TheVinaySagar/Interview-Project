import mongoose from "mongoose";
import bcrypt from "bcrypt"; // ✅ Password hashing ke liye

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, sparse: true }, // ✅ Firebase users ke liye
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, sparse: true }, // ✅ Local auth ke liye
  password: { type: String }, // ✅ Local auth ke liye hashed password
  avatar: { type: String, default: "https://cdn.example.com/default-avatar.png" },
  authMethod: { type: String, enum: ["local", "firebase"], required: true }, // ✅ Identify user type
});

// ✅ Hash password before saving (for local users)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
