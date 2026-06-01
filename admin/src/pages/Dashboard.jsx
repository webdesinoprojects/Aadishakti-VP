import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, FileText, Newspaper, Briefcase, Plus, Image, Package } from 'lucide-react';
import TopBar from '../components/TopBar';
import { crmAPI } from '../utils/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    enquiries: 0,
    applications: 0,
    news: 0,
    jobs: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [enquiriesRes, applicationsRes] = await Promise.all([
        crmAPI.getEnquiries({}),
        crmAPI.getApplications({}),
      ]);

      setStats({
        enquiries: enquiriesRes.data.length,
        applications: applicationsRes.data.length,
        news: 0, // Will be updated when news API is called
        jobs: 0, // Will be updated when careers API is called
      });

      setRecentEnquiries(enquiriesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadge = (status) => {
    const classes = {
      New: 'badge-new',
      'In Progress': 'badge-draft',
      Replied: 'badge-active',
      Archived: 'badge-archived',
    };
    return <span className={`badge ${classes[status] || 'badge-new'}`}>{status}</span>;
  };

  return (
    <>
      <TopBar breadcrumb="Dashboard" />
      <div className="admin-content">
        {/* Greeting */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
            {getGreeting()}, Admin 👋
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          <KPICard
            icon={<Mail size={32} />}
            iconColor="var(--admin-red)"
            label="Total Enquiries"
            value={stats.enquiries}
            trend={`${stats.enquiries > 0 ? stats.enquiries : 0} total`}
          />
          <KPICard
            icon={<FileText size={32} />}
            iconColor="var(--admin-blue)"
            label="Job Applications"
            value={stats.applications}
            trend={`${stats.applications > 0 ? stats.applications : 0} total`}
          />
          <KPICard
            icon={<Newspaper size={32} />}
            iconColor="var(--admin-amber)"
            label="Active Announcements"
            value={stats.news}
            trend="Published"
          />
          <KPICard
            icon={<Briefcase size={32} />}
            iconColor="var(--admin-green)"
            label="Open Positions"
            value={stats.jobs}
            trend="Active jobs"
          />
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
          {/* Recent Enquiries */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Enquiries</h2>
              <p className="card-subtitle">Latest customer inquiries</p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                Loading...
              </div>
            ) : recentEnquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Mail size={48} style={{ color: 'var(--admin-text-light)', marginBottom: '16px' }} />
                <p style={{ color: 'var(--admin-text-muted)' }}>
                  No enquiries yet. When customers submit the contact form, they'll appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEnquiries.map((enq) => (
                        <tr key={enq.id}>
                          <td>{enq.fullName}</td>
                          <td>{enq.companyName}</td>
                          <td>{enq.inquiryType}</td>
                          <td className="text-mono">{format(new Date(enq.submittedAt), 'MMM d')}</td>
                          <td>{getStatusBadge(enq.status || 'New')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Link to="/crm/enquiries" className="btn btn-secondary">
                    View All Enquiries →
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
              <p className="card-subtitle">Common tasks</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/cms/news" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Plus size={16} /> Add Announcement
              </Link>
              <Link to="/cms/products" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Package size={16} /> Update Product Spec
              </Link>
              <Link to="/cms/gallery" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Image size={16} /> Upload Gallery Photos
              </Link>
              <Link to="/cms/careers" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Briefcase size={16} /> Post a New Job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const KPICard = ({ icon, iconColor, label, value, trend }) => (
  <div className="card" style={{ padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div style={{ color: iconColor }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          color: 'var(--admin-text-muted)', 
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '8px'
        }}>
          {label}
        </div>
        <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-primary)', marginBottom: '4px' }}>
          {value.toLocaleString()}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--admin-green)' }}>
          {trend}
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
