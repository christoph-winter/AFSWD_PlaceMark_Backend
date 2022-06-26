import Mongoose from "mongoose";

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
  isadmin: {
    type: Boolean,
    default: false,
  },
});
export const User = Mongoose.model("User", userSchema);
