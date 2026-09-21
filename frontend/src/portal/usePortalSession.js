import { useEffect, useState } from "react";
import { portalAuthApi } from "../services/portalAuthApi";
import { clearPortalRoleCache, setPortalSessionIdentity } from "./portalQueryClient";

export const usePortalSession = (requiredRole) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        sessionStorage.setItem('portal_active_role', requiredRole);
        const response = await portalAuthApi.getSession(requiredRole);
        const nextSession = response.data?.session || null;
        if (nextSession?.role === requiredRole) setPortalSessionIdentity(requiredRole, nextSession);
        else clearPortalRoleCache(requiredRole);
        if (active) {
          setSession(nextSession?.role === requiredRole ? nextSession : null);
          setError(nextSession?.role === requiredRole ? null : { status: 403 });
        }
      } catch (requestError) {
        clearPortalRoleCache(requiredRole);
        if (active) {
          setSession(null);
          setError({ status: requestError.response?.status || 0 });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSession();
    return () => { active = false; };
  }, [requiredRole]);

  return { session, loading, error };
};
