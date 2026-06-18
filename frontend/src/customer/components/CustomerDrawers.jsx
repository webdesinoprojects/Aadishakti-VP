import { X, Download, FileText, CheckCircle, Shield } from 'lucide-react';

// Base Drawer Wrapper
const DrawerWrapper = ({ title, isOpen, onClose, children, width = '500px' }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
      display: 'flex', justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width, backgroundColor: 'var(--bg-surface)', height: '100%',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// 1. Invoice Drawer
export const InvoiceDrawer = ({ invoice, onClose }) => {
  if (!invoice) return null;
  return (
    <DrawerWrapper title="Invoice Details" isOpen={!!invoice} onClose={onClose} width="600px">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{invoice.id}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Issued: {invoice.date}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className={`status-badge ${invoice.status === 'Paid' ? 'delivered' : invoice.status === 'Pending' ? 'intransit' : 'cancelled'}`}>
            {invoice.status}
          </span>
          <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '12px' }}>₹ {invoice.amount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
        <div>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Billed To</h4>
          <p style={{ fontWeight: '600', fontSize: '15px' }}>Aadishakti Customer</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>123 Industrial Phase 1<br/>Mumbai, MH 400001<br/>GSTIN: 27AAAAA1234A1Z5</p>
        </div>
        <div>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Linked Order</h4>
          <p style={{ fontWeight: '600', fontSize: '15px', color: 'var(--red-core)' }}>{invoice.orderId || 'ASPL/ORD/24-25/1256'}</p>
        </div>
      </div>

      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Line Items</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px' }}>
            <th style={{ paddingBottom: '12px' }}>Product Description</th>
            <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Qty</th>
            <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Rate</th>
            <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '16px 0', fontWeight: '500' }}>Pure Lead 99.97%</td>
            <td style={{ padding: '16px 0', textAlign: 'center' }}>{invoice.amount > 2000000 ? '100 MT' : '50 MT'}</td>
            <td style={{ padding: '16px 0', textAlign: 'right' }}>₹ 2,60,000</td>
            <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: '600' }}>₹ {(invoice.amount * 0.82).toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
        <div style={{ width: '250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
            <span>Subtotal:</span>
            <span>₹ {(invoice.amount * 0.82).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
            <span>IGST (18%):</span>
            <span>₹ {(invoice.amount * 0.18).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid var(--border-color)', fontWeight: '800', fontSize: '18px' }}>
            <span>Total:</span>
            <span>₹ {invoice.amount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        {invoice.status !== 'Paid' && (
          <button style={{ flex: 1, padding: '14px', background: 'var(--red-core)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            Pay Now (Gateway)
          </button>
        )}
        <button style={{ flex: invoice.status === 'Paid' ? 1 : 'none', padding: '14px 24px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
          <Download size={18} /> Download PDF
        </button>
      </div>
    </DrawerWrapper>
  );
};

// 2. Payment Drawer
export const PaymentDrawer = ({ payment, onClose }) => {
  if (!payment) return null;
  return (
    <DrawerWrapper title="Payment Receipt" isOpen={!!payment} onClose={onClose}>
      <div style={{ textAlign: 'center', marginBottom: '30px', padding: '30px', background: 'var(--status-delivered-bg)', borderRadius: '12px' }}>
        <CheckCircle size={48} color="var(--status-delivered)" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--status-delivered)', marginBottom: '8px' }}>₹ {payment.amount.toLocaleString('en-IN')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Payment Successful</p>
      </div>

      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Transaction Details</h4>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Transaction ID:</span><span style={{ fontWeight: '600' }}>{payment.id}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Date & Time:</span><span style={{ fontWeight: '500' }}>{payment.date} 14:32 IST</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Payment Method:</span><span style={{ fontWeight: '500' }}>{payment.method}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Linked Invoice:</span><span style={{ fontWeight: '600', color: 'var(--red-core)' }}>{payment.invoiceId}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Bank Reference:</span><span style={{ fontWeight: '500' }}>UTR-891238912739</span></div>
        </div>
      </div>
      
      <button style={{ width: '100%', padding: '14px', background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
        <Download size={18} /> Download Receipt
      </button>
    </DrawerWrapper>
  );
};

// 3. Quality Drawer
export const QualityDrawer = ({ qc, onClose }) => {
  if (!qc) return null;
  return (
    <DrawerWrapper title="Certificate of Analysis" isOpen={!!qc} onClose={onClose} width="600px">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px', padding: '20px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
        <Shield size={32} color="var(--status-delivered)" />
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{qc.product}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Batch No: <strong>{qc.batch}</strong> | ID: {qc.id}</p>
        </div>
      </div>

      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Chemical Composition</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderRadius: '4px 0 0 4px' }}>Element</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Result (%)</th>
            <th style={{ padding: '12px', textAlign: 'right', borderRadius: '0 4px 4px 0' }}>Specification (%)</th>
          </tr>
        </thead>
        <tbody>
          {qc.product.includes('Pure') ? (
            <>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>Lead (Pb)</td><td style={{ padding: '12px', textAlign: 'center', color: 'var(--status-delivered)', fontWeight: '700' }}>99.982%</td><td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-muted)' }}>99.970% Min</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>Silver (Ag)</td><td style={{ padding: '12px', textAlign: 'center' }}>0.0015%</td><td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-muted)' }}>0.003% Max</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>Bismuth (Bi)</td><td style={{ padding: '12px', textAlign: 'center' }}>0.0120%</td><td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-muted)' }}>0.025% Max</td>
              </tr>
            </>
          ) : (
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>Lead (Pb)</td><td style={{ padding: '12px', textAlign: 'center', color: 'var(--status-delivered)', fontWeight: '700' }}>99.9%</td><td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-muted)' }}>99.5% Min</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ padding: '20px', background: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid var(--red-core)', marginBottom: '40px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--red-core)', marginBottom: '8px' }}>Inspector Remarks</h4>
        <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.5' }}>Material meets all quality standards for high-purity applications. Spectrographic analysis attached in full PDF.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '12px' }}>Inspected on {qc.date} by QA Dept.</p>
      </div>

      <button style={{ width: '100%', padding: '14px', background: 'var(--red-core)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
        <FileText size={18} /> Download Full COA Document
      </button>
    </DrawerWrapper>
  );
};

// 4. Return Drawer
export const ReturnDrawer = ({ returnItem, onClose }) => {
  if (!returnItem) return null;
  return (
    <DrawerWrapper title="Return Request Details" isOpen={!!returnItem} onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{returnItem.id}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Filed on {returnItem.date}</p>
        </div>
        <span className="status-badge delivered">{returnItem.status}</span>
      </div>

      <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '30px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Linked Order</p>
        <p style={{ fontWeight: '700', fontSize: '16px', color: 'var(--red-core)', marginBottom: '16px' }}>{returnItem.orderId}</p>
        
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Refund Amount</p>
        <p style={{ fontWeight: '700', fontSize: '18px' }}>₹ {returnItem.amount.toLocaleString('en-IN')}</p>
      </div>

      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Return Timeline</h4>
      <div style={{ paddingLeft: '10px', borderLeft: '2px solid var(--border-color)', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-15px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-delivered)' }}></div>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>Refund Processed</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>20 Mar 2024 - Fund credited to original payment method.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-15px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-delivered)' }}></div>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>Material Picked Up</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>18 Mar 2024 - Logistics partner collected the goods.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-15px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-delivered)' }}></div>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>Request Approved</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>16 Mar 2024 - Aadishakti support approved the return.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-15px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-muted)' }}></div>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>Return Initiated</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>15 Mar 2024 - Reason: {returnItem.reason}</p>
        </div>
      </div>
      
      <button style={{ width: '100%', padding: '14px', background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
        Download Return Manifest
      </button>
    </DrawerWrapper>
  );
};

// 5. Support Drawer
export const SupportDrawer = ({ ticket, onClose }) => {
  if (!ticket) return null;
  return (
    <DrawerWrapper title="Support Thread" isOpen={!!ticket} onClose={onClose} width="550px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ticket.id}</span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>{ticket.subject}</h3>
        </div>
        <span className={`status-badge ${ticket.status === 'Resolved' ? 'delivered' : 'intransit'}`}>{ticket.status}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
        {/* Mock Thread */}
        <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: '#f1f5f9', padding: '16px', borderRadius: '8px 8px 8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <strong>You</strong> <span>{ticket.date}</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.5' }}>Hi, I noticed there's a slight delay in my shipment. Can you please provide an updated ETA?</p>
        </div>

        <div style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--red-subtle)', padding: '16px', borderRadius: '8px 8px 0 8px', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'var(--red-core)' }}>
            <strong>Aadishakti Support</strong> <span>{ticket.date}</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--text-primary)' }}>Hello! We apologize for the delay. The truck was held up due to interstate permit checks. It is now cleared and should reach you by tomorrow evening.</p>
        </div>

        {ticket.status === 'Resolved' && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <span style={{ display: 'inline-block', padding: '6px 12px', background: '#f1f5f9', color: 'var(--text-muted)', fontSize: '12px', borderRadius: '20px', fontWeight: '500' }}>
              This ticket has been marked as Resolved
            </span>
          </div>
        )}
      </div>

      {ticket.status !== 'Resolved' && (
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <textarea 
            placeholder="Type your reply here..." 
            rows="3" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '12px', fontFamily: 'inherit', resize: 'none' }}
          ></textarea>
          <button style={{ padding: '12px 24px', background: 'var(--text-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', float: 'right' }}>
            Send Reply
          </button>
          <div style={{ clear: 'both' }}></div>
        </div>
      )}
    </DrawerWrapper>
  );
};
