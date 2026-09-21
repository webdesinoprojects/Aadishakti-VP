import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerRequestsWorkspace from '../components/CustomerRequestsWorkspace';

export default function ReturnsPage() {
  return <div className="customer-workflow-page"><CustomerPageHeader title="Quality Claims" subtitle="Submit product quality claims for Aadishakti review and resolution." /><CustomerRequestsWorkspace mode="claims" defaultType="quality_claim" historyTypes={['quality_claim', 'return']} requestTypes={[{ value: 'quality_claim', label: 'Quality Claim' }]} /></div>;
}
