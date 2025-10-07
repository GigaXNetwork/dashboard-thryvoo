import Cookies from "js-cookie"
const BASE_URL = import.meta.env.VITE_API_URL

function getAuthToken() {
  const token = localStorage.getItem("authToken");
  return token || Cookies.get("authToken") || null
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
        ...(token ? { 'Authorization': `${token}` } : {}),
        ...headers,
      },
      credentials: "include",
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

  getLeads: (page = 1, limit = 10, search = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (search && search.trim()) {
      queryParams.append('search', search.trim());
    }
    return apiRequest(`/api/lead/my-leads?${queryParams.toString()}`, "GET");
  },
  createLead: (leadData) => apiRequest("/api/lead", "POST", leadData),
  updateLead: (id, leadData) => apiRequest(`/api/lead/${id}`, "PATCH", leadData),
  deleteLead: (id) => apiRequest(`/api/lead/${id}`, "DELETE"),
};