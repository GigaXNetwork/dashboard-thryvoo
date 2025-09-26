import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from "js-cookie";

const CardContext = createContext();

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

export const CardProvider = ({ children, cardId, role }) => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cardId) return;
    let url;

    if (role === "admin") {
      url = `${import.meta.env.VITE_API_URL}/api/admin/card/${cardId}`
    }
    else {
      url = `${import.meta.env.VITE_API_URL}/api/user/card/${cardId}`
    }

    const fetchData = async () => {
      setLoading(true);
      const authToken = getAuthToken();
      if (!authToken) {
        setLoading(false);
        return;
      }
      setError(null);

      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCardData(data.data.card);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cardId]); // depend on cardId to re-fetch when it changes

  return (
    <CardContext.Provider value={{ cardData, setCardData, loading, error }}>
      {children}
    </CardContext.Provider>
  );
};

// Custom hook for easy context access
export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
};
