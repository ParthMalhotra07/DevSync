import Team from "../models/Team.js";
import Organization from "../models/Organization.js";

// @desc    Create a new team in an organization
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req, res) => {
  try {
    const { name, organizationId } = req.body;

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if user is owner or member of org
    if (
      organization.owner.toString() !== req.user._id.toString() &&
      !organization.members.includes(req.user._id)
    ) {
      return res
        .status(403)
        .json({
          message: "Not authorized to create team in this organization",
        });
    }

    const team = new Team({
      name,
      organization: organizationId,
      members: [{ user: req.user._id, role: "Owner" }],
    });

    const createdTeam = await team.save();
    res.status(201).json(createdTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get teams by organization
// @route   GET /api/teams/:orgId
// @access  Private
export const getTeamsByOrg = async (req, res) => {
  try {
    const teams = await Team.find({ organization: req.params.orgId }).populate(
      "members.user",
      "name email profilePic",
    );

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
