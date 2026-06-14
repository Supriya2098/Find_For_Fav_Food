const styles = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  UNPAID: 'bg-orange-100 text-orange-800',
  PAID: 'bg-green-100 text-green-800',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || 'bg-stone-100 text-stone-600'}`}>
      {status}
    </span>
  );
}
