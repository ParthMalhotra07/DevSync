import Organization from "../models/Organization.js";

// @desc    Get all organizations for logged in user
// @route   GET /api/organizations
// @access  Private
export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new organization
// @route   POST /api/organizations
// @access  Private
export const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;

    const organization = new Organization({
      name,
      owner: req.user._id,
      members: [req.user._id],
    });

    const createdOrganization = await organization.save();
    res.status(201).json(createdOrganization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single organization by ID
// @route   GET /api/organizations/:id
// @access  Private
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate("owner", "name email profilePic")
      .populate("members", "name email profilePic");

    if (organization) {
      res.json(organization);
    } else {
      res.status(404).json({ message: "Organization not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
