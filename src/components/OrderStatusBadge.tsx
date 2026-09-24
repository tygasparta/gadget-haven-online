const styles: Record<string, string> = {
  completed: 'text-success border-success/30 bg-success/5',
  delivered: 'text-success border-success/30 bg-success/5',
  paid: 'text-success border-success/30 bg-success/5',
  shipped: 'text-primary border-primary/30 bg-primary/5',
  in_transit: 'text-primary border-primary/30 bg-primary/5',
  cancelled: 'text-destructive border-destructive/30 bg-destructive/5',
  failed: 'text-destructive border-destructive/30 bg-destructive/5',
};

const OrderStatusBadge = ({ status }: { status?: string | null }) => {
  const s = status || 'pending';
  return (
    <span className={`inline-flex items-center h-6 px-2 rounded-sm border text-[11px] font-medium capitalize whitespace-nowrap ${styles[s] || 'text-warning border-warning/30 bg-warning/5'}`}>
      {s.replace(/_/g, ' ')}
    </span>
  );
};

export default OrderStatusBadge;
