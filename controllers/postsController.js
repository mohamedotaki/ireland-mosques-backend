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
