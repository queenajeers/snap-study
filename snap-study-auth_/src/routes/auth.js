// routes/auth.js
import express from "express";
import { auth } from "../firebase/admin.js";

const authRouter = express.Router();

authRouter.post("/google-signin", async (req, res) => {
  const { idToken } = req.body;
  console.log(idToken);
  try {
    const decoded = await auth.verifyIdToken(idToken);
    res.json({ uid: decoded.uid, email: decoded.email });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

export default authRouter;
