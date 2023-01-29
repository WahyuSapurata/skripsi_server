import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";

dotenv.config();

const app = express();
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database Connected..."));

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(UserRoute);

app.listen(process.env.PORT, () =>
  console.log("server up and running port", process.env.PORT)
);
