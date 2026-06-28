import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { Users, Plus, Building2 } from "lucide-react";

const Teams = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrgId) {
      fetchTeams(selectedOrgId);
    } else {
      setTeams([]);
    }
  }, [selectedOrgId]);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organizations");
      setOrganizations(response.data);
      if (response.data.length > 0) {
        setSelectedOrgId(response.data[0]._id);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to load organizations", error);
      setLoading(false);
    }
  };

  const fetchTeams = async (orgId) => {
    try {
      const response = await api.get(`/teams/${orgId}`);
      setTeams(response.data);
    } catch (error) {
      console.error("Failed to load teams", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim() || !selectedOrgId) return;

    try {
      const response = await api.post("/teams", {
        name: newTeamName,
        organizationId: selectedOrgId,
      });
      setTeams([...teams, response.data]);
      setNewTeamName("");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create team", error);
    }
  };

  if (loading) return <div className="p-8">Loading teams...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view your teams across organizations.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedOrgId}
          className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition-colors text-sm font-medium ${
            selectedOrgId
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Plus size={16} />
          New Team
        </button>
      </div>

      {organizations.length > 0 ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Organization
          </label>
          <div className="relative max-w-xs">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
            >
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be part of an organization to create or view teams.{" "}
                <a
                  href="/organizations"
                  className="font-medium underline text-yellow-700 hover:text-yellow-600"
                >
                  Go to Organizations
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedOrgId && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                    <Users size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.name}
                  </h3>
                </div>
                <div className="flex -space-x-2 overflow-hidden mb-2">
                  {team.members?.slice(0, 5).map((member, idx) => (
                    <div
                      key={idx}
                      className="inline-block h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-600"
                      title={member.user?.name}
                    >
                      {member.user?.name
                        ? member.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  ))}
                  {team.members?.length > 5 && (
                    <div className="inline-block h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-500">
                      +{team.members.length - 5}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {team.members?.length || 0} members
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <a
                  href={`/teams/${team._id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View Team &rarr;
                </a>
              </div>
            </div>
          ))}

          {teams.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No teams found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new team in this organization.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Create Team</h3>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Engineering"
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

export default Teams;
