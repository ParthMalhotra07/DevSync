import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Assignment", "Mention", "Invite", "System"],
      default: "System",
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId, // Could be task ID, team ID, etc.
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
