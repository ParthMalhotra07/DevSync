import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import api from "../utils/api.js";
import TaskDetailModal from "../components/TaskDetailModal.jsx";

const COLUMNS = ["Backlog", "Todo", "In Progress", "Review", "Done"];

const ProjectBoard = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({
    Backlog: [],
    Todo: [],
    "In Progress": [],
    Review: [],
    Done: [],
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Backlog",
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
      ]);

      setProject(projectRes.data);

      const organizedTasks = {
        Backlog: [],
        Todo: [],
        "In Progress": [],
        Review: [],
        Done: [],
      };

      tasksRes.data.forEach((task) => {
        if (organizedTasks[task.status]) {
          organizedTasks[task.status].push(task);
        } else {
          organizedTasks["Backlog"].push(task);
        }
      });

      setTasks(organizedTasks);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch board data", error);
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Optimistic UI update
    const sourceColumn = [...tasks[source.droppableId]];
    const destColumn = [...tasks[destination.droppableId]];

    const [movedTask] = sourceColumn.splice(source.index, 1);
    movedTask.status = destination.droppableId;

    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, movedTask);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
      });
    } else {
      destColumn.splice(destination.index, 0, movedTask);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
    }

    // API Call
    try {
      await api.put(`/tasks/${draggableId}/status`, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error("Failed to update task status", error);
      // Revert optimistic update in a real scenario
      fetchData();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await api.post("/tasks", {
        ...newTask,
        projectId: id,
      });

      const updatedTasks = { ...tasks };
      updatedTasks[response.data.status].push(response.data);
      setTasks(updatedTasks);

      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        status: "Backlog",
      });
      setShowTaskModal(false);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 font-medium">
        Loading Board...
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{project?.name}</h2>
          <p className="mt-1 text-sm text-gray-500">Board View</p>
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-6 items-start min-w-max">
            {COLUMNS.map((columnId) => (
              <div
                key={columnId}
                className="w-80 flex flex-col bg-gray-50/50 rounded-lg shrink-0 max-h-full border border-gray-200 shadow-sm"
              >
                <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg sticky top-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-700 text-sm">
                      {columnId}
                    </h3>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                      {tasks[columnId].length}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${
                        snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                      }`}
                    >
                      {tasks[columnId].map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow group ${
                                snapshot.isDragging
                                  ? "shadow-lg ring-1 ring-blue-500 rotate-2"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                              <h4
                                className="text-sm font-medium text-gray-900 leading-snug cursor-pointer hover:text-blue-600"
                                onClick={() => setSelectedTask(task)}
                              >
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="mt-4 flex items-center justify-between text-gray-400">
                                <div className="flex items-center gap-3">
                                  {task.dueDate && (
                                    <Calendar
                                      size={14}
                                      className="hover:text-blue-500"
                                    />
                                  )}
                                  {task.attachments?.length > 0 && (
                                    <Paperclip size={14} />
                                  )}
                                  {task.comments?.length > 0 && (
                                    <MessageSquare size={14} />
                                  )}
                                </div>

                                {task.assignee && (
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 ring-2 ring-white">
                                    {task.assignee.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Create New Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Add more details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                  >
                    {COLUMNS.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            fetchData(); // Refresh board to reflect new comments/attachments
          }}
        />
      )}
    </div>
  );
};

export default ProjectBoard;
