import styles from "./NotFoundPage.module.css";
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 – Page Not Found</h1>

      <p className={styles.text}>
        The page you’re looking for doesn’t exist or may have been moved.
        You can use the links below to get back to the main parts of the app.
      </p>

      <ul className={styles.list}>
        <li>
          <Link to="/login">Go to Login</Link>
        </li>
        <li>
          <Link to="/todos">View Your Todos</Link>
        </li>
        <li>
          <Link to="/about">About This App</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </div>
  );
}

export default NotFoundPage;
