import vendorApi from '../../services/vendorApi';
import { usePortalCisResource } from '../../portal/usePortalCisResource';

const useVendorResource = (resource, load, parameters = {}, enabled = true) => usePortalCisResource({
  role: 'vendor',
  resource,
  parameters,
  load,
  enabled,
  fallbackMessage: 'Vendor data is temporarily unavailable.',
});

const listHook = (resource, loader) => ({ page = 1, pageSize = 10, q = '' } = {}) => {
  const parameters = { page, pageSize, q };
  return useVendorResource(resource, () => loader({ page, pageSize, q: q || undefined }), parameters);
};

const detailHook = (resource, loader) => (recordRef) => {
  const docEntry = typeof recordRef === 'object' ? recordRef?.id : recordRef;
  const companyCode = typeof recordRef === 'object' ? recordRef?.companyCode : undefined;
  return useVendorResource(
    resource,
    () => loader(docEntry, companyCode),
    { docEntry, companyCode },
    Boolean(docEntry),
  );
};

export const useVendorProfile = () => useVendorResource('profile', vendorApi.getProfile);
export const useVendorDashboard = () => useVendorResource('dashboard', vendorApi.getDashboard);
export const useVendorPurchaseOrders = listHook('purchase-orders', vendorApi.getPurchaseOrders);
export const useVendorPurchaseOrder = detailHook('purchase-order', vendorApi.getPurchaseOrder);
export const useVendorInvoices = listHook('invoices', vendorApi.getInvoices);
export const useVendorInvoice = detailHook('invoice', vendorApi.getInvoice);
export const useVendorCreditNote = detailHook('credit-note', vendorApi.getCreditNote);
export const useVendorDebitNotes = listHook('debit-notes', vendorApi.getDebitNotes);
export const useVendorDebitNote = detailHook('debit-note', vendorApi.getDebitNote);

export const useVendorFinancialDocuments = ({ kind = 'invoice', page = 1, pageSize = 10, q = '' } = {}) => {
  const loaders = {
    invoice: vendorApi.getInvoices,
    'credit-note': vendorApi.getCreditNotes,
    'debit-note': vendorApi.getDebitNotes,
  };
  const loader = loaders[kind] || loaders.invoice;
  const parameters = { kind, page, pageSize, q };
  return useVendorResource(
    'financial-documents',
    () => loader({ page, pageSize, q: q || undefined }),
    parameters,
  );
};

export const useVendorGrpos = listHook('grpos', vendorApi.getGrpos);
export const useVendorGrpo = detailHook('grpo', vendorApi.getGrpo);
export const useVendorPayments = listHook('payments', vendorApi.getPayments);
export const useVendorPayment = detailHook('payment', vendorApi.getPayment);
