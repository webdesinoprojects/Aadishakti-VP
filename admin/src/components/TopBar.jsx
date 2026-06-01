import { ExternalLink } from 'lucide-react';

const TopBar = ({ breadcrumb }) => {
  return (
    <div className="admin-topbar">
      <div className="breadcrumb">
        CMS Admin
        {breadcrumb && (
          <>
            <span className="breadcrumb-separator">/</span>
            {breadcrumb}
          </>
        )}
      </div>

      <div className="topbar-actions">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="view-website-link"
        >
          View Website <ExternalLink size={14} style={{ display: 'inline', marginLeft: 4 }} />
        </a>
      </div>
    </div>
  );
};

export default TopBar;
