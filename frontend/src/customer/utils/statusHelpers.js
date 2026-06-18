export const getStatusClass = (status) => {
  switch(status?.toLowerCase()) {
    case 'delivered': return 'delivered';
    case 'in transit': return 'intransit';
    case 'confirmed': return 'confirmed';
    case 'order confirmed': return 'confirmed';
    case 'in production': return 'intransit'; // Using same color
    case 'dispatched': return 'intransit'; // Using same color
    case 'cancelled': return 'cancelled';
    default: return '';
  }
};
