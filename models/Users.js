const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const [rows] = await pool.execute(
    "INSERT INTO users ( name, email, contact_number,password,settings) VALUES (?, ?, ?, ?, ?)",
    [
      user.name,
      user.email,
      user.phoneNumber,
      hashedPassword,
      JSON.stringify(user.settings),
    ]
  );
  return rows.insertId;
};

const getUser = async (user_email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    user_email,
  ]);
  return rows[0];
};

const getUserByID = async (user_ID) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [
    user_ID,
  ]);
  return rows[0];
};

const getModifiedUser = async (user_ID, last_update) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE id = ? and modified_on >= ?",
    [user_ID, last_update]
  );
  return rows[0] || null;
};

const deleteUser = async (user_id) => {
  const [rows] = await pool.execute("DELETE FROM users WHERE id = ?;", [
    user_id,
  ]);
  return rows.affectedRows;
};

const updateAccountStatus = async (id, account_status) => {
  const [rows] = await pool.execute(
    `UPDATE users SET account_status =?  WHERE id = ? `,
    [account_status, id]
  );
  return rows.affectedRows;
};

const updateUUID = async (id, UUID) => {
  const [rows] = await pool.execute(`UPDATE users SET UUID =?  WHERE id = ? `, [
    UUID,
    id,
  ]);
  return rows.affectedRows;
};

const updateSettings = async (userID, settings) => {
  const [rows] = await pool.query(
    `UPDATE users SET settings =?  WHERE id = ? `,
    [JSON.stringify(settings), userID]
  );
  return rows.affectedRows;
};

module.exports = {
  createUser,
  deleteUser,
  getUser,
  getUserByID,
  updateAccountStatus,
  getModifiedUser,
  updateUUID,
  updateSettings,
};
