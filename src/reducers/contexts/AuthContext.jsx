import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // State for authentication
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  
  // Functions will go here...
  

  const login = async (email, password) => {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password }),
      credentials: 'include',
    };
    
    const res = await fetch('/api/users/logon', options);
    const data = await res.json();
    
    if (res.status === 200 && data.name && data.csrfToken) {
      // Success: Update state
      setEmail(data.name);
      setToken(data.csrfToken);
      return { success: true };
    } else {
      // Failure: Return error
      return {
        success: false,
        error: `Authentication failed: ${data?.message}`,
      };
    }
  } catch {
    return {
      success: false,
      error: 'Network error during login',
    };
  }
};

// Logout function to clear authentication state
  
 const logout = async () => {
    if (!token) {
      setEmail('');
      setToken('');
      return { success: true };
    }

    try {
      const response = await fetch('/user/logoff', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': token },
        credentials: 'include'
      });

      setEmail('');
      setToken('');

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

    // Context value object
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


// Custom hook with error checking
export function useAuth() {
    return useContext(AuthContext);
}
