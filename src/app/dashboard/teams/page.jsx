"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { FadeIn, GlowButton, StaggerContainer, StaggerItem } from "@/components/animations";
import {
  Users, Plus, Search, Trash2, Edit3, X, Loader2, Key, AlertTriangle,
  Save, Copy, Check, Shield, UserCheck, ChevronRight, Crown,
} from "lucide-react";

export default function TeamsPage() {
  const { user } = useAuth();
  const [adminTeams, setAdminTeams] = useState([]);
  const [memberTeams, setMemberTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [showEdit, setShowEdit] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [createForm, setCreateForm] = useState({ teamName: "", teamDescription: "" });
  const [editForm, setEditForm] = useState({ teamName: "", teamDescription: "" });
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const normalizeteamName = (value) => value.trim().toLowerCase();
  const teamNameExists = (name, ignoreKey = null) => {
    const normalized = normalizeteamName(name);
    return [...adminTeams, ...memberTeams].some(
      (team) => team.teamKey !== ignoreKey && normalizeteamName(team.teamName || "") === normalized,
    );
  };

 const fetchTeams = useCallback(async () => {
  try {
    const [adminRes, memberRes] = await Promise.all([
      api.listAdminTeams(),
      api.listMemberTeams().catch(() => ({ ok: false })),
    ]);

    setAdminTeams([]);
    setMemberTeams([]);

    if (adminRes.ok && Array.isArray(adminRes.data?.data)) {
      setAdminTeams(adminRes.data.data);
    }

    if (memberRes.ok && Array.isArray(memberRes.data?.data)) {
      const adminKeys = new Set(
        (adminRes.data?.data || []).map((t) => t.teamKey)
      );

      setMemberTeams(
        memberRes.data.data.filter((t) => !adminKeys.has(t.teamKey))
      );
    }
  } catch (err) {
    console.error("fetchTeams error", err);
  } finally {
    setLoading(false);
  }
}, []);



  useEffect(() => { fetchTeams(); }, [fetchTeams]);

const handleCreate = async (e) => {
  e.preventDefault();
  setError("");
  setCreateLoading(true);

  try {
    const res = await api.createTeam(createForm);

    if (!res.ok) {
      setError(res.data?.message || "Failed to create team");
      return;
    }

    setShowCreate(false);
    setCreateForm({ teamName: "", teamDescription: "" });

    setLoading(true);
    await fetchTeams();

  } catch (err) {
    setError("Network error");
  } finally {
    setCreateLoading(false);
  }
};



  const handleDelete = async (teamKey) => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      const res = await api.deleteTeam({ teamKey });
      if (res.ok) {
        setShowDelete(null);
        setSelectedTeam(null);
        fetchTeams();
      } else {
        setDeleteError(res.data?.message || "Failed to delete team");
      }
    } catch {
      setDeleteError("Network error");
    }
    setDeleteLoading(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError("");

    const payload = {
      teamKey: showEdit.teamKey,
    };

    // send ONLY if changed
    if (editForm.teamName.trim() !== showEdit.teamName) {
      payload.newTeamName = editForm.teamName.trim();
    }

    if ((editForm.teamDescription || "") !== (showEdit.teamDescription || "")) {
      payload.newTeamDescription = editForm.teamDescription.trim();
    }

    // nothing changed
    if (!payload.newTeamName && !payload.newTeamDescription) {
      setError("No changes detected");
      setEditLoading(false);
      return;
    }

    try {
      const res = await api.updateTeam(payload);

      if (res.ok) {
        setShowEdit(null);
        fetchTeams();
      } else {
        setError(res.data?.message || "Failed to update team");
      }
    } catch {
      setError("Network error");
    }

    setEditLoading(false);
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await api.searchTeam({ teamKey: searchQuery.trim() });
      if (res.ok && res.data?.data) {
        setSearchResult(res.data.data);
      } else {
        setSearchResult("not_found");
      }
    } catch { setSearchResult("not_found"); }
    setSearching(false);
  };

  const openEdit = (team, e) => {
    e?.stopPropagation();
    setEditForm({ teamName: team.teamName, teamDescription: team.teamDescription || "" });
    setShowEdit(team);
    setError("");
  };

  const copyTeamKey = (key, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const allTeams = adminTeams.length + memberTeams.length;

  const TeamCard = ({ team, isAdmin }) => (
    <motion.div
      layout
      whileHover={{ scale: 1.01, borderColor: "rgba(99,102,241,0.3)" }}
      whileTap={{ scale: 0.995 }}
      onClick={() => setSelectedTeam(team)}
      className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 cursor-pointer transition-all hover:bg-white/[0.04]"
    >
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-xl font-bold text-indigo-300 transition-transform group-hover:scale-105">
          {team.teamName?.[0]?.toUpperCase() || "T"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-white">{team.teamName}</h3>
            {isAdmin && (
             <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 dark:border-indigo-400/20 px-2.5 py-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">

                <Crown className="h-3 w-3" /> Admin
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{team.teamDescription || "No description"}</p>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <button
              onClick={(e) => copyTeamKey(team.teamKey, e)}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-indigo-400 transition-colors font-mono bg-white/5 rounded-lg px-3 py-1.5 hover:bg-white/10"
            >
              <Key className="h-3.5 w-3.5" />
              <span className="text-sm font-semibold tracking-wide">{team.teamKey}</span>
              {copiedKey === team.teamKey ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
            {team.createdAt && (
              <div className="text-xs text-zinc-600">
                Created {new Date(team.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isAdmin && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => openEdit(team, e)}
                className="rounded-xl p-2.5 text-zinc-500 hover:bg-white/10 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Edit3 className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setDeleteError(""); setShowDelete(team); }}
                className="rounded-xl p-2.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </>
          )}
          <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors ml-1" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Teams</h1>
            <p className="text-sm text-zinc-400 mt-1">Create and manage your teams</p>
          </div>
          <GlowButton
            onClick={() => { setShowCreate(true); setError(""); }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> New Team
          </GlowButton>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.1}>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by team key..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <GlowButton
            type="submit"
            disabled={searching}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </GlowButton>
        </form>
      </FadeIn>

      {/* Search Result */}
      <AnimatePresence>
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {searchResult === "not_found" ? (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-400">
                No team found with that key.
              </div>
            ) : (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
                <div className="flex items-center gap-2 text-xs text-indigo-400 mb-3">
                  <Search className="h-3 w-3" /> Search Result
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-lg font-bold text-indigo-300">
                    {searchResult.teamName?.[0]?.toUpperCase() || "T"}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-white">{searchResult.teamName}</div>
                    <div className="text-sm text-zinc-400">{searchResult.teamDescription || "No description"}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-zinc-400">{searchResult.teamKey}</span>
                      <button onClick={(e) => copyTeamKey(searchResult.teamKey, e)} className="text-zinc-500 hover:text-indigo-400 transition-colors">
                        {copiedKey === searchResult.teamKey ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teams List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : allTeams === 0 ? (
        <FadeIn delay={0.2}>
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Users className="h-16 w-16 text-zinc-700 mb-6" />
            </motion.div>
            <h3 className="text-lg font-semibold text-white">No teams yet</h3>
            <p className="text-sm text-zinc-400 mt-2 max-w-sm">Create your first team to start collaborating with others.</p>
            <GlowButton
              onClick={() => setShowCreate(true)}
              className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Create First Team
            </GlowButton>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-8">
          {/* Admin Teams Section */}
          {adminTeams.length > 0 && (
            <FadeIn delay={0.1}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                    <Shield className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Teams You Manage</h2>
                    <p className="text-xs text-zinc-500">{adminTeams.length} team{adminTeams.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <StaggerContainer className="space-y-3" staggerDelay={0.06}>
                  {adminTeams.map((team, i) => (
                    <StaggerItem key={team._id || i}>
                      <TeamCard team={team} isAdmin={true} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </FadeIn>
          )}

          {/* Member Teams Section */}
          {memberTeams.length > 0 && (
            <FadeIn delay={0.2}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
                    <UserCheck className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Teams You&apos;re a Member Of</h2>
                    <p className="text-xs text-zinc-500">{memberTeams.length} team{memberTeams.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <StaggerContainer className="space-y-3" staggerDelay={0.06}>
                  {memberTeams.map((team, i) => (
                    <StaggerItem key={team._id || i}>
                      <TeamCard team={team} isAdmin={false} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </FadeIn>
          )}
        </div>
      )}

      {/* Team Detail Card Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTeam(null)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl"
            >
              <button onClick={() => setSelectedTeam(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-2xl font-bold text-indigo-300">
                  {selectedTeam.teamName?.[0]?.toUpperCase() || "T"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedTeam.teamName}</h2>
                  <p className="text-sm text-zinc-400 mt-1">{selectedTeam.teamDescription || "No description"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Team Key</label>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-bold text-white tracking-wider">{selectedTeam.teamKey}</span>
                    <button
                      onClick={(e) => copyTeamKey(selectedTeam.teamKey, e)}
                      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {copiedKey === selectedTeam.teamKey ? (
                        <><Check className="h-4 w-4 text-green-400" /> Copied</>
                      ) : (
                        <><Copy className="h-4 w-4" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>

                {selectedTeam.createdAt && (
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Created</label>
                    <p className="text-sm text-white">{new Date(selectedTeam.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                )}

                {selectedTeam.members && (
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Members</label>
                    <p className="text-sm text-white">{selectedTeam.members.length || 0} member{(selectedTeam.members?.length || 0) !== 1 ? "s" : ""}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreate(false)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Create Team</h3>
                <button onClick={() => setShowCreate(false)} className="text-zinc-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
              </div>
              {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Team Name</label>
                  <input value={createForm.teamName} onChange={(e) => setCreateForm({ ...createForm, teamName: e.target.value })} required placeholder="e.g. Engineering" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                  <textarea value={createForm.teamDescription} onChange={(e) => setCreateForm({ ...createForm, teamDescription: e.target.value })} rows={3} placeholder="What does this team do?" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                  <GlowButton type="submit" disabled={createLoading} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Team"}
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Team Modal */}
      <AnimatePresence>
        {showEdit && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEdit(null)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Edit Team</h3>
                <button onClick={() => setShowEdit(null)} className="text-zinc-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
              </div>
              {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Team Name</label>
                  <input value={editForm.teamName} onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                  <textarea value={editForm.teamDescription} onChange={(e) => setEditForm({ ...editForm, teamDescription: e.target.value })} rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEdit(null)} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                  <GlowButton type="submit" disabled={editLoading} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Update</>}
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowDelete(null); setDeleteError(""); }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 mb-4">
                  <AlertTriangle className="h-7 w-7 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete Team</h3>
                <p className="text-sm text-zinc-400 mt-2">
                  Are you sure you want to delete <strong className="text-white">{showDelete.teamName}</strong>? This action cannot be undone.
                </p>
                {deleteError && (
                  <div className="mt-4 w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {deleteError}
                  </div>
                )}
                <div className="flex gap-3 mt-6 w-full">
                  <button
                    onClick={() => { setShowDelete(null); setDeleteError(""); }}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(showDelete.teamKey)}
                    disabled={deleteLoading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                  >
                    {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
