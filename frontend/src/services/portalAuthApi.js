import portalApiClient from "./portalApiClient";
import { clearPortalRoleCache, setPortalSessionIdentity } from "../portal/portalQueryClient";

export const portalAuthApi = {
  login: async ({ identifier, password, role }) => {
    const response = await portalApiClient.post("/api/portal/auth/login", { identifier, password, role }, { headers: { 'X-Portal-Role': role } });
    clearPortalRoleCache(role);
    setPortalSessionIdentity(role, response.data?.session);
    return response;
  },
  logout: async (role) => {
    try {
      return await portalApiClient.post("/api/portal/auth/logout", { role }, { headers: { 'X-Portal-Role': role } });
    } finally {
      clearPortalRoleCache(role);
    }
  },
  getSession: (role) => portalApiClient.get("/api/portal/auth/session", { headers: { 'X-Portal-Role': role } }),
  changePassword: (data, role) => portalApiClient.post("/api/portal/auth/password", data, { headers: { 'X-Portal-Role': role } }),
};
