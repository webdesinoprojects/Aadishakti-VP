import { useState, useEffect } from 'react';
import customerDataMock from '../../../../backend/data/customer.json';

export const useCustomerData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    const t = setTimeout(() => {
      setData(customerDataMock);
      setLoading(false);
    }, 400); // Small 400ms delay to feel real

    return () => clearTimeout(t);
  }, []);

  return { data, loading };
};
