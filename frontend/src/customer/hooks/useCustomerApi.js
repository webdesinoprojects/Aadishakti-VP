import customerApi from '../../services/customerApi';
import { usePortalCisResource } from '../../portal/usePortalCisResource';

const useCustomerResource = (resource, load, parameters = {}, enabled = true) => usePortalCisResource({
  role: 'customer',
  resource,
  parameters,
  load,
  enabled,
  fallbackMessage: 'Customer data is temporarily unavailable.',
});

const useListResource = (resource, loader, { page, pageSize, q }) => useCustomerResource(
  resource,
  () => loader({ page, pageSize, q: q || undefined }),
  { page, pageSize, q },
);

const useDetailResource = (resource, loader, recordRef) => {
  const docEntry = typeof recordRef === 'object' ? recordRef?.id : recordRef;
  const companyCode = typeof recordRef === 'object' ? recordRef?.companyCode : undefined;
  return useCustomerResource(
    resource,
    () => loader(docEntry, companyCode),
    { docEntry, companyCode },
    Boolean(docEntry),
  );
};

export const useCustomerProfile = () => useCustomerResource('profile', customerApi.getProfile);
export const useCustomerDashboard = () => useCustomerResource('dashboard', customerApi.getDashboard);
export const useCustomerOrders = ({ page = 1, pageSize = 10, q = '' } = {}) => useListResource(
  'orders', customerApi.getOrders, { page, pageSize, q },
);
export const useCustomerOrder = (docEntry) => useDetailResource('order', customerApi.getOrder, docEntry);
export const useCustomerInvoices = ({ page = 1, pageSize = 10, q = '' } = {}) => useListResource(
  'invoices', customerApi.getInvoices, { page, pageSize, q },
);

export const useCustomerFinancialDocuments = ({ kind = 'invoice', page = 1, pageSize = 10, q = '' } = {}) => {
  const loader = kind === 'credit-note' ? customerApi.getCreditNotes : customerApi.getInvoices;
  return useCustomerResource(
    'financial-documents',
    () => loader({ page, pageSize, q: q || undefined }),
    { kind, page, pageSize, q },
  );
};

export const useCustomerInvoice = (recordRef) => useDetailResource('invoice', customerApi.getInvoice, recordRef);
export const useCustomerCreditNotes = ({ page = 1, pageSize = 10, q = '' } = {}) => useListResource(
  'credit-notes', customerApi.getCreditNotes, { page, pageSize, q },
);
export const useCustomerCreditNote = (recordRef) => useDetailResource('credit-note', customerApi.getCreditNote, recordRef);
export const useCustomerDeliveries = ({ page = 1, pageSize = 10, q = '' } = {}) => useListResource(
  'deliveries', customerApi.getDeliveries, { page, pageSize, q },
);
export const useCustomerDelivery = (recordRef) => useDetailResource('delivery', customerApi.getDelivery, recordRef);
export const useCustomerPayments = ({ page = 1, pageSize = 10, q = '' } = {}) => useListResource(
  'payments', customerApi.getPayments, { page, pageSize, q },
);
export const useCustomerPayment = (recordRef) => useDetailResource('payment', customerApi.getPayment, recordRef);
