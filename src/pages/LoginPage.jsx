import { sanitizeInput } from '../utils/sanitize.js';
import styles from './LoginPage.module.css';
import { useState, useEffect } from 'react';
import {useNavigate, useLocation} from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const from = location.state?.from?.pathname || '/todos';

    useEffect(() => {
      if (isAuthenticated) {
        navigate(from, { replace: true });
      }
    }, [isAuthenticated, navigate, from]);
    
    const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');
    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);
    const result = await login(cleanEmail, cleanPassword);

    if (!result.success) {
      setAuthError('Login failed, invalid email or password.');
    }

    setIsLoggingOn(false);
  };


  return (
  <div className={styles.container}>
    <h1 className={styles.title}>Log In</h1>
    <form 
    onSubmit={handleSubmit}
    className={styles.form}> 
      {authError && <p>{authError}</p>}

      <label htmlFor='email' className={styles.label}>Email:</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(sanitizeInput(e.target.value))}
          autoComplete='username'
          required
          className={styles.input}
        />

      <label htmlFor='password' className={styles.label}>Password:</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(sanitizeInput(e.target.value))}
          autoComplete='current-password'
          required
          className={styles.input}
        />

      <button type="submit" disabled={isLoggingOn} className={styles.button}>
        {isLoggingOn ?  <div className={styles.spinner}></div> : "Log On"}
      </button>
    </form>
    </div>
  );
}

export default LoginPage;