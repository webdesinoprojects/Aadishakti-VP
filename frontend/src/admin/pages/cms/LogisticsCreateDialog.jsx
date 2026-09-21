import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle2, Truck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './logistics-create.css';

export default function LogisticsCreateDialog({ quotationId = '', quotations, vendors, customers, orders, loading, busy, onClose, onCreate }) {
  const [sourceQuotationId, setSourceQuotationId] = useState(quotationId);
  const [vendorAccountId, setVendorAccountId] = useState('');
  const [customerAccountId, setCustomerAccountId] = useState('');
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const quotation = quotations.find((item) => item.id === sourceQuotationId);
  const existingOrder = orders.find((item) => item.sourceQuotationId === sourceQuotationId && sourceQuotationId);
  const companyCode = quotation?.assignment?.rfq?.company_code;
  const eligibleCustomers = companyCode
    ? customers.filter((account) => account.mappings?.some((mapping) => mapping.companyCode === companyCode))
    : customers;

  useEffect(() => {
    if (quotation && !product) setProduct(quotation.assignment?.rfq?.product || '');
  }, [quotation, product]);

  const chooseQuotation = (event) => {
    const nextId = event.target.value;
    const next = quotations.find((item) => item.id === nextId);
    setSourceQuotationId(nextId);
    setVendorAccountId('');
    setCustomerAccountId('');
    setProduct(next?.assignment?.rfq?.product || '');
  };

  const submit = (event) => {
    event.preventDefault();
    onCreate({
      sourceQuotationId: sourceQuotationId || undefined,
      vendorAccountId: sourceQuotationId ? quotation?.assignment?.vendor?.id : vendorAccountId,
      customerAccountId,
      product: product.trim(),
      amount: amount.trim(),
    });
  };

  return <Dialog.Root open onOpenChange={(open) => !open && !busy && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="logistics-create-overlay" />
      <Dialog.Content className="logistics-create-dialog">
        <header><div><span>Operations / Logistics</span><Dialog.Title>Create logistics order</Dialog.Title><Dialog.Description>Select an accepted quotation or create a standalone order, then assign its customer and vendor.</Dialog.Description></div><Dialog.Close disabled={busy} aria-label="Close"><X size={20} /></Dialog.Close></header>
        <form id="logistics-create-form" onSubmit={submit}>
          <label className="logistics-create-wide"><span>Accepted quotation (optional)</span><select value={sourceQuotationId} onChange={chooseQuotation} disabled={busy}><option value="">Standalone order — no quotation</option>{quotations.map((item) => <option key={item.id} value={item.id} disabled={orders.some((order) => order.sourceQuotationId === item.id)}>{item.quotation_reference} · {item.assignment?.vendor?.display_name || 'Vendor'} · {item.assignment?.rfq?.rfq_reference || 'RFQ'}{orders.some((order) => order.sourceQuotationId === item.id) ? ' (order created)' : ''}</option>)}</select></label>
          {sourceQuotationId && (quotation ? <div className="logistics-source-summary logistics-create-wide"><CheckCircle2 size={18} /><div><strong>{quotation.assignment?.vendor?.display_name}</strong><span>{quotation.assignment?.rfq?.rfq_reference} · Unit price {quotation.unit_price ?? 'not supplied'} · {companyCode || 'All companies'}</span></div></div> : <p className={loading ? 'logistics-create-hint logistics-create-wide' : 'logistics-create-error logistics-create-wide'}>{loading ? 'Loading accepted quotation...' : 'This quotation is not accepted or could not be loaded.'}</p>)}
          {existingOrder && <p className="logistics-create-error logistics-create-wide">This quotation already has logistics order {existingOrder.id}.</p>}
          {!sourceQuotationId && <label><span>Vendor account *</span><select value={vendorAccountId} onChange={(event) => setVendorAccountId(event.target.value)} required disabled={busy || loading}><option value="">Select vendor</option>{vendors.map((account) => <option key={account.id} value={account.id}>{account.displayName} · {account.loginId}</option>)}</select></label>}
          <label><span>Customer account *</span><select value={customerAccountId} onChange={(event) => setCustomerAccountId(event.target.value)} required disabled={busy || loading}><option value="">Select customer</option>{eligibleCustomers.map((account) => <option key={account.id} value={account.id}>{account.displayName} · {account.loginId}</option>)}</select>{companyCode && !eligibleCustomers.length && <small>No active customer is mapped to {companyCode}.</small>}</label>
          <label><span>Product *</span><input value={product} onChange={(event) => setProduct(event.target.value)} required disabled={busy} placeholder="Material or product" /></label>
          <label><span>Order amount</span><input value={amount} onChange={(event) => setAmount(event.target.value)} disabled={busy} type="number" min="0" step="0.01" placeholder="Optional" /><small>Enter the total order amount, not the quotation's unit price.</small></label>
          <p className="logistics-create-hint logistics-create-wide">The order starts at “Order Confirmed.” The selected vendor can update stages and upload delivery proof; the selected customer can track and review it.</p>
        </form>
        <footer><button className="btn btn-secondary" type="button" onClick={onClose} disabled={busy}>Cancel</button><button className="btn btn-primary" type="submit" form="logistics-create-form" disabled={busy || loading || Boolean(existingOrder) || !customerAccountId || (!sourceQuotationId && !vendorAccountId) || (sourceQuotationId && !quotation) || !product.trim()}><Truck size={17} />{busy ? 'Creating...' : 'Create & assign order'}</button></footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
