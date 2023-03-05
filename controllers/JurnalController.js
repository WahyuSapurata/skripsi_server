import Jurnal from "../models/Jurnal.js";
import path from "path";
import fs from "fs";

export const getJurnal = async (req, res) => {
  try {
    const junal = await Jurnal.find();
    res.status(200).json(junal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJurnalById = async (req, res) => {
  try {
    const jurnal = await Jurnal.findById(req.params.id);
    res.json(jurnal);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addJurnal = async (req, res) => {
  let fileName = "";
  if (req.files === null) {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });
    file.mv(`./public/jurnal/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get("host")}/jurnal/${fileName}`;
  try {
    req.body["image"] = fileName;
    req.body["url"] = url;
    await Jurnal.create(req.body);
    res.status(201).json({ message: "jurnal Created Successfuly" });
  } catch (error) {
    res.status(422).json(error.message);
  }
};

export const updateJurnal = async (req, res) => {
  const jurnal = await Jurnal.findById({
    _id: req.params.id,
  });
  if (!jurnal) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files == null) {
    fileName = jurnal.image;
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

    if (jurnal.image == null) {
    } else {
      const filepath = `./public/jurnal/${jurnal.image}`;
      fs.unlinkSync(filepath);
    }

    file.mv(`./public/jurnal/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get("host")}/jurnal/${fileName}`;

  try {
    req.body["image"] = fileName;
    req.body["url"] = url;
    await Jurnal.updateOne({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({ message: "jurnal update success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteJurnal = async (req, res) => {
  const jurnal = await Jurnal.findById({
    _id: req.params.id,
  });
  if (!jurnal) return res.status(404).json({ msg: "No Data Found" });

  try {
    if (jurnal.image == "") {
    } else {
      const filepath = `./public/jurnal/${jurnal.image}`;
      fs.unlinkSync(filepath);
    }
    await Jurnal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "jurnal delete success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
