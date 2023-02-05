import mongoose from "mongoose";

const User = mongoose.Schema({
  name_bisnis: {
    type: String,
  },
  alamat_bisnis: {
    type: String,
  },
  nama_pengguna: {
    type: String,
  },
  email_pengguna: {
    type: String,
  },
  nomor_pengguna: {
    type: String,
  },
  image: {
    type: String,
  },
  url: {
    type: String,
  },
  password: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
});

export default mongoose.model("users", User);
