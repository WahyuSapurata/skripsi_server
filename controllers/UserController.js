import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
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
    const name_bisnis = user.name_bisnis;
    const alamat_bisnis = user.alamat_bisnis;
    const nomor_pengguna = user.nomor_pengguna;
    const url = user.url;
    const accessToken = Jwt.sign(
      {
        userId,
        nama_pengguna,
        email_pengguna,
        name_bisnis,
        alamat_bisnis,
        nomor_pengguna,
        url,
      },
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

export const updateUser = async (req, res) => {
  const user = await User.findById({
    _id: req.params.id,
  });
  if (!user) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files == null) {
    fileName = user.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    if (user.image == null) {
    } else {
      const filepath = `./public/images/${user.image}`;
      fs.unlinkSync(filepath);
    }

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    req.body["image"] = fileName;
    req.body["url"] = url;
    await User.updateOne({ _id: req.params.id }, { $set: req.body });
    const user = await User.findById({
      _id: req.params.id,
    });
    res.status(200).json({ message: "user update success", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
