import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <TopBar breadcrumb="Settings" />
      <div className="admin-content">
        <div className="card" style={{ maxWidth: 640 }}>
          <h1 className="card-title">Admin Settings</h1>
          <p className="card-subtitle" style={{ marginBottom: 16 }}>Logged in as {user?.username || 'Admin'}.</p>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  );
}
