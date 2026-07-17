import { useState } from 'react';
import { Link } from 'react-router-dom';
import DragDropUpload from '../../components/DragDropUpload';

export default function VendorRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    gstNumber: '',
    panNumber: '',
    category: '',
    msmeDoc: null,
    bankDoc: null,
    qualityDoc: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    setFormData(prev => ({ ...prev, [name]: file }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const submitApplication = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const getStepStyle = (targetStep) => {
    if (step >= targetStep) {
      return { bg: 'var(--red-core)', text: '#fff', border: 'var(--red-core)' };
    }
    return { bg: '#fff', text: 'var(--text-muted)', border: 'var(--border-light)' };
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="corporate-card reveal-item reveal-visible" style={{ maxWidth: '650px', width: '100%', padding: '40px', background: '#fff' }}>
        
        {step < 3 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getStepStyle(1).bg, color: getStepStyle(1).text, border: `2px solid ${getStepStyle(1).border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s' }}>1</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: step >= 1 ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>Basic Details</span>
            </div>
            <div style={{ height: '2px', width: '50px', background: step >= 2 ? 'var(--red-core)' : 'var(--border-light)', marginTop: '-20px', transition: 'all 0.3s' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getStepStyle(2).bg, color: getStepStyle(2).text, border: `2px solid ${getStepStyle(2).border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s' }}>2</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: step >= 2 ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>Documents</span>
            </div>
            <div style={{ height: '2px', width: '50px', background: step >= 3 ? 'var(--red-core)' : 'var(--border-light)', marginTop: '-20px', transition: 'all 0.3s' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getStepStyle(3).bg, color: getStepStyle(3).text, border: `2px solid ${getStepStyle(3).border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s' }}>3</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: step >= 3 ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>Submit</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={nextStep}>
            <h2 style={{ fontFamily: 'var(--font-primary)', fontWeight: '800', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Register as Vendor
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '30px' }}>
              Digitize your onboarding and standardize approval controls. Please provide your business entity details below.
            </p>

            <div className="float-form-group">
              <input type="text" name="companyName" required placeholder=" " className="float-form-control" value={formData.companyName} onChange={handleInputChange} />
              <label className="float-form-label">Company Name *</label>
            </div>

            <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div className="float-form-group" style={{ marginBottom: 0 }}>
                <input type="text" name="gstNumber" required placeholder=" " className="float-form-control" value={formData.gstNumber} onChange={handleInputChange} />
                <label className="float-form-label">GST Number *</label>
              </div>
              <div className="float-form-group" style={{ marginBottom: 0 }}>
                <input type="text" name="panNumber" required placeholder=" " className="float-form-control" value={formData.panNumber} onChange={handleInputChange} />
                <label className="float-form-label">PAN Number *</label>
              </div>
            </div>

            <div className="float-form-group">
              <select name="category" required className="float-form-control" value={formData.category} onChange={handleInputChange} style={{ color: formData.category ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <option value="" disabled>Select Category</option>
                <option value="scrap_dealer">Scrap Dealer</option>
                <option value="corporate">Corporate</option>
                <option value="recycler">Recycler</option>
                <option value="trader">Trader</option>
              </select>
              <label className="float-form-label" style={{ top: '-10px', fontSize: '11px', color: 'var(--red-core)' }}>Vendor Category *</label>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <Link to="/login" style={{ padding: '14px', flex: 1, textAlign: 'center', border: '1px solid var(--border-light)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600', fontSize: '13px', borderRadius: '4px' }}>Cancel</Link>
              <button type="submit" style={{ padding: '14px', flex: 1, background: 'var(--red-core)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '14px', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase', borderRadius: '4px' }}>Next Step</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitApplication}>
            <h2 style={{ fontFamily: 'var(--font-primary)', fontWeight: '800', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Upload Documents
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '30px' }}>
              Securely upload your compliance and banking documents for commercial review.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
              <DragDropUpload
                id="msme-upload"
                label="MSME Certificate"
                file={formData.msmeDoc}
                setFile={(file) => handleFileChange("msmeDoc", file)}
              />
              <DragDropUpload
                id="bank-upload"
                label="Bank Details Proof"
                file={formData.bankDoc}
                setFile={(file) => handleFileChange("bankDoc", file)}
              />
              <DragDropUpload
                id="quality-upload"
                label="Quality Certificate"
                file={formData.qualityDoc}
                setFile={(file) => handleFileChange("qualityDoc", file)}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding: '14px', flex: 1, textAlign: 'center', background: 'none', border: '1px solid var(--border-light)', color: 'var(--text-primary)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' }}>Back</button>
              <button type="submit" style={{ padding: '14px', flex: 1, background: 'var(--red-core)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '14px', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase', borderRadius: '4px' }}>Submit Application</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--red-subtle)', color: 'var(--red-core)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-primary)', fontWeight: '800', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '15px' }}>
              Application Submitted
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              Your vendor registration application has been successfully submitted and is now under <strong>Commercial and Technical Evaluation</strong>.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '30px' }}>
              Once approved by our Maker-Checker process, you will receive an email containing your unique Vendor Code and portal access link.
            </p>
            <Link to="/" style={{ display: 'inline-block', padding: '12px 24px', border: '1px solid var(--border-light)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '4px' }}>
              Return Home
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
