const pool = require("../config/db");
const { getNowLocal } = require("../utils/datetime");
const DOMPurify = require("dompurify");

//routes table
const createPost = async (post) => {
  console.log(post);
  try {
    const [result] = await pool.execute(
      `INSERT INTO posts 
      (mosque_id, time, created_by, updated_by, contant) 
      VALUES (?, ?, ?, ?, ?)`,
      [post.mosque_id, getNowLocal(), post.userID || null, null, post.contant]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post.");
  }
};

const getPosts = async (offset, mosque_id) => {
  try {
    // Build the SQL query based on the presence of mosqueId
    let query = "SELECT * FROM posts";
    let queryParams = [];

    if (mosque_id) {
      query += " WHERE mosque_id = ?";
      queryParams.push(mosque_id);
    }

    query += " ORDER BY time DESC LIMIT 5 OFFSET ?";
    queryParams.push(offset);

    const [rows] = await pool.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error retrieving mosque by ID:", error);
    throw new Error("Failed to retrieve mosque by ID.");
  }
};

const getPostByID = async (mosque_id) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM mosques WHERE id = ?", [
      mosque_id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error retrieving mosque by ID:", error);
    throw new Error("Failed to retrieve mosque by ID.");
  }
};

const updatePost = async (mosque_id, fieldsToUpdate, connection = pool) => {
  const allowedFields = [
    "name",
    "address",
    "eircode",
    "location",
    "contact_number",
    "website",
    "iban",
  ];

  // Filter out invalid fields
  const invalidFields = Object.keys(fieldsToUpdate).filter(
    (field) => !allowedFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields provided: ${invalidFields.join(", ")}.`);
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No fields to update provided.");
  }

  // Generate the SET clause dynamically
  const setClause = Object.keys(fieldsToUpdate)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = [...Object.values(fieldsToUpdate), mosque_id];

  try {
    const [result] = await connection.execute(
      `UPDATE mosques SET ${setClause} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating mosque:", error);
    throw new Error("Failed to update mosque.");
  }
};

const deletePost = async (mosque_id) => {
  try {
    const [result] = await pool.execute("DELETE FROM mosques WHERE id = ?", [
      mosque_id,
    ]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error deleting mosque:", error);
    throw new Error("Failed to delete mosque.");
  }
};

module.exports = {
  createPost,
  getPosts,
};
