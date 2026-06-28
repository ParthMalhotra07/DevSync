import Task from "../models/Task.js";
import Project from "../models/Project.js";

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      projectId,
      assignee,
      dueDate,
    } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Add user to project members if not already
    if (!project.members.includes(req.user._id)) {
      project.members.push(req.user._id);
      await project.save();
    }

    const task = new Task({
      title,
      description,
      status: status || "Backlog",
      priority: priority || "Medium",
      project: projectId,
      assignee,
      dueDate,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate(
      "assignee",
      "name email profilePic",
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status (drag and drop)
// @route   PUT /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      task.title = req.body.title || task.title;
      task.description =
        req.body.description !== undefined
          ? req.body.description
          : task.description;
      task.status = req.body.status || task.status;
      task.priority = req.body.priority || task.priority;
      task.assignee = req.body.assignee || task.assignee;
      task.dueDate = req.body.dueDate || task.dueDate;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
