import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vendorApi from '../../services/vendorApi';

const normalizeError = (error) => ({
  status: error?.response?.status || 0,
  message: error?.response?.data?.error || (error?.code === 'ECONNABORTED'
    ? 'The CIS service is temporarily unavailable.'
    : 'Vendor data is temporarily unavailable.'),
});

const useVendorResource = (load, enabled = true) => {
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

const listHook = (loader) => ({ page = 1, pageSize = 10, q = '' } = {}) => {
  const load = useCallback(() => loader({ page, pageSize, q: q || undefined }), [page, pageSize, q]);
  return useVendorResource(load);
};

const detailHook = (loader) => (docEntry) => {
  const load = useCallback(() => loader(docEntry), [docEntry]);
  return useVendorResource(load, Boolean(docEntry));
};

export const useVendorProfile = () => useVendorResource(useCallback(() => vendorApi.getProfile(), []));
export const useVendorDashboard = () => useVendorResource(useCallback(() => vendorApi.getDashboard(), []));
export const useVendorPurchaseOrders = listHook(vendorApi.getPurchaseOrders);
export const useVendorPurchaseOrder = detailHook(vendorApi.getPurchaseOrder);
export const useVendorInvoices = listHook(vendorApi.getInvoices);
export const useVendorInvoice = detailHook(vendorApi.getInvoice);
export const useVendorCreditNote = detailHook(vendorApi.getCreditNote);
export const useVendorDebitNotes = listHook(vendorApi.getDebitNotes);
export const useVendorDebitNote = detailHook(vendorApi.getDebitNote);

export const useVendorFinancialDocuments = ({ kind = 'invoice', page = 1, pageSize = 10, q = '' } = {}) => {
  const loaders = {
    invoice: vendorApi.getInvoices,
    'credit-note': vendorApi.getCreditNotes,
    'debit-note': vendorApi.getDebitNotes,
  };
  const load = useCallback(() => (loaders[kind] || loaders.invoice)({ page, pageSize, q: q || undefined }), [kind, page, pageSize, q]);
  return useVendorResource(load);
};
export const useVendorGrpos = listHook(vendorApi.getGrpos);
export const useVendorGrpo = detailHook(vendorApi.getGrpo);
export const useVendorPayments = listHook(vendorApi.getPayments);
export const useVendorPayment = detailHook(vendorApi.getPayment);
