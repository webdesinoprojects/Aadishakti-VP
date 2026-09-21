import * as Tabs from '@radix-ui/react-tabs';
import { useCallback, useEffect, useState } from 'react';
import TopBar from '../../components/TopBar';
import { useToast } from '../../context/ToastContext';
import { portalAccountsAPI, portalWorkflowsAPI } from '../../utils/api';
import CustomerRequestsPanel from './CustomerRequestsPanel';
import PartnerDocumentsPanel from './PartnerDocumentsPanel';
import QuotationsPanel from './QuotationsPanel';
import ReceiptsPanel from './ReceiptsPanel';
import RfqsPanel from './RfqsPanel';
import SupportPanel from './SupportPanel';
import './portal-workflows.css';

const tabs = [
  { value: 'RFQs', label: 'RFQs', load: portalWorkflowsAPI.rfqs },
  { value: 'Quotations', label: 'Quotations', load: portalWorkflowsAPI.quotations },
  { value: 'Documents', label: 'Documents', load: portalWorkflowsAPI.documents },
  { value: 'Receipts', label: 'Receipts', load: portalWorkflowsAPI.receipts },
  { value: 'Customer Requests', label: 'Customer Requests', load: portalWorkflowsAPI.customerRequests },
  { value: 'Support', label: 'Support', load: portalWorkflowsAPI.support },
];

export default function PortalWorkflowsManager() {
  const [tab, setTab] = useState('RFQs');
  const [data, setData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  const load = useCallback(async () => {
    const current = tabs.find((item) => item.value === tab);
    setLoading(true);
    try { setData((await current.load()).data || []); }
    catch { setData([]); error(`Failed to load ${tab.toLowerCase()}.`); }
    finally { setLoading(false); }
  }, [tab, error]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    portalAccountsAPI.list({ role: 'vendor', status: 'active' })
      .then((response) => setVendors(response.data || []))
      .catch(() => error('Failed to load active vendor accounts.'));
  }, [error]);

  return <>
    <TopBar breadcrumb="Operations / Portal Workflows" />
    <div className="admin-content workflow-page">
      <div className="workflow-page-heading"><h1>Portal Workflows</h1><p>Manage partner-owned workflows that are not supplied by CIS.</p></div>
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List className="workflow-tabs" aria-label="Portal workflow sections">{tabs.map((item) => <Tabs.Trigger key={item.value} value={item.value}>{item.label}</Tabs.Trigger>)}</Tabs.List>
        <div className={loading ? 'workflow-panel is-loading' : 'workflow-panel'} aria-busy={loading}>
          {loading && <div className="workflow-loading"><span /> Loading {tab.toLowerCase()}...</div>}
          {!loading && <>
            <Tabs.Content value="RFQs"><RfqsPanel items={data} vendors={vendors} onReload={load} /></Tabs.Content>
            <Tabs.Content value="Quotations"><QuotationsPanel items={data} onReload={load} /></Tabs.Content>
            <Tabs.Content value="Documents"><PartnerDocumentsPanel items={data} onReload={load} /></Tabs.Content>
            <Tabs.Content value="Receipts"><ReceiptsPanel items={data} onReload={load} /></Tabs.Content>
            <Tabs.Content value="Customer Requests"><CustomerRequestsPanel items={data} onReload={load} /></Tabs.Content>
            <Tabs.Content value="Support"><SupportPanel items={data} onReload={load} /></Tabs.Content>
          </>}
        </div>
      </Tabs.Root>
    </div>
  </>;
}
