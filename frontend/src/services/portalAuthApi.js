import portalApiClient from "./portalApiClient";

export const portalAuthApi = {
  login: ({ identifier, password, role }) => portalApiClient.post("/api/portal/auth/login", { identifier, password, role }),
  logout: () => portalApiClient.post("/api/portal/auth/logout"),
  getSession: () => portalApiClient.get("/api/portal/auth/session"),
};
