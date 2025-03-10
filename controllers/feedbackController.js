// Done 100%

const Feedback = require("../models/Feedbacks");

exports.createFeedback = async (req, res, next) => {
  console.log("feedback");

  const { feedback } = req.body;
  try {
    const feedback_id = await Feedback.createFeedback(feedback);
    res.status(201).json({
      message: `Your message was recived`,
    });
  } catch (error) {
    console.error("Error creating a feedback:", error);
    next({
      message: "Error during creating feedback",
    });
  }
};

exports.getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.getAllFeedback();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error in getting all feedbacks:", error);
    next({
      message: "Error getting feedbacks.",
    });
  }
};

exports.markFeedbackAsCompleted = async (req, res, next) => {
  const { id } = req.params;
  try {
    const feedback = await Feedback.completeFeedback(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Marked as completed" });
  } catch (error) {
    console.error("Error in complete feedback controller:", error);
    next({
      message: "Error completing feedback.",
    });
  }
};
