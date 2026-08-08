import { useEffect, useState } from "react";
import { portalAuthApi } from "../services/portalAuthApi";

export const usePortalSession = (requiredRole) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const response = await portalAuthApi.getSession();
        const nextSession = response.data?.session || null;
        if (active) {
          setSession(nextSession?.role === requiredRole ? nextSession : null);
          setError(nextSession?.role === requiredRole ? null : { status: 403 });
        }
      } catch (requestError) {
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
