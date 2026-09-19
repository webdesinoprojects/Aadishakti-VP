import PortalDocumentsWorkspace from '../../portal/PortalDocumentsWorkspace';
import vendorApi from '../../services/vendorApi';
import VendorPageHeader from '../components/VendorPageHeader';

export default function DocumentsPage() {
  return <div className="vendor-page"><VendorPageHeader title="Compliance Documents" subtitle="Upload certificates and compliance documents for Aadishakti review." /><PortalDocumentsWorkspace api={vendorApi} role="vendor" /></div>;
}
