export const titleize = (value = '') => String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const formatWorkflowDate = (value, withTime = false) => value
  ? new Date(value).toLocaleString('en-IN', withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' })
  : '—';

export const workflowStatusClass = (status = '') => `customer-workflow-status is-${String(status).toLowerCase().replaceAll('_', '-')}`;
