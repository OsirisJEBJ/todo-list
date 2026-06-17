import styles from "./HomePage.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";
function HomePage() {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.container}>
      <p className={styles.text}>Redirecting...</p>
      <div className={styles.spinner}></div>
    </div>
  );
}
export default HomePage;