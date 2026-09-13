import portalApiClient from './portalApiClient';

const unwrap = (response) => response.data;
const detailPath = (area, docEntry) => `/api/portal/vendor/${area}/${encodeURIComponent(docEntry)}`;

const vendorApi = {
  getProfile: () => portalApiClient.get('/api/portal/vendor/profile').then(unwrap),
  getDashboard: () => portalApiClient.get('/api/portal/vendor/dashboard').then(unwrap),
  getPurchaseOrders: (params) => portalApiClient.get('/api/portal/vendor/purchase-orders', { params }).then(unwrap),
  getPurchaseOrder: (docEntry) => portalApiClient.get(detailPath('purchase-orders', docEntry)).then(unwrap),
  getInvoices: (params) => portalApiClient.get('/api/portal/vendor/invoices', { params }).then(unwrap),
  getInvoice: (docEntry) => portalApiClient.get(detailPath('invoices', docEntry)).then(unwrap),
  getCreditNotes: (params) => portalApiClient.get('/api/portal/vendor/credit-notes', { params }).then(unwrap),
  getCreditNote: (docEntry) => portalApiClient.get(detailPath('credit-notes', docEntry)).then(unwrap),
  getDebitNotes: (params) => portalApiClient.get('/api/portal/vendor/debit-notes', { params }).then(unwrap),
  getDebitNote: (docEntry) => portalApiClient.get(detailPath('debit-notes', docEntry)).then(unwrap),
  getGrpos: (params) => portalApiClient.get('/api/portal/vendor/grpos', { params }).then(unwrap),
  getGrpo: (docEntry) => portalApiClient.get(detailPath('grpos', docEntry)).then(unwrap),
  getPayments: (params) => portalApiClient.get('/api/portal/vendor/payments', { params }).then(unwrap),
  getPayment: (docEntry) => portalApiClient.get(detailPath('payments', docEntry)).then(unwrap),
};

export default vendorApi;
