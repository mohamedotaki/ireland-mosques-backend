const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const [rows] = await pool.execute(
    "INSERT INTO users ( name, email, contact_number,password) VALUES (?, ?, ?, ?)",
    [user.name, user.email, user.phoneNumber, hashedPassword]
  );
  return rows.insertId;
};

const getUser = async (user_email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    user_email,
  ]);
  return rows;
};

const deleteUser = async (user_id) => {
  const [rows] = await pool.execute("DELETE FROM users WHERE id = ?;", [
    user_id,
  ]);
  return rows.affectedRows;
};

module.exports = {
  createUser,
  deleteUser,
  getUser,
};
