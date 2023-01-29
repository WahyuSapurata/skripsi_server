import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  const { password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ message: "password dan confirm password tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    req.body["password"] = hashPassword;
    await User.create(req.body);
    res.status(201).json({ message: "user create success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({
      email_pengguna: req.body.email_pengguna,
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ message: "password salah" });
    const userId = user.id;
    const nama_pengguna = user.nama_pengguna;
    const email_pengguna = user.email_pengguna;
    const accessToken = Jwt.sign(
      { userId, nama_pengguna, email_pengguna },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    await User.findByIdAndUpdate(userId, {
      $set: { refresh_token: accessToken },
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ message: "email pengguna tidak ditemukan" });
  }
};

export const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(204);
  const user = await User.findOne({
    refresh_token: token,
  });
  if (!user) return res.sendStatus(204);
  const userId = user.id;
  await User.findByIdAndUpdate(userId, {
    $set: { refresh_token: null },
  });
  return res.status(200).json({ message: "berhasil logout" });
};
