import mongoose from "mongoose";

const reqStr = {
  type: String,
  required: true,
};

// User Schema
const UserSchema = new mongoose.Schema({
  name: reqStr,
  username: reqStr,
  password: reqStr,
  email: reqStr,
});

export default mongoose.model("User", UserSchema);
