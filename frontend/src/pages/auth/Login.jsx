import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('customer'); // 'customer' or 'vendor'
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!code || !password) {
      setError('Please enter your ID and Password.');
      return;
    }
    
    if (tab === 'vendor') {
      if (code === 'VEN10234' && password === 'password') {
        localStorage.setItem('vendor_session', JSON.stringify({ vendorCode: 'VEN10234', name: 'Shree Metal Traders' }));
        navigate('/vendor/dashboard');
      } else {
        setError('Invalid Vendor Code or Password.');
      }
    } else {
      if (code === 'CUST992' && password === 'password') {
        localStorage.setItem('customer_session', JSON.stringify({ customerId: 'CUST992', name: 'ABC Batteries Pvt. Ltd.' }));
        navigate('/customer/dashboard');
      } else {
        setError('Invalid Customer ID or Password. (Hint: CUST992 / password)');
      }
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="corporate-card" style={{ maxWidth: '400px', width: '100%', padding: '40px', background: '#fff' }}>
        
        {/* Toggle */}
        <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '24px' }}>
          <button 
            onClick={() => { setTab('customer'); setError(''); setCode(''); setPassword(''); }}
            style={{ 
              flex: 1, padding: '12px', background: 'none', border: 'none', 
              borderBottom: tab === 'customer' ? '2px solid var(--red-core)' : '2px solid transparent',
              color: tab === 'customer' ? 'var(--red-core)' : 'var(--text-muted)',
              fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-2px'
            }}
          >
            CUSTOMER LOGIN
          </button>
          <button 
            onClick={() => { setTab('vendor'); setError(''); setCode(''); setPassword(''); }}
            style={{ 
              flex: 1, padding: '12px', background: 'none', border: 'none', 
              borderBottom: tab === 'vendor' ? '2px solid var(--red-core)' : '2px solid transparent',
              color: tab === 'vendor' ? 'var(--red-core)' : 'var(--text-muted)',
              fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-2px'
            }}
          >
            VENDOR LOGIN
          </button>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '30px' }}>
          {tab === 'customer' ? 'Secure access to your orders, shipments, and documents.' : 'Secure access for Aadishakti supply partners.'}
        </p>

        {error && (
          <div style={{ background: 'var(--red-subtle)', color: 'var(--red-core)', padding: '12px', borderRadius: '4px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="float-form-group">
            <input
              type="text"
              required
              placeholder=" "
              className="float-form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <label className="float-form-label">{tab === 'customer' ? 'Customer ID / Email' : 'Vendor Code / Email'}</label>
          </div>

          <div className="float-form-group">
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder=" "
                className="float-form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <label className="float-form-label" style={{ marginTop: '8px' }}>Password</label>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: 'var(--red-core)', color: '#fff', border: 'none', borderRadius: '2px', fontFamily: 'var(--font-primary)', fontWeight: '700', fontSize: '14px', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase', transition: 'background 0.3s' }}>
            Secure Login
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          {tab === 'vendor' && <p style={{ marginBottom: '10px' }}>New Vendor? <Link to="/register" style={{ color: 'var(--red-core)', fontWeight: '600', textDecoration: 'none' }}>Register Here</Link></p>}
          <p>Protected by EisenVault 256-bit encryption.</p>
        </div>
      </div>
    </div>
  );
}
