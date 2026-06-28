import Project from "../models/Project.js";
import Team from "../models/Team.js";

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { name, description, teamId, deadline } = req.body;

    // Check if team exists and user is part of it
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to create project in this team" });
    }

    const project = new Project({
      name,
      description,
      team: teamId,
      members: [req.user._id],
      deadline,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for a team
// @route   GET /api/projects/team/:teamId
// @access  Private
export const getProjectsByTeam = async (req, res) => {
  try {
    const projects = await Project.find({ team: req.params.teamId }).populate(
      "members",
      "name email profilePic",
    );

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email profilePic")
      .populate("team", "name");

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
