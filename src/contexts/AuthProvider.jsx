import { useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const login = async (userEmail, password) => {
    try {
      const options =  {
        method: 'POST',

        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email : userEmail, password }),
      };

      const res = await fetch('/api/users/logon', options);
      const data = await res.json();


      if (res.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
      }else {

      return {
        success: false, 
        error:`Authentication failed: ${data?.message}`,
      };
    }
  }
     catch(error) {
      return {
         success: false,
         error: 'Network error during login', 
      };
    }
  };

  const logout = async () => {
    if (!token) {
      setEmail('');
      setToken('');
      return { success: true };
    }

    try {
      const res = await fetch('/user/logoff', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': token },
        credentials: 'include'
      });

      setEmail('');
      setToken('');

      if (!res.ok) throw new Error('Logout failed');

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

 const value = {
  email,           // Current user's email
  token,           // CSRF token for API requests
  isAuthenticated: !!token,  // Computed boolean for auth status
  login,           // Function to authenticate user
  logout,          // Function to clear authentication
};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
