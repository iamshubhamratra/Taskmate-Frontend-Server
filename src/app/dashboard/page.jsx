"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import {
  Users, CheckCircle, Clock, TrendingUp, Activity, BarChart3, Calendar, ArrowUpRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listAdminTeams().then((res) => {
      if (res.ok && res.data?.data) setTeams(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Teams", value: teams.length, icon: Users, color: "from-indigo-500 to-blue-500", change: "+2 this week" },
    { label: "Active Tasks", value: "0", icon: CheckCircle, color: "from-green-500 to-emerald-500", change: "Coming Soon" },
    { label: "In Progress", value: "0", icon: Clock, color: "from-yellow-500 to-orange-500", change: "Coming Soon" },
    { label: "Productivity", value: "N/A", icon: TrendingUp, color: "from-purple-500 to-pink-500", change: "Coming Soon" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Stats Grid */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <motion.div
              whileHover={{ y: -3, borderColor: "rgba(99,102,241,0.2)" }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-zinc-500">{stat.change}</span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Quick Actions & Recent Teams */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <FadeIn className="lg:col-span-1">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: "Create Team", href: "/dashboard/teams", icon: Users },
                { label: "View Profile", href: "/dashboard/profile", icon: Activity },
                { label: "Manage Tasks", href: "#", icon: CheckCircle, soon: true },
                { label: "Analytics", href: "#", icon: BarChart3, soon: true },
                { label: "Calendar", href: "#", icon: Calendar, soon: true },
              ].map((action) => (
                <motion.a
                  key={action.label}
                  href={action.soon ? undefined : action.href}
                  whileHover={action.soon ? {} : { x: 4 }}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                    action.soon
                      ? "cursor-default text-zinc-600"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </div>
                  {action.soon ? (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">Coming Soon</span>
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Recent Teams */}
        <FadeIn delay={0.1} className="lg:col-span-2">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white">Your Teams</h3>
              <a href="/dashboard/teams" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View All
              </a>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
                ))}
              </div>
            ) : teams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-zinc-700 mb-4" />
                <p className="text-sm text-zinc-400">No teams yet</p>
                <p className="text-xs text-zinc-600 mt-1">Create your first team to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                  {teams.slice(0, 5).map((team, i) => (
                    <motion.div
                      key={team._id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -2, borderColor: "rgba(99,102,241,0.3)", backgroundColor: "rgba(255,255,255,0.04)" }}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-sm font-bold text-indigo-300"
                        >
                          {team.teamName?.[0]?.toUpperCase() || "T"}
                        </motion.div>
                        <div>
                          <div className="text-sm font-medium text-white">{team.teamName}</div>
                          <div className="text-xs text-zinc-500">{team.teamDescription || "No description"}</div>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-xs font-mono text-zinc-500 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5 hover:border-indigo-500/20 transition-colors"
                      >
                        {team.teamKey}
                      </motion.div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Activity Timeline */}
      <FadeIn delay={0.2}>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="text-base font-semibold text-white mb-4">Recent Activity</h3>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-zinc-700 mb-4" />
            <p className="text-sm text-zinc-400">Activity feed</p>
            <span className="mt-2 rounded-full bg-white/5 px-3 py-1 text-[10px] text-zinc-500">Coming Soon</span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
