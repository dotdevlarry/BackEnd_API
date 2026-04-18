const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
  const { fullname, phone_number, full_address, gmaps_pin, password, confirm_password } = req.body;

  try {

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users 
      (fullname, phone_number, full_address, gmaps_pin, password, confirm_password)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [fullname, phone_number, full_address, gmaps_pin, hashedPassword, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// LOGIN
const login = async (req, res) => {
  const { phone_number, password } = req.body;

  try {

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE phone_number = ?",
      [phone_number]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
     { user_id: user.id, phone_number: user.phone_number },
      process.env.JWT_SECRET,        // ← must match .env
  { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME }
);

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login }; 