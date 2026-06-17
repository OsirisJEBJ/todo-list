import styles from "./Logoff.module.css";
import { useAuth } from  '../contexts/AuthContext.jsx';
import { useState } from 'react';
import {useNavigate} from 'react-router';

function Logoff() {
  const [isLoggingOff, setIsLoggingOff] = useState(false);  
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

   if (result.success) {
      navigate('/login'); 
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <button
       className={styles.button}
       onClick={handleLogoff}>
        Logout
      </button>
    </div>
  );
}

export default Logoff;
