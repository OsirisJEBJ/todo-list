import { sanitizeInput } from "../utils/sanitize.js";
import styles from "./ProfilePage.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function ProfilePage() {
  const { token } = useAuth();

  const [stats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    percentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch("/api/tasks", options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        const todos = data.tasks || [];

        const total = todos.length;
        const completed = todos.filter(todo => todo.isCompleted).length;
        const active = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        setTodoStats({ total, completed, active, percentage });

      } catch {
        setError(`Error loading statistics at the moment.`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  if (loading) {
    return(
    <div className={styles.spinnerContainer}>
    <p>Loading profile...</p>
    <div className={styles.spinner}></div>
    </div>
    );
  }

  if (error) {
    return <p className={styles.error}>{sanitizeInput(error)}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Profile</h1>

      <p className={styles.text}>
        This page gives a quick overview of your task activity. As part of this guided
        project, building this section has helped me understand how to work with data,
        fetch information from an API, and display useful statistics in a clear way.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Task Summary</h2>
        <ul className={styles.list}>
          <li><strong>Total tasks:</strong>{sanitizeInput(stats.total.toString())}</li>
          <li><strong>Completed:</strong> {stats.completed}</li>
          <li><strong>Active:</strong> {stats.active}</li>
          <li><strong>Completion rate:</strong> {stats.percentage}%</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What This Page Represents</h2>
        <p  className={styles.text}>
          Creating this profile page has been a good way to practice working with API
          data and organizing information in a simple, readable format. It’s another
          step in understanding how different parts of a React application connect and
          how to make the user experience more meaningful.
        </p>
      </section>
    </div>
  );
}

export default ProfilePage;
