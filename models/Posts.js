const pool = require("../config/db");
const { getNowLocal } = require("../utils/datetime");
const DOMPurify = require("dompurify");

//routes table
const createPost = async (post) => {
  console.log(post);
  try {
    const [result] = await pool.execute(
      `INSERT INTO posts 
      (mosque_id, time, created_by, updated_by, content) 
      VALUES (?, ?, ?, ?, ?)`,
      [post.mosque_id, getNowLocal(), post.userID || null, null, post.content]
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

const updatePost = async (post, user) => {
  try {
    const [result] = await pool.execute(
      `UPDATE posts SET time = ?, updated_by = ?, content = ? WHERE post_id = ? AND mosque_id = ?`,
      [getNowLocal(), user.userID, post.content, post.post_id, user.mosqueID]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating mosque:", error);
    throw new Error("Failed to update mosque.");
  }
};

const deletePost = async (postID, mosqueID) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM posts WHERE post_id = ? and mosque_id = ?",
      [postID, mosqueID]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error deleting mosque:", error);
    throw new Error("Failed to delete mosque.");
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  updatePost
};
