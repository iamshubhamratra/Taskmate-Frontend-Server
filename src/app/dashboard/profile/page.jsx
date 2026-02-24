"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { FadeIn, GlowButton, StaggerContainer, StaggerItem } from "@/components/animations";
import api from "@/lib/api";

import {
  User, Mail, Briefcase, Shield, Camera, Edit3, Save, X, Sparkles,
  Calendar, MapPin, Bell, Lock, Palette, Eye, EyeOff, Loader2, Check,
} from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    designation: user?.designation || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });

  useEffect(() => {
  if (user) {
    setForm({
      name: user.name || "",
      email: user.email || "",
      designation: user.designation || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
    });
  }
}, [user]);


  const update = (field) => (e) => {
    setError("");
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = async () => {
    setError("");

    const payload = {};

    if (form.name !== user.name && form.name.trim() !== "") { payload.name = form.name; }
    if (form.designation !== user.designation && form.designation.trim() !== "") { payload.designation = form.designation; }
    if (form.bio !== user.bio && form.bio.trim() !== "") { payload.bio = form.bio; }
    if (form.location !== user.location && form.location.trim() !== "") { payload.location = form.location; }

    if (Object.keys(payload).length === 0) {
      setError("No changes detected");
      return;
    }

    try {
      const res = await api.updateProfile(payload);

      if (res.ok) {
        setUser(res.data.data);
        localStorage.setItem("taskmate-user", JSON.stringify(res.data.data));
        setEditing(false);
      } else {
        setError(res.data?.message || "Update failed");
      }
    } catch {
      setError("Network error");
    }
  };


  const handlePhotoClick = () => {
    setShowPhotoModal(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePhoto(ev.target.result);
        const updated = { ...user, avatar: ev.target.result };
        setUser(updated);
        localStorage.setItem("taskmate-user", JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
    setShowPhotoModal(false);
  };

  // Reset password state
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetForm, setResetForm] = useState({ oldPassword: "", newPassword: "" });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(resetForm.newPassword)) {
      setResetError("New password must be 8+ chars with uppercase, lowercase, number, and special character.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await api.resetPassword({ oldPassword: resetForm.oldPassword, newPassword: resetForm.newPassword });
      if (res.ok) {
        setResetSuccess("Password updated successfully. Please log in again.");
        setResetForm({ oldPassword: "", newPassword: "" });
        setTimeout(() => {
          setShowResetPassword(false);
          setResetSuccess("");
        }, 2500);
      } else {
        setResetError(res.data?.message || "Failed to update password");
      }
    } catch {
      setResetError("Network error");
    }
    setResetLoading(false);
  };

  const initials = (user?.name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const avatar = profilePhoto || user?.avatar;

  const settingSections = [
    { icon: Bell, label: "Notifications", desc: "Manage notification preferences", soon: true },
    { icon: Palette, label: "Appearance", desc: "Theme & display settings", soon: true },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Profile Header Card */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl border border-white/5 dark:border-white/5 bg-white/[0.02] dark:bg-white/[0.02]">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl"
            />
          </div>

          {/* Avatar & Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={handlePhotoClick}
                className="relative cursor-pointer group"
              >
                <div className="h-24 w-24 rounded-2xl border-4 border-black overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{initials}</span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-4 border-transparent">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </motion.div>

              <div className="flex-1 sm:mb-1">
                <h1 className="text-3xl font-bold text-white">{user?.name || "User"}</h1>
                <p className="text-base text-zinc-400">{user?.designation || ""}</p>
              </div>

              <div className="sm:mb-1 flex items-center gap-3">
                {/* <motion.button */}
                {/* whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168,85,247,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-semibold text-white transition-all"
                  > */}
                {/* <Crown className="h-4 w-4" /> Upgrade Plan */}
                {/* <ArrowUpRight className="h-3.5 w-3.5" /> */}
                {/* </motion.button> */}
                {!editing ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEditing(true);
                      setError("");
                    }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </motion.button>
                ) : (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
                    >
                      <Save className="h-4 w-4" /> Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setError("");
                        setEditing(false);
                      }}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
                {error && (
                  <p className="mt-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Details */}
        <FadeIn delay={0.1} className="lg:col-span-2">
          <div className="rounded-2xl border border-white/5 dark:border-white/5 bg-white/[0.02] dark:bg-white/[0.02] p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" />
              Personal Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Full Name</label>
                {editing ? (
                  <input
                    value={form.name}
                    onChange={update("name")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                  />
                ) : (
                  <p className="text-sm text-white py-3">{user?.name || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Email</label>
                <div className="flex items-center gap-2 py-3">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <p className="text-sm text-zinc-300">{user?.email || "Not set"}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Designation</label>
                {editing ? (
                  <input
                    value={form.designation}
                    onChange={update("designation")}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                  />
                ) : (
                  <div className="flex items-center gap-2 py-3">
                    <Briefcase className="h-4 w-4 text-zinc-500" />
                    <p className="text-sm text-zinc-300">{user?.designation || "Not set"}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Role</label>
                <div className="flex items-center gap-2 py-3">
                  <Shield className="h-4 w-4 text-zinc-500" />
                  <p className="text-sm text-zinc-300">{user?.role || "User"}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Location</label>
                {editing ? (
                  <input
                    value={form.location}
                    onChange={update("location")}
                    placeholder="City, Country"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                  />
                ) : (
                  <div className="flex items-center gap-2 py-3">
                    <MapPin className="h-4 w-4 text-zinc-500" />
                    <p className="text-sm text-zinc-300">{user?.location || "Not set"}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Member Since</label>
                <div className="flex items-center gap-2 py-3">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <p className="text-sm text-zinc-300">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Bio</label>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={update("bio")}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              ) : (
                <p className="text-sm text-zinc-300 py-3">{user?.bio || "No bio added yet."}</p>
              )}
            </div>
          </div>
        </FadeIn>

          {/* Settings & Quick Links */}
          <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-white/5 dark:border-white/5 bg-white/[0.02] dark:bg-white/[0.02] p-6">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Settings
              </h3>
              <StaggerContainer className="space-y-2" staggerDelay={0.05}>
                {/* Change Password - active */}
                <StaggerItem>
                  <motion.button
                    onClick={() => { setShowResetPassword(true); setResetError(""); setResetSuccess(""); setResetForm({ oldPassword: "", newPassword: "" }); }}
                    whileHover={{ x: 4, borderColor: "rgba(99,102,241,0.2)" }}
                    className="w-full flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 cursor-pointer transition-all hover:bg-white/[0.04] text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">Change Password</div>
                      <div className="text-xs text-zinc-500">Update your account password</div>
                    </div>
                  </motion.button>
                </StaggerItem>
                {settingSections.map((section) => (
                  <StaggerItem key={section.label}>
                    <motion.div
                      whileHover={{ x: 4, borderColor: "rgba(99,102,241,0.2)" }}
                      className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 cursor-default transition-all"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-400">
                        <section.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{section.label}</div>
                        <div className="text-xs text-zinc-500">{section.desc}</div>
                      </div>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500 shrink-0">
                        Coming Soon
                      </span>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>
      </div>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetPassword && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetPassword(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Change Password</h3>
                </div>
                <button onClick={() => setShowResetPassword(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {resetError && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {resetError}
                </div>
              )}
              {resetSuccess && (
                <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
                  <Check className="h-4 w-4" /> {resetSuccess}
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOldPass ? "text" : "password"}
                      value={resetForm.oldPassword}
                      onChange={(e) => setResetForm({ ...resetForm, oldPassword: e.target.value })}
                      required
                      placeholder="Enter your current password"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                      {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={resetForm.newPassword}
                      onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                      required
                      placeholder="8+ chars, uppercase, lowercase, number, special"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(false)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <GlowButton
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {resetLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {showPhotoModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhotoModal(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Change Profile Photo</h3>
              <p className="text-sm text-zinc-400 mb-6">Upload a new profile picture.</p>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <div className="space-y-3">
                <GlowButton
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white"
                >
                  <Camera className="h-4 w-4" /> Upload Photo
                </GlowButton>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
