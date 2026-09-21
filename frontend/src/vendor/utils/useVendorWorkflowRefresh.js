import { useEffect } from 'react';
import { buildApiUrl } from '../../config/api';

export default function useVendorWorkflowRefresh(refresh) {
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) refresh();
    };
    const stream = new EventSource(buildApiUrl('/api/portal/vendor/workflows/events'), {
      withCredentials: true,
    });
    stream.addEventListener('workflow-updated', refresh);
    document.addEventListener('visibilitychange', onVisible);

    // The stream reconnects automatically; this also covers missed events or another API instance.
    const fallback = window.setInterval(onVisible, 30000);
    return () => {
      window.clearInterval(fallback);
      document.removeEventListener('visibilitychange', onVisible);
      stream.removeEventListener('workflow-updated', refresh);
      stream.close();
    };
  }, [refresh]);
}
