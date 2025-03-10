const pool = require("../config/db");

const createFeedback = async (feedback) => {
  const [rows] = await pool.execute(
    "INSERT INTO feedbacks (mosque_id,name,email,message ,type) VALUES (?,?,?,?,?)",
    [
      feedback?.mosque_id || null,
      feedback.name,
      feedback.email,
      feedback.message,
      feedback?.mosque_id ? feedback.mosque_id : "App",
    ]
  );
  return rows.insertId;
};

const getAllFeedback = async () => {
  const [rows] = await pool.execute("SELECT *  FROM feedbacks");
  return rows;
};

const completeFeedback = async (feedback_id) => {
  const [rows] = await pool.execute(
    "UPDATE feedbacks SET statues =? WHERE id = ?",
    ["Completed", feedback_id]
  );
  return rows.affectedRows;
};

module.exports = {
  createFeedback,
  getAllFeedback,
  completeFeedback,
};
