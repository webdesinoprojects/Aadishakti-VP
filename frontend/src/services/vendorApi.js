import portalApiClient from './portalApiClient';

const unwrap = (response) => response.data;
const detailPath = (area, docEntry) => `/api/portal/vendor/${area}/${encodeURIComponent(docEntry)}`;
const workflow = '/api/portal/vendor/workflows';
const formRequest = (url, data) => portalApiClient.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap);

const vendorApi = {
  getProfile: () => portalApiClient.get('/api/portal/vendor/profile').then(unwrap),
  getDashboard: () => portalApiClient.get('/api/portal/vendor/dashboard').then(unwrap),
  getPurchaseOrders: (params) => portalApiClient.get('/api/portal/vendor/purchase-orders', { params }).then(unwrap),
  getPurchaseOrder: (docEntry, companyCode) => portalApiClient.get(detailPath('purchase-orders', docEntry), { params: { companyCode } }).then(unwrap),
  getInvoices: (params) => portalApiClient.get('/api/portal/vendor/invoices', { params }).then(unwrap),
  getInvoice: (docEntry, companyCode) => portalApiClient.get(detailPath('invoices', docEntry), { params: { companyCode } }).then(unwrap),
  getCreditNotes: (params) => portalApiClient.get('/api/portal/vendor/credit-notes', { params }).then(unwrap),
  getCreditNote: (docEntry, companyCode) => portalApiClient.get(detailPath('credit-notes', docEntry), { params: { companyCode } }).then(unwrap),
  getDebitNotes: (params) => portalApiClient.get('/api/portal/vendor/debit-notes', { params }).then(unwrap),
  getDebitNote: (docEntry, companyCode) => portalApiClient.get(detailPath('debit-notes', docEntry), { params: { companyCode } }).then(unwrap),
  getGrpos: (params) => portalApiClient.get('/api/portal/vendor/grpos', { params }).then(unwrap),
  getGrpo: (docEntry, companyCode) => portalApiClient.get(detailPath('grpos', docEntry), { params: { companyCode } }).then(unwrap),
  getPayments: (params) => portalApiClient.get('/api/portal/vendor/payments', { params }).then(unwrap),
  getPayment: (docEntry, companyCode) => portalApiClient.get(detailPath('payments', docEntry), { params: { companyCode } }).then(unwrap),
  getRfqs: () => portalApiClient.get(`${workflow}/rfqs`).then(unwrap),
  getQuotations: () => portalApiClient.get(`${workflow}/quotations`).then(unwrap),
  submitQuotation: (assignmentId, formData) => formRequest(`${workflow}/rfqs/${assignmentId}/quotation`, formData),
  getDocuments: () => portalApiClient.get(`${workflow}/documents`).then(unwrap),
  submitDocument: (formData) => formRequest(`${workflow}/documents`, formData),
  getReceipts: () => portalApiClient.get(`${workflow}/receipts`).then(unwrap),
  submitReceipt: (formData) => formRequest(`${workflow}/receipts`, formData),
  getPerformance: () => portalApiClient.get(`${workflow}/performance`).then(unwrap),
  getLogistics: () => portalApiClient.get(`${workflow}/logistics`).then(unwrap),
  addLogisticsMessage: (id, data) => portalApiClient.post(`${workflow}/logistics/${encodeURIComponent(id)}/messages`, data).then(unwrap),
  updateLogisticsStage: (id, formData) => formRequest(`${workflow}/logistics/${encodeURIComponent(id)}/stages`, formData),
  submitPod: (id, formData) => formRequest(`${workflow}/logistics/${encodeURIComponent(id)}/pod`, formData),
  getSupport: () => portalApiClient.get(`${workflow}/support`).then(unwrap),
  createSupport: (data) => portalApiClient.post(`${workflow}/support`, data).then(unwrap),
  askAssistant: (message) => portalApiClient.post(`${workflow}/assistant`, { message }).then(unwrap),
  getProfileUpdates: () => portalApiClient.get('/api/portal/operations/profile-updates').then(unwrap),
  submitProfileUpdate: (data) => portalApiClient.post('/api/portal/operations/profile-updates', data).then(unwrap),
  getReconciliations: () => portalApiClient.get('/api/portal/operations/reconciliations').then(unwrap),
  submitReconciliation: (formData) => formRequest('/api/portal/operations/reconciliations', formData),
};

export default vendorApi;
