const pool = require("../config/db");
const { getNowLocal } = require("../utils/datetime");
const DOMPurify = require("dompurify");

//routes table
const createPost = async (post) => {
  console.log(post);
  try {
    const [result] = await pool.execute(
      `INSERT INTO posts 
      (mosque_id, create_time, created_by, content) 
      VALUES (?, ?, ?, ?)`,
      [post.mosque_id, getNowLocal(), post.userID, post.content]
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
    let countQuery = "SELECT COUNT(*) as total FROM posts ";

    let queryParams = [];
    let countParams = [];

    if (mosque_id) {
      query += " WHERE mosque_id = ? OR mosque_id IS NULL";
      countQuery += " WHERE mosque_id = ? OR mosque_id IS NULL";
      queryParams.push(mosque_id);
      countParams.push(mosque_id);
    }

    query += " ORDER BY create_time DESC LIMIT 5 OFFSET ?";
    queryParams.push(offset);

    // Run both queries
    const [posts] = await pool.execute(query, queryParams);
    const [countResult] = await pool.execute(countQuery, countParams);
    const totalPosts = countResult[0]?.total ?? 0;

    return {
      posts,
      totalPosts,
    };
  } catch (error) {
    console.error("Error retrieving mosque by ID:", error);
    throw new Error("Failed to retrieve mosque by ID.");
  }
};

const updatePost = async (post, user) => {
  try {
    const [result] = await pool.execute(
      `UPDATE posts SET update_time = ?, updated_by = ?, content = ? WHERE post_id = ? AND mosque_id = ?`,
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
  updatePost,
};
