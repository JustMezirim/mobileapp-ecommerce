export const getStatusColor = (status: string) => {
  switch (status) {
    case 'placed': return '#6C5CE7';
    case 'pending': return '#FF9500';
    case 'processing': return '#ffc107';
    case 'shipped': return '#007AFF';
    case 'in_transit': return '#00B894';
    case 'delivered': return '#28a745';
    case 'cancelled': return '#dc3545';
    default: return '#666';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'placed': return 'checkmark-circle';
    case 'pending': return 'time';
    case 'processing': return 'sync';
    case 'shipped': return 'airplane';
    case 'in_transit': return 'car';
    case 'delivered': return 'checkmark-done-circle';
    case 'cancelled': return 'close-circle';
    default: return 'ellipse';
  }
};

export const getStatusLabel = (status: string) => {
  if (!status) return 'Unknown';
  if (status === 'in_transit') return 'In Transit';
  return status.charAt(0).toUpperCase() + status.slice(1);
};
