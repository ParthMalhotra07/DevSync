import React, { useState, useEffect } from "react";
import { X, Send, Paperclip, FileText, Loader2 } from "lucide-react";
import api from "../utils/api.js";
import toast from "react-hot-toast";

const TaskDetailModal = ({ task, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [taskDetails, setTaskDetails] = useState(task);

  useEffect(() => {
    fetchComments();
  }, [task._id]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/tasks/${task._id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/tasks/${task._id}/comments`, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await api.post(`/tasks/${task._id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTaskDetails(response.data);
      toast.success("File attached successfully");
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col m-4 border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {taskDetails.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>{taskDetails.status}</span>
              <span>•</span>
              <span
                className={`px-2 py-0.5 rounded ${
                  taskDetails.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : taskDetails.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {taskDetails.priority}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30 flex flex-col gap-8">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Description
            </h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
              {taskDetails.description || "No description provided."}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Attachments
              </h4>
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Paperclip size={16} />
                  )}
                  Add File
                </label>
              </div>
            </div>

            {taskDetails.attachments && taskDetails.attachments.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {taskDetails.attachments.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">
                      Attachment {idx + 1}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No files attached yet.
              </p>
            )}
          </div>

          {/* Comments */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Activity & Comments
            </h4>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0 ring-2 ring-white shadow-sm">
                    {comment.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-white p-3.5 rounded-lg rounded-tl-none border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.user?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-4">
                  No comments yet. Start the conversation!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Comment Input Footer */}
        <div className="p-4 border-t border-gray-200 bg-white shrink-0">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
