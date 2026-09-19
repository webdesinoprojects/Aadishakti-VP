import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerRequestsWorkspace from '../components/CustomerRequestsWorkspace';

export default function ReturnsPage() {
  return <div style={{ padding: '40px' }}><CustomerPageHeader title="Returns & Quality Claims" subtitle="Submit return or quality claims for Aadishakti review." /><CustomerRequestsWorkspace defaultType="return" requestTypes={[{ value: 'return', label: 'Return Request' }, { value: 'quality_claim', label: 'Quality Claim' }]} /></div>;
}
