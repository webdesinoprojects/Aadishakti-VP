import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customerApi from '../../services/customerApi';

const normalizeError = (error) => ({
  status: error?.response?.status || 0,
  message: error?.response?.data?.error || (error?.code === 'ECONNABORTED'
    ? 'The CIS service is temporarily unavailable.'
    : 'Customer data is temporarily unavailable.'),
});

const useCustomerResource = (load, enabled = true) => {
  const navigate = useNavigate();
  const [state, setState] = useState({ data: null, loading: enabled, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return undefined;
    }
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));
    load()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (!active) return;
        const safeError = normalizeError(error);
        if (safeError.status === 401) navigate('/login', { replace: true });
        setState({ data: null, loading: false, error: safeError });
      });
    return () => { active = false; };
  }, [enabled, load, navigate, version]);

  return { ...state, refetch: () => setVersion((value) => value + 1) };
};

export const useCustomerProfile = () => useCustomerResource(useCallback(() => customerApi.getProfile(), []));
export const useCustomerDashboard = () => useCustomerResource(useCallback(() => customerApi.getDashboard(), []));

export const useCustomerOrders = ({ page = 1, pageSize = 10, q = '' } = {}) => {
  const load = useCallback(() => customerApi.getOrders({ page, pageSize, q: q || undefined }), [page, pageSize, q]);
  return useCustomerResource(load);
};

export const useCustomerOrder = (docEntry) => {
  const load = useCallback(() => customerApi.getOrder(docEntry), [docEntry]);
  return useCustomerResource(load, Boolean(docEntry));
};

export const useCustomerInvoices = ({ page = 1, pageSize = 10, q = '' } = {}) => {
  const load = useCallback(() => customerApi.getInvoices({ page, pageSize, q: q || undefined }), [page, pageSize, q]);
  return useCustomerResource(load);
};

export const useCustomerInvoice = (docEntry) => {
  const load = useCallback(() => customerApi.getInvoice(docEntry), [docEntry]);
  return useCustomerResource(load, Boolean(docEntry));
};

export const useCustomerDeliveries = ({ page = 1, pageSize = 10, q = '' } = {}) => {
  const load = useCallback(() => customerApi.getDeliveries({ page, pageSize, q: q || undefined }), [page, pageSize, q]);
  return useCustomerResource(load);
};

export const useCustomerDelivery = (docEntry) => {
  const load = useCallback(() => customerApi.getDelivery(docEntry), [docEntry]);
  return useCustomerResource(load, Boolean(docEntry));
};

export const useCustomerPayments = ({ page = 1, pageSize = 10, q = '' } = {}) => {
  const load = useCallback(() => customerApi.getPayments({ page, pageSize, q: q || undefined }), [page, pageSize, q]);
  return useCustomerResource(load);
};

export const useCustomerPayment = (docEntry) => {
  const load = useCallback(() => customerApi.getPayment(docEntry), [docEntry]);
  return useCustomerResource(load, Boolean(docEntry));
};
