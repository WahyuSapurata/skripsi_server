import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import UserManagementRoute from "./routes/UserManagementRoute.js";
import JurnalRoute from "./routes/JurnalRoute.js";

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
app.use(fileUpload());
app.use(express.static("public"));
app.use(UserRoute, UserManagementRoute, JurnalRoute);

app.listen(process.env.PORT, () =>
  console.log("server up and running port", process.env.PORT)
);
