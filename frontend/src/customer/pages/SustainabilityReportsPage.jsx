import CustomerPageHeader from '../components/CustomerPageHeader';
import CustomerRequestsWorkspace from '../components/CustomerRequestsWorkspace';

export default function SustainabilityReportsPage() {
  return <div style={{ padding: '40px' }}><CustomerPageHeader title="Sustainability Reports & COA" subtitle="Request Aadishakti-issued reports and certificates and track fulfilment." /><CustomerRequestsWorkspace defaultType="sustainability_report" requestTypes={[{ value: 'sustainability_report', label: 'Sustainability Report' }, { value: 'coa', label: 'Certificate of Analysis' }, { value: 'document', label: 'Other Document' }]} /></div>;
}
