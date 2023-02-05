import mongoose from "mongoose";

const UserManagement = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  nomor: {
    type: String,
  },
  role: {
    type: String,
  },
});

export default mongoose.model("usersManagement", UserManagement);
