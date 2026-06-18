import { useState } from 'react';
import { Download, Folder, FileText, FileSpreadsheet } from 'lucide-react';
import CustomerPageHeader from '../components/CustomerPageHeader';
import { useCustomerData } from '../hooks/useCustomerData';

export default function DocumentsPage() {
  const { data, loading } = useCustomerData();
  const [activeFolder, setActiveFolder] = useState('All');
  const [search, setSearch] = useState('');

  if (loading || !data) return <div style={{ padding: '40px' }}>Loading...</div>;

  const folders = ['All', 'Invoices', 'COA', 'E-Way Bills'];
  
  const allDocs = data.documents || [];
  
  let filteredDocs = allDocs;
  if (activeFolder !== 'All') {
    filteredDocs = filteredDocs.filter(d => d.name.includes(activeFolder));
  }
  if (search) {
    filteredDocs = filteredDocs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  }

  return (
    <div style={{ padding: '40px' }}>
      <CustomerPageHeader title="Document Center" subtitle="Securely access all your supply chain documents." />
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Sidebar Folders */}
        <div className="customer-card" style={{ width: '250px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Categories</h3>
          {folders.map(folder => (
            <button 
              key={folder}
              onClick={() => setActiveFolder(folder)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px',
                background: activeFolder === folder ? 'var(--red-subtle)' : 'transparent',
                color: activeFolder === folder ? 'var(--red-core)' : 'var(--text-primary)',
                border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s'
              }}
            >
              <Folder size={18} fill={activeFolder === folder ? 'var(--red-core)' : 'none'} /> {folder}
            </button>
          ))}
        </div>

        {/* File View */}
        <div className="customer-card" style={{ flex: 1, padding: 0 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 16px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>
          <table className="customer-table">
            <thead><tr><th>Name</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {filteredDocs.map((doc, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {doc.name.includes('pdf') ? <FileText size={18} color="#ef4444" /> : <FileSpreadsheet size={18} color="#10b981" />}
                    {doc.name}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{doc.date}</td>
                  <td><button className="customer-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Download size={14}/> Download</button></td>
                </tr>
              ))}
              {filteredDocs.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>No documents found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
