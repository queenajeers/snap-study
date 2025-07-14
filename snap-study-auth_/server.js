// server.js
import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Server running" });
});
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
