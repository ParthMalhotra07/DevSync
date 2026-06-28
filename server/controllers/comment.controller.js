import Comment from "../models/Comment.js";
import { sendNotification } from "../socket/index.js";
import Task from "../models/Task.js";

export const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      task: req.params.taskId,
      user: req.user._id,
      content,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "name profilePic",
    );

    // Send Notification to assignee
    const task = await Task.findById(req.params.taskId).populate("assignee");
    if (
      task &&
      task.assignee &&
      task.assignee._id.toString() !== req.user._id.toString()
    ) {
      await sendNotification(
        task.assignee._id,
        `${req.user.name} commented on your task: "${task.title}"`,
        "Mention",
        task._id,
      );
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
