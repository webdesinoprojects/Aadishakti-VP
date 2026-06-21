import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import { Search, MapPin, Package, Truck, CheckCircle2, Box } from 'lucide-react';
import { format } from 'date-fns';

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`http://localhost:5000/api/track/${idToFetch}`);
      if (!res.ok) throw new Error('Order not found or invalid Tracking ID.');
      const data = await res.json();
      setOrder(data);
      setSearchParams({ id: idToFetch });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId && !order) {
      fetchTracking(initialId);
    }
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(orderId);
  };

  const getStageIcon = (stageName) => {
    switch (stageName) {
      case 'Order Confirmed': return <CheckCircle2 size={24} />;
      case 'Packed': return <Box size={24} />;
      case 'Shipment Started': return <Truck size={24} />;
      case 'Reached Customer': return <MapPin size={24} />;
      default: return <Package size={24} />;
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: 'calc(100vh - 300px)', background: '#fafafa' }}>
        <div className="container">
          
          {/* Header */}
          <ScrollReveal>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px' }}>
              <h1 className="section-title">Track Your Order</h1>
              <p className="section-subtitle">Enter your Order ID below to view the real-time logistics and shipment progress of your custom quote or product.</p>
              
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-10025"
                    required
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      borderRadius: '30px',
                      border: '1px solid #ddd',
                      fontSize: '16px',
                      outline: 'none',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '30px', padding: '0 30px' }} disabled={loading}>
                  {loading ? 'Tracking...' : 'Track'}
                </button>
              </form>
              {error && <p style={{ color: 'var(--red-core)', marginTop: '15px', fontWeight: '500' }}>{error}</p>}
            </div>
          </ScrollReveal>

          {/* Tracking Result */}
          {order && (
            <ScrollReveal delay={0.2}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto 80px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '5px' }}>{order.id}</h2>
                    <p style={{ color: '#666', fontSize: '15px' }}>{order.product}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '5px' }}>Current Status</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--red-core)' }}>{order.status === 'Reached Customer' && order.podStatus === 'Accepted' ? 'Delivered' : order.status}</div>
                  </div>
                </div>

                {/* E-commerce Pipeline Stepper */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: '60px', marginBottom: '40px' }}>
                  
                  {/* Background Progress Bar */}
                  <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '4px', background: '#f0f0f0', zIndex: 1 }}></div>
                  
                  {/* Active Progress Bar */}
                  <div style={{ 
                    position: 'absolute', top: '24px', left: '0', height: '4px', background: 'var(--red-core)', zIndex: 2, transition: 'width 1s ease',
                    width: `${((order.tracking.findIndex(t => !t.completed) === -1 ? order.tracking.length : order.tracking.findIndex(t => !t.completed) - 1) / (order.tracking.length - 1)) * 100}%`
                  }}></div>

                  {order.tracking.map((stage, i) => {
                    const isDelivered = stage.stage === 'Reached Customer' && order.podStatus === 'Accepted';
                    const isCompleted = stage.completed && (stage.stage !== 'Reached Customer' || order.podStatus === 'Accepted');
                    const isActive = !isCompleted && i === order.tracking.findIndex(t => !t.completed);

                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 3, width: '120px' }}>
                        <div style={{ 
                          width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isCompleted ? 'var(--red-core)' : isActive ? '#fff' : '#fff',
                          border: isCompleted ? 'none' : isActive ? '3px solid var(--red-core)' : '3px solid #ddd',
                          color: isCompleted ? '#fff' : isActive ? 'var(--red-core)' : '#ddd',
                          boxShadow: isCompleted ? '0 4px 15px rgba(204, 34, 0, 0.3)' : 'none',
                          transition: 'all 0.5s ease',
                          marginBottom: '15px'
                        }}>
                          {getStageIcon(stage.stage)}
                        </div>
                        <div style={{ fontWeight: isCompleted || isActive ? 700 : 500, color: isCompleted || isActive ? '#111' : '#999', fontSize: '14px', textAlign: 'center', marginBottom: '5px' }}>
                          {isDelivered ? 'Delivered' : stage.stage}
                        </div>
                        <div style={{ fontSize: '11px', color: '#888', textAlign: 'center' }}>
                          {stage.timestamp ? format(new Date(stage.timestamp), 'MMM d, h:mm a') : 'Pending'}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ background: '#fafafa', padding: '20px', borderRadius: '8px', fontSize: '14px', color: '#555', border: '1px solid #eee' }}>
                  <strong>Note:</strong> We are preparing your order carefully. Proof of logistics, weight scales, and delivery images are securely verified internally by our operations team before marking stages complete.
                </div>

              </div>
            </ScrollReveal>
          )}
          
        </div>
      </div>
      <Footer />
    </>
  );
}
