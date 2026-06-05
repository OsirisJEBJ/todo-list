import { useAuth } from  '../contexts/AuthContext.jsx';
import { useState } from 'react';

function Logoff() {
  const { logout } = useAuth();
  const [error, setError] = useState('');

  async function handleLogout() {
    setError('');

    const result = await logout();

    if (!result.success) {
      setError(result.message || 'Logout failed');
    }
  }

  return (
    <div>
      {error && <p>{error}</p>}

      <button onClick={handleLogout}>
        Logoff
      </button>
    </div>
  );
}

export default Logoff;
