import { useState, useEffect } from 'react';

export const useCustomerData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Normally this would be a real API call. 
        // We will fetch the local customer.json from the public or backend folder.
        // Wait, since customer.json is in backend/data, we should expose it via API, or we can just mock the fetch by importing it directly if it was in frontend.
        // Let's create an API endpoint in backend/server.js in a separate step or just fetch it here if backend is running.
        // For now, to ensure zero hardcoding and robust data, let's fetch from the backend API.
        const response = await fetch('http://localhost:5000/api/customer/data');
        if (response.ok) {
           const json = await response.json();
           setData(json);
        } else {
           throw new Error("API failed");
        }
      } catch (err) {
        console.warn("Could not fetch customer data from backend, falling back to empty state.", err);
        setData({
          orders: [],
          tracking: [],
          documents: [],
          kpis: { totalOrders: 0, inTransitShipments: 0, pendingInvoices: 0, documentsCount: 0 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading };
};
