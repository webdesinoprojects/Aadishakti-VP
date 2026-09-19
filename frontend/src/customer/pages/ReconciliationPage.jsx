import PortalReconciliationWorkspace from '../../portal/PortalReconciliationWorkspace';
import customerApi from '../../services/customerApi';
import CustomerPageHeader from '../components/CustomerPageHeader';

export default function ReconciliationPage() {
  return <div style={{ padding: '40px' }}><CustomerPageHeader title="Statements & Reconciliation" subtitle="Submit account statements and track verification status." /><PortalReconciliationWorkspace api={customerApi} role="customer" /></div>;
}
