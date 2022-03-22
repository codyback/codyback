import express from "express";
import path from "path";
import { errorHandler } from "./middleware/errorMiddleware";
import { connectDB } from "./config/db";
const dotenv = require("dotenv").config();

connectDB();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/tilde", (req, res) => {
  res.sendFile(path.join(__dirname, "public/tilde/index.html"));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
