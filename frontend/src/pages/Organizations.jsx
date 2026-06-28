import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { Building2, Plus, Users } from "lucide-react";

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organizations");
      setOrganizations(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load organizations", error);
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    try {
      const response = await api.post("/organizations", { name: newOrgName });
      setOrganizations([...organizations, response.data]);
      setNewOrgName("");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create organization", error);
    }
  };

  if (loading) return <div className="p-8">Loading organizations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organizations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view your organizations.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Organization
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <div
            key={org._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
                  <Building2 size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {org.name}
                </h3>
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-2 mb-4">
                <Users size={16} />
                <span>{org.members?.length || 0} Members</span>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <a
                href={`/organizations/${org._id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View Details &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>

      {organizations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No organizations
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new organization.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Create Organization</h3>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organizations;
