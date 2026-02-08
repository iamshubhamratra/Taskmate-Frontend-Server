const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function request(endpoint, options = {}) {
  const config = {
    credentials: "include", // 🔥 REQUIRED for cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  let data = null;
  try {
    data = await res.json();
  } catch {}

  return { ok: res.ok, status: res.status, data };
}

export const api = {
  // Auth
  signup: (body) => request("/taskmate/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/taskmate/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/taskmate/auth/logout", { method: "GET" }),
  resetPassword: (body) => request("/taskmate/auth/resetpass", { method: "POST", body: JSON.stringify(body) }),
  setNewPassword: (body) => request("/taskmate/auth/set-new-password", { method: "PATCH", body: JSON.stringify(body) }),

  // OTP
  sendOtp: (body) => request("/taskmate/otp/send-otp", { method: "POST", body: JSON.stringify(body) }),
  verifyOtp: (body) => request("/taskmate/otp/verify-otp", { method: "POST", body: JSON.stringify(body) }),

  // Teams
  createTeam: (body) => request("/taskmate/team/createTeam", { method: "POST", body: JSON.stringify(body) }),
  deleteTeam: (body) => request("/taskmate/team/deleteTeam", { method: "POST", body: JSON.stringify(body) }),
  updateTeam: (body) => request("/taskmate/team/updateTeam", {method: "PATCH", headers: {"Content-Type": "application/json",}, body: JSON.stringify(body)}),
  searchTeam: (body) => request("/taskmate/team/searchTeam", { method: "POST", body: JSON.stringify(body) }),
  listAdminTeams: () => request("/taskmate/team/listAdminTeams", { method: "GET" }),
  listMemberTeams: () => request("/taskmate/team/listMemberTeams", { method: "GET" }),
  
  // User
  updateProfile:(body) => request("/taskmate/user/updateProfile", {method: "PATCH", body: JSON.stringify(body),}),
  getProfile: () => request("/taskmate/user/profile", { method: "GET" }), 
};

export default api;