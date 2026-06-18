import { X } from 'lucide-react';
import { ASSETS } from '../../assets/assetMap';

export default function DocumentViewerModal({ isOpen, onClose, data, type, vendorProfile }) {
  if (!isOpen || !data) return null;

  const isInvoice = type === 'invoice';

  const getStampColor = (status) => {
    const s = status.toUpperCase();
    if (s.includes('REJECTED') || s.includes('OVERDUE')) return '#d32f2f'; // Red
    if (s.includes('PENDING') || s.includes('UNDER INSPECTION')) return '#1976d2'; // Blue
    return '#2e7d32'; // Green
  };
  
  const stampColor = getStampColor(data.status);

  return (
    <div className="doc-modal-overlay" onClick={onClose}>
      <div className="doc-modal-paper" onClick={(e) => e.stopPropagation()}>
        <button className="doc-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="doc-header">
          <div>
            <img src={ASSETS.logo} alt="Aadishakti" className="doc-logo" />
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <strong>Aadishakti Private Limited</strong><br/>
              Mundra Plant, Gujarat, India<br/>
              GSTIN: 24AAACA1234A1Z5
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 className="doc-title">{isInvoice ? 'TAX INVOICE' : 'GOODS RECEIPT NOTE'}</h2>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              {isInvoice ? `INV NO: ${data.invoiceNo}` : `GRN NO: ${data.grnNo}`}
            </div>
          </div>
        </div>

        <div className="doc-meta">
          <div>
            <strong>To Vendor:</strong><br/>
            {vendorProfile.name}<br/>
            Code: {vendorProfile.vendorCode}<br/>
            Status: <span style={{ color: 'var(--red-core)', fontWeight: 'bold', textTransform: 'uppercase' }}>{data.status}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Reference:</strong><br/>
            PO Number: {data.poNumber}<br/>
            Date: {isInvoice ? data.dueDate : data.receivedDate}
          </div>
        </div>

        <table className="doc-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              {isInvoice && <th>Amount</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{isInvoice ? 'Materials / Services as per PO' : data.material}</td>
              <td>{isInvoice ? '1 LOT' : data.quantity}</td>
              {isInvoice && <td>₹ {data.amount}</td>}
            </tr>
          </tbody>
        </table>

        {isInvoice && (
          <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', marginBottom: '40px' }}>
            Total Payable: ₹ {data.amount}
          </div>
        )}

        <div className="doc-footer">
          <div>
            <div className="doc-stamp" style={{ borderColor: stampColor, color: stampColor }}>
              {data.status}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="doc-signature">A. Sharma</div>
            <div style={{ fontSize: '12px', color: '#666', borderTop: '1px solid #333', paddingTop: '5px' }}>
              Authorized Signatory<br/>
              Aadishakti Pvt Ltd
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
