const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request(endpoint, options = {}) {
  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();
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
  updateTeam: (body) => request("/taskmate/team/updateTeam", { method: "PUT", body: JSON.stringify(body) }),
  searchTeam: (body) => request("/taskmate/team/searchTeam", { method: "POST", body: JSON.stringify(body) }),
  listAdminTeams: () => request("/taskmate/team/listAdminTeams", { method: "GET" }),
  listMemberTeams: () => request("/taskmate/team/listMemberTeams", { method: "GET" }),
};
