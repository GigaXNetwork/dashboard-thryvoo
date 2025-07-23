import { createContext, useContext, useEffect, useState } from 'react';
const UserContext = createContext();
import Cookies from "js-cookie";

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
     const accountToken = Cookies.get("accountToken");
    try {
      // 1. First check authentication
      const authResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/isAuthenticated`, {
        method: 'GET',
        credentials: 'include',
        headers:{
          Authorization: `${accountToken}`
        }
      });

      if (!authResponse.ok) {
        throw new Error(`Authentication check failed: ${authResponse.status}`);
      }

      const authData = await authResponse.json();
      setUserData(authData);

      // 2. Only fetch address if authentication was successful
      if (authData.status === 'success' && authData.isAuthenticated) {
        const addressResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getaddress`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!addressResponse.ok) {
          throw new Error(`Address fetch failed: ${addressResponse.status}`);
        }

        const addressData = await addressResponse.json();
        
        // Update user data with address information
       setUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          address: addressData.data
        },
      }));
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

console.log(userData);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy usage
export const useUser = () => useContext(UserContext);
