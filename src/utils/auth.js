// utils/auth.js
export function getTokenFromURLAndStore() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token && token.startsWith('gigax')) {
      localStorage.setItem('accountToken', token);
      // Optionally, clean the URL
      window.history.replaceState({}, document.title, '/');
    }
  }
  