import PortalDocumentsWorkspace from '../../portal/PortalDocumentsWorkspace';
import customerApi from '../../services/customerApi';
import CustomerPageHeader from '../components/CustomerPageHeader';

export default function DocumentsPage() {
  return <div style={{ padding: '40px' }}><CustomerPageHeader title="Document Center" subtitle="Upload documents for review and access approved files." /><PortalDocumentsWorkspace api={customerApi} role="customer" /></div>;
}
