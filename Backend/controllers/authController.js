import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    res.json({ success: false, message: "Email already registered" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (!rows.length)
    return res.json({ success: false, message: "User not found" });

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.json({ success: false, message: "Incorrect password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ success: true, token, name: user.name });
};