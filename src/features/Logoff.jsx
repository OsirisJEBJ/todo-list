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
      navigate('/login');  // Add this navigation
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <div>
      {error && <p>{error}</p>}

      <button onClick={handleLogoff}>
        Logoff
      </button>
    </div>
  );
}

export default Logoff;
