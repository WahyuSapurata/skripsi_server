import User from "../models/UserModel.js";
import Jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);
    const user = await User.findOne({
      refresh_token: token,
    });

    if (!user) return res.sendStatus(403);
    Jwt.verify(
      user.refresh_token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decode) => {
        if (err instanceof Jwt.TokenExpiredError || !err) {
          const userId = user.id;
          const nama_pengguna = user.nama_pengguna;
          const email_pengguna = user.email_pengguna;
          const accessToken = Jwt.sign(
            { userId, nama_pengguna, email_pengguna },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "20s" }
          );
          res.json({ accessToken });
        } else return res.status(403).json(err);
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
