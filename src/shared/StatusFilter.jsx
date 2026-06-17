import styles from "./StatusFilter.module.css"
import { useSearchParams } from 'react-router';

function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const handleStatusChange = (status) => {
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.container}>
      <div className={styles.group}>
      <label htmlFor='statusFilter' className={styles.label}>Show:</label>
      <select
        id='statusFilter'
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={styles.select}
      >
        <option value='all'>All Todos</option>
        <option value='active'>Active Todos</option>
        <option value='completed'>Completed Todos</option>
      </select>
    </div>
    </div>
  );
}

export default StatusFilter;