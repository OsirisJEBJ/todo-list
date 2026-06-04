import{ createContext, useState } from 'react';
export function AuthProvider({ children }) {
  // State for authentication
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  
  // Functions will go here...
  
  // Context value object
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  const AuthContext = createContext();

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
  } catch (error) {
    return {
      success: false,
      error: 'Network error during login',
    };
  }
};

  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}