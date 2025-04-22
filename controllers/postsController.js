const Posts = require("../models/Posts");

//create routes
exports.createPost = async (req, res, next) => {
  try {
    const { post, user } = req.body;
    const postData = { ...post, mosque_id: user.mosqueID, userID: user.userID };

    const postID = await Posts.createPost(postData);

    res.status(201).json({ message: "Post was added" });
  } catch (error) {
    console.error(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const mosqueId = req.query.mosqueId ? parseInt(req.query.mosqueId) : null; // If mosqueId is provided, use it, else null.
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page param is provided.
    const offset = (1 - 1) * 5; // Calculate the offset for pagination.

    const posts = await Posts.getPosts(offset, mosqueId);

    res.status(201).json({ posts });
  } catch (error) {
    console.error(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { user } = req.body;
    const { id } = req.params;

    const deleted = await Posts.deletePost(id, user.mosqueID);

    if (deleted) {
      res.status(200).json({ message: "Post was deleted" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Unkown error" });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { post, user } = req.body;

    const updated = await Posts.updatePost(post, user);

    if (updated) {
      res.status(200).json({ message: "Post was updated" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Unkown error" });
  }
};
