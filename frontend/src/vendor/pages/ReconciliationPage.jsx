import PortalReconciliationWorkspace from '../../portal/PortalReconciliationWorkspace';
import vendorApi from '../../services/vendorApi';
import VendorPageHeader from '../components/VendorPageHeader';

export default function ReconciliationPage() {
  return <div className="vendor-page"><VendorPageHeader title="Statements & Reconciliation" subtitle="Submit account statements and track verification status." /><PortalReconciliationWorkspace api={vendorApi} role="vendor" /></div>;
}
