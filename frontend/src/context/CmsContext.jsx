import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CmsContext = createContext({
  cms: null,
  loading: true,
  refreshCms: async () => {},
});

export function CmsProvider({ children }) {
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshCms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cms/public");
      if (!res.ok) throw new Error("Failed to load CMS");
      const data = await res.json();
      setCms(data);
    } catch (error) {
      console.error("CMS load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCms();
  }, []);

  const value = useMemo(() => ({ cms, loading, refreshCms }), [cms, loading]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}
