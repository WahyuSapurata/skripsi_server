import UserManagement from "../models/UserManagement.js";

export const getUserManagement = async (req, res) => {
  try {
    const userManagement = await UserManagement.find().sort({ _id: -1 });
    res.status(200).json({ success: true, result: userManagement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserManagementById = async (req, res) => {
  try {
    const userManagement = await UserManagement.findById(req.params.id);
    res.json(userManagement);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const saveUserManagement = async (req, res) => {
  try {
    await UserManagement.create(req.body);
    res.status(200).json({ message: "data create success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserManagement = async (req, res) => {
  try {
    await UserManagement.updateOne({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({ message: "data update success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUserManagement = async (req, res) => {
  try {
    await UserManagement.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "data delete success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
