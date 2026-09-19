import portalApiClient from './portalApiClient';

const unwrap = (response) => response.data;
const detailPath = (area, docEntry) => `/api/portal/customer/${area}/${encodeURIComponent(docEntry)}`;
const workflow = '/api/portal/customer/workflows';
const formRequest = (url, data) => portalApiClient.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap);

const customerApi = {
  getProfile: () => portalApiClient.get('/api/portal/customer/profile').then(unwrap),
  getDashboard: () => portalApiClient.get('/api/portal/customer/dashboard').then(unwrap),
  getOrders: (params) => portalApiClient.get('/api/portal/customer/orders', { params }).then(unwrap),
  getOrder: (docEntry) => portalApiClient.get(detailPath('orders', docEntry)).then(unwrap),
  getInvoices: (params) => portalApiClient.get('/api/portal/customer/invoices', { params }).then(unwrap),
  getInvoice: (docEntry, companyCode) => portalApiClient.get(detailPath('invoices', docEntry), { params: { companyCode } }).then(unwrap),
  getCreditNotes: (params) => portalApiClient.get('/api/portal/customer/credit-notes', { params }).then(unwrap),
  getCreditNote: (docEntry, companyCode) => portalApiClient.get(detailPath('credit-notes', docEntry), { params: { companyCode } }).then(unwrap),
  getDeliveries: (params) => portalApiClient.get('/api/portal/customer/deliveries', { params }).then(unwrap),
  getDelivery: (docEntry, companyCode) => portalApiClient.get(detailPath('deliveries', docEntry), { params: { companyCode } }).then(unwrap),
  getPayments: (params) => portalApiClient.get('/api/portal/customer/payments', { params }).then(unwrap),
  getPayment: (docEntry, companyCode) => portalApiClient.get(detailPath('payments', docEntry), { params: { companyCode } }).then(unwrap),
  getDocuments: () => portalApiClient.get(`${workflow}/documents`).then(unwrap),
  submitDocument: (formData) => formRequest(`${workflow}/documents`, formData),
  getReceipts: () => portalApiClient.get(`${workflow}/receipts`).then(unwrap),
  submitReceipt: (formData) => formRequest(`${workflow}/receipts`, formData),
  getSupport: () => portalApiClient.get(`${workflow}/support`).then(unwrap),
  createSupport: (data) => portalApiClient.post(`${workflow}/support`, data).then(unwrap),
  askAssistant: (message) => portalApiClient.post(`${workflow}/assistant`, { message }).then(unwrap),
  getProfileUpdates: () => portalApiClient.get('/api/portal/operations/profile-updates').then(unwrap),
  submitProfileUpdate: (data) => portalApiClient.post('/api/portal/operations/profile-updates', data).then(unwrap),
  replySupport: (id, data) => portalApiClient.post(`${workflow}/support/${id}/messages`, data).then(unwrap),
  getRequests: (params) => portalApiClient.get(`${workflow}/requests`, { params }).then(unwrap),
  submitRequest: (formData) => formRequest(`${workflow}/requests`, formData),
  getLogistics: () => portalApiClient.get(`${workflow}/logistics`).then(unwrap),
  addLogisticsMessage: (id, data) => portalApiClient.post(`${workflow}/logistics/${encodeURIComponent(id)}/messages`, data).then(unwrap),
  reviewPod: (id, data) => portalApiClient.post(`${workflow}/logistics/${encodeURIComponent(id)}/pod-review`, data).then(unwrap),
  getReconciliations: () => portalApiClient.get('/api/portal/operations/reconciliations').then(unwrap),
  submitReconciliation: (formData) => formRequest('/api/portal/operations/reconciliations', formData),
};

export default customerApi;
