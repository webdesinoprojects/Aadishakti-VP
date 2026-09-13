import portalApiClient from './portalApiClient';

const unwrap = (response) => response.data;
const detailPath = (area, docEntry) => `/api/portal/customer/${area}/${encodeURIComponent(docEntry)}`;

const customerApi = {
  getProfile: () => portalApiClient.get('/api/portal/customer/profile').then(unwrap),
  getDashboard: () => portalApiClient.get('/api/portal/customer/dashboard').then(unwrap),
  getOrders: (params) => portalApiClient.get('/api/portal/customer/orders', { params }).then(unwrap),
  getOrder: (docEntry) => portalApiClient.get(detailPath('orders', docEntry)).then(unwrap),
  getInvoices: (params) => portalApiClient.get('/api/portal/customer/invoices', { params }).then(unwrap),
  getInvoice: (docEntry) => portalApiClient.get(detailPath('invoices', docEntry)).then(unwrap),
  getCreditNotes: (params) => portalApiClient.get('/api/portal/customer/credit-notes', { params }).then(unwrap),
  getCreditNote: (docEntry) => portalApiClient.get(detailPath('credit-notes', docEntry)).then(unwrap),
  getDeliveries: (params) => portalApiClient.get('/api/portal/customer/deliveries', { params }).then(unwrap),
  getDelivery: (docEntry) => portalApiClient.get(detailPath('deliveries', docEntry)).then(unwrap),
  getPayments: (params) => portalApiClient.get('/api/portal/customer/payments', { params }).then(unwrap),
  getPayment: (docEntry) => portalApiClient.get(detailPath('payments', docEntry)).then(unwrap),
};

export default customerApi;
