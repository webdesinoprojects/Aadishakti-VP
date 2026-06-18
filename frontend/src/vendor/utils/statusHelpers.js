export const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'received':
    case 'paid':
    case 'open':
    case 'accepted':
    case 'quality cleared':
    case 'valid':
      return 'status-confirmed';
    case 'partially received':
    case 'under review':
    case 'expiring soon':
      return 'status-partial';
    case 'completed':
    case 'awarded':
      return 'status-completed';
    case 'pending':
    case 'submitted':
    case 'under inspection':
      return 'status-pending';
    case 'closed':
    case 'overdue':
    case 'rejected':
    case 'expired':
      return 'status-cancelled';
    default:
      return '';
  }
};
