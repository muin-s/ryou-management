import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Resolved';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getVariantClasses = () => {
    switch (status) {
      case 'Pending':
        return 'bg-status-pending text-primary-foreground hover:bg-status-pending/90';
      case 'In Progress':
        return 'bg-status-in-progress text-primary-foreground hover:bg-status-in-progress/90';
      case 'Completed':
        return 'bg-status-completed text-primary-foreground hover:bg-status-completed/90';
      case 'Resolved':
        return 'bg-status-completed text-primary-foreground hover:bg-status-completed/90';
      case 'Cancelled':
        return 'bg-status-cancelled text-primary-foreground hover:bg-status-cancelled/90';
      default:
        return '';
    }
  };

  return (
    <Badge className={getVariantClasses()}>
      {status}
    </Badge>
  );
};
