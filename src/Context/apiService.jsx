const BASE_URL = import.meta.env.VITE_API_URL

function getAuthToken() {
  // If stored in localStorage
  return localStorage.getItem("authToken");

  // If using cookies instead, use a cookie parser like js-cookie:
  // return Cookies.get("authToken");
}

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (e.g. "/blog/upload")
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} [data] - Request body (for POST/PUT)
 * @param {object} [headers] - Additional headers
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function apiRequest(endpoint, method = "GET", data = null, headers = {}) {
  try {
    const token = getAuthToken();

    const options = {
      method,
      headers: {    
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...headers,
      },
      credentials: "include", // include cookies if backend uses them
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

/**
 * Example helper functions
 */
export const Api = {
  getBlogs: () => apiRequest("/blog", "GET"),
  uploadBlog: (blogData) => apiRequest("/blog/upload", "POST", blogData),
  getUser: () => apiRequest("/user", "GET"),
};