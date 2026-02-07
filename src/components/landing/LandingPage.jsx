"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowButton,
  SlideIn,
} from "@/components/animations";
import {
  CheckCircle,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Clock,
  Globe,
  Layers,
  Sun,
  Moon,
  Menu,
  X,
  Code,
  Rocket,
  Target,
  Heart,
  GitBranch,
  Lock,
  BarChart3,
  MessageSquare,
  Smartphone,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-zinc-200/60 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-xl" : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"
          >
            <Zap className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-white">TaskMate</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Stats", "Testimonials", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-zinc-400 transition-colors hover:text-white relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            href="/login"
            className="hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
          >
            Sign In
          </Link>
          <Link href="/signup">
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white"
            >
              Get Started
            </motion.div>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-black/95 backdrop-blur-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {["Features", "How it Works", "Stats", "Testimonials", "FAQ"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
                >
                  {item}
                </a>
              ))}
              <div className="border-t border-white/5 mt-2 pt-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">Sign In</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-indigo-400 font-medium">Create Account</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const tabs = ["Dashboard", "Teams", "Tasks", "Profile", "Settings"];
  const availableTabs = ["Dashboard", "Teams", "Profile"];

  const tabContent = {
    Dashboard: [
      { title: "Design Sprint Review", status: "In Progress", color: "bg-yellow-500" },
      { title: "Backend API Integration", status: "Completed", color: "bg-green-500" },
      { title: "User Testing Round 2", status: "Pending", color: "bg-zinc-500" },
      { title: "Deploy v2.0 Release", status: "In Review", color: "bg-blue-500" },
    ],
    Teams: [
      { title: "Engineering Team", status: "12 Members", color: "bg-indigo-500" },
      { title: "Design Team", status: "8 Members", color: "bg-pink-500" },
      { title: "Marketing Team", status: "6 Members", color: "bg-green-500" },
      { title: "Product Team", status: "5 Members", color: "bg-amber-500" },
    ],
    Profile: [
      { title: "Profile Settings", status: "Updated", color: "bg-green-500" },
      { title: "Notification Preferences", status: "Configured", color: "bg-blue-500" },
      { title: "Security Settings", status: "2FA Enabled", color: "bg-emerald-500" },
      { title: "Appearance", status: "Dark Mode", color: "bg-purple-500" },
    ],
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl"
        />
        <motion.div
          animate={{ rotate: 180 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Radial fade */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />

      <FadeIn delay={0.1}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 cursor-default"
        >
          <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
          <span className="text-xs font-medium text-indigo-300">Now in Public Beta</span>
          <ChevronRight className="h-3 w-3 text-indigo-400" />
        </motion.div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <h1 className="max-w-4xl text-center text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Manage Tasks.{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Build Teams.
          </span>
          <br />
          Ship Faster.
        </h1>
      </FadeIn>

      <FadeIn delay={0.4}>
        <p className="mt-6 max-w-2xl text-center text-lg text-zinc-400 sm:text-xl leading-relaxed">
          TaskMate is the modern project management platform that helps teams collaborate,
          track progress, and deliver results with powerful tools and real-time updates.
        </p>
      </FadeIn>

      <FadeIn delay={0.6}>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/signup">
            <GlowButton className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-base font-semibold text-white transition-all">
              Start For Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </GlowButton>
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
          >
            Learn More
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.8}>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-zinc-500">
          {[
            { icon: CheckCircle, text: "Free forever plan" },
            { icon: Shield, text: "No credit card required" },
            { icon: Zap, text: "Instant setup" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-green-500" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Hero visual - Interactive Dashboard mockup */}
      <FadeIn delay={1.0}>
        <div className="relative mt-20 w-full max-w-5xl">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-1 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-zinc-500">TaskMate Dashboard</span>
            </div>
            <div className="grid grid-cols-4 gap-4 p-6">
              <div className="col-span-1 space-y-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  const isAvailable = availableTabs.includes(tab);
                  return (
                    <motion.button
                      key={tab}
                      onClick={() => isAvailable ? setActiveTab(tab) : null}
                      whileHover={isAvailable ? { x: 4 } : {}}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-all ${isActive
                        ? "bg-indigo-500/20 text-indigo-300"
                        : isAvailable
                          ? "text-zinc-400 hover:bg-white/5 hover:text-white cursor-pointer"
                          : "text-zinc-600 cursor-default"
                        }`}
                    >
                      {tab}
                    </motion.button>
                  );
                })}
              </div>
              <div className="col-span-3 space-y-3 min-h-[200px]">
                <AnimatePresence mode="wait">
                  {availableTabs.includes(activeTab) ? (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {tabContent[activeTab]?.map((task, i) => (
                        <motion.div
                          key={task.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${task.color}`} />
                            <span className="text-sm text-zinc-300">{task.title}</span>
                          </div>
                          <span className="text-xs text-zinc-500">{task.status}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="coming-soon"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center h-[200px] text-center"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 mb-3">
                        <Rocket className="h-6 w-6 text-indigo-400" />
                      </div>
                      <p className="text-sm font-medium text-white">Coming Soon</p>
                      <p className="text-xs text-zinc-500 mt-1 max-w-xs">This feature is currently under development. Stay tuned for updates!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-12 mb-4"
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-white/40"
          />
        </div>
      </motion.div>
    </section>
  );
}

function TrustedBySection() {
  return (
    <section className="py-16 px-6 border-y border-white/5">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-center text-xs uppercase tracking-widest text-zinc-600">
            Trusted by innovative teams worldwide
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Users, title: "Team Management", desc: "Create and manage teams, assign roles, and collaborate seamlessly across your organization.", color: "from-blue-500/20 to-cyan-500/20" },
    { icon: CheckCircle, title: "Task Tracking", desc: "Track tasks from creation to completion with real-time status updates and progress monitoring.", color: "from-green-500/20 to-emerald-500/20" },
    { icon: Shield, title: "Secure by Design", desc: "Enterprise-grade security with JWT authentication, encrypted passwords, and secure sessions.", color: "from-red-500/20 to-orange-500/20" },
    { icon: Zap, title: "Lightning Fast", desc: "Built with performance in mind. Instant updates, optimistic UI, and zero-latency interactions.", color: "from-yellow-500/20 to-amber-500/20" },
    { icon: Globe, title: "Access Anywhere", desc: "Fully responsive design works perfectly on desktop, tablet, and mobile devices.", color: "from-indigo-500/20 to-purple-500/20" },
    { icon: Layers, title: "Smart Organization", desc: "Organize tasks with team keys, descriptions, and intelligent search across all your projects.", color: "from-pink-500/20 to-rose-500/20" },
  ];
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
              <Layers className="h-3 w-3" /> Features
            </span>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Everything you need to ship</h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">Powerful features designed for modern teams who need to move fast and stay organized.</p>
          </div>
        </FadeIn>
        <StaggerContainer className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <motion.div
                whileHover={{ y: -5, borderColor: "rgba(99,102,241,0.3)" }}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:bg-white/[0.04] overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${f.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white transition-transform group-hover:scale-110`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Create Your Account", desc: "Sign up in seconds with your email. No credit card required. Get started instantly.", icon: Rocket },
    { num: "02", title: "Build Your Team", desc: "Create teams with unique keys, invite members, set roles, and organize your workspace for maximum efficiency.", icon: Users },
    { num: "03", title: "Track & Deliver", desc: "Create tasks, assign them to team members, monitor progress in real-time, and ship projects on time.", icon: Target },
  ];
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />
      <div className="mx-auto max-w-5xl relative">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
              <Code className="h-3 w-3" /> How It Works
            </span>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Get started in 3 steps</h2>
            <p className="mt-4 text-lg text-zinc-400">From signup to shipping in minutes, not days.</p>
          </div>
        </FadeIn>
        <div className="mt-20 space-y-8">
          {steps.map((step, i) => (
            <SlideIn key={step.num} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.15}>
              <motion.div
                whileHover={{ borderColor: "rgba(99,102,241,0.2)" }}
                className="flex items-start gap-6 sm:gap-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 transition-all"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 relative">
                  <step.icon className="h-7 w-7 text-indigo-400" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "50K+", label: "Tasks Completed", icon: CheckCircle },
    { value: "2K+", label: "Teams Created", icon: GitBranch },
    { value: "99.9%", label: "Uptime", icon: Zap },
  ];
  return (
    <section id="stats" className="relative py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black p-1">
          <div className="rounded-[22px] bg-zinc-50 dark:bg-zinc-900/80 px-8 py-16 relative overflow-hidden">

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-3xl"
            />
            <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.15}>
              {stats.map((s) => (
                <StaggerItem key={s.label} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20
">
                      <s.icon className="h-5 w-5 text-indigo-400" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-zinc-900 dark:text-white lg:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {s.label}
                  </div>

                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyTaskMateSection() {
  const points = [
    { icon: Lock, title: "Enterprise Security", desc: "JWT auth, bcrypt hashing, secure sessions, and encrypted data storage." },
    { icon: Smartphone, title: "Mobile Responsive", desc: "Fully responsive UI that works seamlessly on all screen sizes." },
    { icon: Cpu, title: "Modern Architecture", desc: "Built with React, Node.js, and MongoDB for maximum performance." },
    { icon: MessageSquare, title: "Team Communication", desc: "Integrated team management with unique team keys and roles." },
    { icon: BarChart3, title: "Progress Tracking", desc: "Real-time task tracking with status updates and team visibility." },
    { icon: Heart, title: "Free Forever", desc: "Core features are free forever. No hidden fees, no surprise charges." },
  ];
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
              <Heart className="h-3 w-3" /> Why TaskMate
            </span>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Built for teams who ship</h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">Every feature is designed to help your team move faster and deliver better results.</p>
          </div>
        </FadeIn>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-purple-500/15 text-indigo-400">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{p.title}</h4>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah Chen", role: "Product Manager at TechCo", text: "TaskMate transformed how our team works. We shipped 3x faster in the first month. The team management features are exactly what we needed.", avatar: "SC" },
    { name: "Alex Rivera", role: "Engineering Lead at StartupX", text: "The team management features are incredible. Best tool we've adopted this year. Clean UI, fast performance, and great team collaboration.", avatar: "AR" },
    { name: "Priya Sharma", role: "Founder at InnovateLabs", text: "Simple, fast, and effective. TaskMate is exactly what small teams need to stay organized and deliver on time.", avatar: "PS" },
    { name: "James Wilson", role: "CTO at DevStudio", text: "We evaluated 10+ project management tools. TaskMate won with its clean design, fast API, and developer-friendly approach.", avatar: "JW" },
    { name: "Emily Zhang", role: "Design Lead at CreativeHub", text: "The UI is beautiful and intuitive. Our designers love using TaskMate - it doesn't get in the way of actually doing the work.", avatar: "EZ" },
    { name: "Marcus Johnson", role: "Freelance Developer", text: "As a freelancer managing multiple clients, TaskMate helps me stay organized across projects. The team keys feature is genius.", avatar: "MJ" },
  ];
  return (
    <section id="testimonials" className="py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
              <Star className="h-3 w-3" /> Testimonials
            </span>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Loved by teams everywhere</h2>
            <p className="mt-4 text-lg text-zinc-400">See what developers and teams are saying about TaskMate.</p>
          </div>
        </FadeIn>
        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                whileHover={{ y: -3, borderColor: "rgba(99,102,241,0.2)" }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-7 transition-all"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Is TaskMate free to use?", a: "Yes! TaskMate offers a generous free plan that includes team creation, task management, and core collaboration features. No credit card required." },
    { q: "How secure is my data?", a: "We use JWT authentication, bcrypt password hashing, and encrypted sessions. Your data is safe with enterprise-grade security measures." },
    { q: "Can I manage multiple teams?", a: "You can create and admin multiple teams, each with unique team keys for easy member management and organization." },
    { q: "What devices are supported?", a: "TaskMate works on all modern browsers and is fully responsive across desktop, tablet, and mobile devices." },
    { q: "How do I invite team members?", a: "Share your unique team key with members. They can use it to find and join your team instantly." },
    { q: "Is there an API?", a: "Yes! TaskMate has a comprehensive REST API for authentication, team management, and task operations. Perfect for integrations." },
  ];
  return (
    <section id="faq" className="py-32 px-6">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
              <MessageSquare className="h-3 w-3" /> FAQ
            </span>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-zinc-400">Everything you need to know about TaskMate.</p>
          </div>
        </FadeIn>
        <div className="mt-16 space-y-4">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <motion.div
                className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
                layout
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 text-zinc-400 shrink-0 text-lg"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 px-6">
      <FadeIn>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-1 relative">
          <div className="rounded-[22px] bg-black/60 px-8 py-20 text-center backdrop-blur-sm sm:px-16 relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
            />
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white sm:text-5xl">Ready to get started?</h2>
                <p className="mt-4 text-lg text-zinc-400">
                  Join thousands of teams already using TaskMate to ship better products, faster.
                </p>
              </motion.div>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/signup">
                  <GlowButton className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-base font-semibold text-white">
                    Create Free Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </GlowButton>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  Sign In Instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">TaskMate</span>
            </div>
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed max-w-xs">
              The modern project management platform for teams who ship.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <div className="space-y-3">
              {["Features", "Dashboard", "Teams", "Security"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{item}</a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <div className="space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <span key={item} className="block text-sm text-zinc-600 cursor-default">{item} <span className="text-[10px] text-zinc-700">Coming Soon</span></span>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <div className="space-y-3">
              <Link href="/login" className="block text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Sign In</Link>
              <Link href="/signup" className="block text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Sign Up</Link>
              <Link href="/forgot-password" className="block text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Reset Password</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} TaskMate. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-xs text-zinc-600">Privacy Policy</span>
            <span className="text-xs text-zinc-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <WhyTaskMateSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
