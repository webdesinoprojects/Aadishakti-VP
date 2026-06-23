import os
import json

base_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP"

# 1. Backend: data/soas.json
soas_file = os.path.join(base_dir, "backend", "data", "soas.json")
if not os.path.exists(soas_file):
    with open(soas_file, "w", encoding="utf-8") as f:
        json.dump([], f)

# 2. Backend: uploads/soas
os.makedirs(os.path.join(base_dir, "backend", "uploads", "soas"), exist_ok=True)

# 3. Update server.js
server_file = os.path.join(base_dir, "backend", "server.js")
with open(server_file, "r", encoding="utf-8") as f:
    server_content = f.read()

if "/api/soa/upload" not in server_content:
    new_endpoints = """
// --- SOA / RECONCILIATION ---
const soaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads', 'soas'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'soa-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const soaUpload = multer({ storage: soaStorage });

const SOAS_FILE = path.join(__dirname, 'data', 'soas.json');

app.post('/api/soa/upload', soaUpload.single('file'), (req, res) => {
  const { userId, quarter, role } = req.body;
  if (!req.file || !userId || !quarter) {
    return res.status(400).json({ error: 'Missing file, userId or quarter' });
  }
  const soas = JSON.parse(fs.readFileSync(SOAS_FILE));
  const newSoa = {
    id: Date.now().toString(),
    userId,
    role: role || 'Vendor',
    quarter,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    status: 'Pending Verification',
    createdAt: new Date().toISOString()
  };
  soas.push(newSoa);
  fs.writeFileSync(SOAS_FILE, JSON.stringify(soas, null, 2));
  res.json({ message: 'SOA uploaded successfully', soa: newSoa });
});

app.get('/api/soa/:userId', (req, res) => {
  const soas = JSON.parse(fs.readFileSync(SOAS_FILE));
  const userSoas = soas.filter(s => s.userId === req.params.userId);
  res.json(userSoas.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.get('/api/admin/soas', (req, res) => {
  const soas = JSON.parse(fs.readFileSync(SOAS_FILE));
  res.json(soas.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/admin/soas/:id/verify', (req, res) => {
  const soas = JSON.parse(fs.readFileSync(SOAS_FILE));
  const soa = soas.find(s => s.id === req.params.id);
  if (soa) {
    soa.status = 'Verified';
    fs.writeFileSync(SOAS_FILE, JSON.stringify(soas, null, 2));
    res.json({ message: 'SOA verified successfully' });
  } else {
    res.status(404).json({ error: 'SOA not found' });
  }
});
// ----------------------------
"""
    server_content = server_content.replace("// Error Handling Middleware", new_endpoints + "\n// Error Handling Middleware")
    
    with open(server_file, "w", encoding="utf-8") as f:
        f.write(server_content)


# 4. Vendor Portal Page
vendor_reco_file = os.path.join(base_dir, "frontend", "src", "vendor", "pages", "ReconciliationPage.jsx")
os.makedirs(os.path.dirname(vendor_reco_file), exist_ok=True)
with open(vendor_reco_file, "w", encoding="utf-8") as f:
    f.write("""import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { buildApiUrl } from '../../../config/api';

export default function ReconciliationPage() {
  const { user } = useAuth();
  const [soas, setSoas] = useState([]);
  const [file, setFile] = useState(null);
  const [quarter, setQuarter] = useState('Q1 2026');
  const [uploading, setUploading] = useState(false);

  const loadSoas = async () => {
    try {
      const res = await fetch(buildApiUrl(`/api/soa/${user.username}`));
      const data = await res.json();
      setSoas(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSoas();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file to upload');

    // Check if quarter already has a verified SOA
    const existing = soas.find(s => s.quarter === quarter && s.status === 'Verified');
    if (existing) return alert(`You already have a verified SOA for ${quarter}. It cannot be changed.`);

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.username);
    formData.append('role', 'Vendor');
    formData.append('quarter', quarter);

    try {
      const res = await fetch(buildApiUrl('/api/soa/upload'), {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setFile(null);
        loadSoas();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Statements & Reconciliation" 
        subtitle="Upload your Quarterly Statement of Account (SOA) for Admin verification." 
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '20px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Upload New SOA</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '500' }}>Select Quarter</label>
              <select 
                value={quarter} 
                onChange={e => setQuarter(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option>Q1 2026 (Jan - Mar)</option>
                <option>Q2 2026 (Apr - Jun)</option>
                <option>Q3 2026 (Jul - Sep)</option>
                <option>Q4 2026 (Oct - Dec)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '500' }}>SOA Document (PDF, Excel, Word)</label>
              <input 
                type="file" 
                onChange={e => setFile(e.target.files[0])}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={uploading}
              style={{ background: 'var(--red-core)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Upload size={18} /> {uploading ? 'Uploading...' : 'Submit SOA'}
            </button>
          </form>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Upload History</h3>
          {soas.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '6px' }}>
              No statements uploaded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {soas.map(soa => (
                <div key={soa.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={24} color="#64748b" />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{soa.quarter}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Submitted on {new Date(soa.createdAt).toLocaleDateString()}</div>
                      <a href={buildApiUrl(`/uploads/soas/${soa.fileName}`)} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>View {soa.originalName}</a>
                    </div>
                  </div>
                  <div>
                    {soa.status === 'Verified' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        <CheckCircle size={14} /> Verified & Reconciled
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        <AlertCircle size={14} /> Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
""")

# 5. Customer Portal Page (Copy Vendor Page exactly but change path)
customer_reco_file = os.path.join(base_dir, "frontend", "src", "customer", "pages", "ReconciliationPage.jsx")
with open(customer_reco_file, "w", encoding="utf-8") as f:
    with open(vendor_reco_file, "r", encoding="utf-8") as v:
        content = v.read()
        content = content.replace("role: 'Vendor'", "role: 'Customer'")
        f.write(content)

# 6. Admin Portal Page
admin_reco_file = os.path.join(base_dir, "frontend", "src", "admin", "pages", "operations", "ReconciliationsManager.jsx")
with open(admin_reco_file, "w", encoding="utf-8") as f:
    f.write("""import { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import { CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
import { buildApiUrl } from '../../../config/api';

export default function ReconciliationsManager() {
  const [soas, setSoas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSoas = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/admin/soas'));
      const data = await res.json();
      setSoas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoas();
  }, []);

  const handleVerify = async (id) => {
    if (!window.confirm('Are you sure you want to verify this SOA? It will be locked permanently.')) return;
    try {
      const res = await fetch(buildApiUrl(`/api/admin/soas/${id}/verify`), {
        method: 'POST'
      });
      if (res.ok) {
        fetchSoas();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  const pendingSoas = soas.filter(s => s.status === 'Pending Verification');
  const verifiedSoas = soas.filter(s => s.status === 'Verified');

  return (
    <>
      <TopBar breadcrumb="Operations / Quarterly Reconciliations" />
      <div className="admin-content" style={{ maxWidth: '1000px' }}>
        <h1 className="card-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Quarterly Reconciliations</h1>
        <p className="card-subtitle" style={{ marginBottom: '32px' }}>Review and verify Statements of Account submitted by Vendors and Customers.</p>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Pending Reconciliations ({pendingSoas.length})</h3>
          {pendingSoas.length === 0 ? (
            <div style={{ background: '#f8fafc', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#64748b' }}>
              All caught up! No pending SOAs to verify.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingSoas.map(soa => (
                <div key={soa.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                      <FileText size={24} color="#3b82f6" />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{soa.userId} <span style={{ fontSize: '12px', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px', fontWeight: '500' }}>{soa.role}</span></h4>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', marginBottom: '4px' }}>Quarter: {soa.quarter}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Submitted: {new Date(soa.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a 
                      href={buildApiUrl(`/uploads/soas/${soa.fileName}`)} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}>
                      <Download size={16} /> View Document
                    </a>
                    <button 
                      onClick={() => handleVerify(soa.id)}
                      style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}>
                      <CheckCircle size={16} /> Verify & Lock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#64748b' }}>Verified History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', background: '#f8fafc', color: '#64748b' }}>
                <th style={{ padding: '16px' }}>Partner ID</th>
                <th style={{ padding: '16px' }}>Role</th>
                <th style={{ padding: '16px' }}>Quarter</th>
                <th style={{ padding: '16px' }}>Document</th>
                <th style={{ padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {verifiedSoas.map(soa => (
                <tr key={soa.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{soa.userId}</td>
                  <td style={{ padding: '16px' }}>{soa.role}</td>
                  <td style={{ padding: '16px' }}>{soa.quarter}</td>
                  <td style={{ padding: '16px' }}>
                    <a href={buildApiUrl(`/uploads/soas/${soa.fileName}`)} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>View File</a>
                  </td>
                  <td style={{ padding: '16px', color: '#166534', fontWeight: '600' }}><CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Verified</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
""")
