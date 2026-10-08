import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import db from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());


// =============================
// REGISTER
// =============================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, dob, email, password } = req.body;

    if (!username || !dob || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Username or email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.execute(
      `INSERT INTO users
       (username, dob, email, password_hash)
       VALUES (?, ?, ?, ?)`,
      [username, dob, email, passwordHash]
    );

    res.status(201).json({
      message: "Account created successfully!",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});


// =============================
// LOGIN
// =============================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        message: "Username/email and password are required.",
      });
    }

    const [users] = await db.execute(
      `SELECT id, username, dob, email, password_hash
       FROM users
       WHERE username = ? OR email = ?
       LIMIT 1`,
      [usernameOrEmail, usernameOrEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid username/email or password.",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username/email or password.",
      });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        dob: user.dob,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});


// =============================
// START SERVER
// =============================

app.listen(5000, () => {
  console.log("✅ SignVerse backend running on http://localhost:5000");
});