import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { apiRequest } from './apiService';


const UserContext = createContext();

export const getAuthToken = () => {
  const tokenNames = ['authToken'];
  for (const name of tokenNames) {
    const token = Cookies.get(name);
    if (token) {
      return token;
    }
  }
  return null;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = getAuthToken();

      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        const authData = await apiRequest(
          "/api/user/isAuthenticated",
          "GET",
          null,
          { 'Authorization': `${authToken}`, }
        )

        if (!authData.status === 'success') {
          throw new Error(`Authentication check failed: ${authData.status}`);
        }

        setUserData(authData);

        // 2. Only fetch address if authentication was successful
        if (authData.status === 'success' && authData.isAuthenticated) {
          // const addressResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getaddress`, {
          //   method: 'GET',
          //   credentials: 'include',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `${authToken}`,
          //   },
          // });

          const addressResponse = await apiRequest(
            "/api/user/getaddress",
            "GET",
            null,
            { 'Authorization': `${authToken}`, }
          );

          // if (!addressResponse.ok) {
          //   throw new Error(`Address fetch failed: ${addressResponse.status}`);
          // }

          // const addressData = await addressResponse.json();

          // Update user data with address information
          setUserData((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              address: addressResponse.data
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

  return (
    <UserContext.Provider value={{ userData, setUserData, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy usage
export const useUser = () => useContext(UserContext);