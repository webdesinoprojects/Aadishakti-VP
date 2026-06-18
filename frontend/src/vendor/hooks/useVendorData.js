import { useState, useEffect } from 'react';
import vendorDataMock from '../../../../backend/data/vendor.json';

export const useVendorData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    const t = setTimeout(() => {
      setData(vendorDataMock);
      setLoading(false);
    }, 400); // Small 400ms delay to feel real

    return () => clearTimeout(t);
  }, []);

  return { data, loading };
};
