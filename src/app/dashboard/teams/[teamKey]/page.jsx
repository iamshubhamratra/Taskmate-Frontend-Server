"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

export default function TeamDetailPage() {
  const { teamKey } = useParams();
  const router = useRouter();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teamKey) return;

    const fetchTeam = async () => {
      try {
        const res = await api.getTeamDetails({ teamKey });

        if (!res.ok) {
          setError("Team not found");
          return;
        }

        setTeam(res.data.data);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Loading team...
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <p className="text-red-400">{error || "Team not found"}</p>
      </div>
    );
  }

  // ✅ SORT: Admins first → then members → newest first inside both
  const sortedMembers = [...(team.members || [])].sort((a, b) => {
    if (a.role !== b.role) {
      return a.role === "admin" ? -1 : 1;
    }
    return new Date(b.joinedAt) - new Date(a.joinedAt);
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={16} /> Back to teams
        </button>

        <h1 className="text-2xl font-bold text-white">{team.teamName}</h1>
        <p className="text-sm text-zinc-400">
          {team.teamDescription || "No description"}
        </p>

        <div className="text-xs text-zinc-500 font-mono">
          Team Key: {team.teamKey}
        </div>
      </div>

      {/* MEMBERS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Members ({sortedMembers.length})
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {sortedMembers.map((member) => {
            const joinedAtDate = member.joinedAt
              ? new Date(member.joinedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—";

            return (
              <div
                key={member.userId?._id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                    {member.userId?.name?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      {member.userId?.name}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {member.userId?.email}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-400">
                    joined on {joinedAtDate}
                  </span>

                  {member.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-400">
                      👑 Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-medium text-indigo-400">
                      👤 Member
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}