const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_LOCALHOST;

export async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}
// jd
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
  updateTeam: (body) => request("/taskmate/team/updateTeam", { method: "PATCH", headers: { "Content-Type": "application/json", }, body: JSON.stringify(body) }),
  searchTeam: (data) => request("/taskmate/team/searchTeam", {method: "POST",headers: { "Content-Type": "application/json",},body: JSON.stringify(data),credentials: "include",}),
  listAdminTeams: () => request("/taskmate/team/listAdminTeams", { method: "GET" }),
  listMemberTeams: () => request("/taskmate/team/listMembersTeam", { method: "GET" }),
  requestJoinTeam: (body) => request("/taskmate/team/requestJoinTeam", { method: "POST", body: JSON.stringify(body) }),
  getPendingRequests: (body) => request("/taskmate/team/pendingRequests", { method: "POST", body: JSON.stringify(body) }),
  acceptJoinTeam: (body) => request("/taskmate/team/acceptJoinTeam", { method: "POST", body: JSON.stringify(body) }),
  declineJoinTeam: (body) => request("/taskmate/team/declineJoinTeam", { method: "POST", body: JSON.stringify(body) }),
  getTeamDetails: (body) => request("/taskmate/team/getTeamDetails", {method: "POST",body: JSON.stringify(body),}),

  // User
  updateProfile: (body) => request("/taskmate/user/updateProfile", { method: "PATCH", body: JSON.stringify(body), }),
  getProfile: () => request("/taskmate/user/profile", { method: "GET" }),
};

export default api;