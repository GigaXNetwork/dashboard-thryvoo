import Cookies from "js-cookie"
const BASE_URL = import.meta.env.VITE_API_URL

export function getAuthToken() {
  const token = localStorage.getItem("authToken");
  return token || Cookies.get("authToken") || null
}

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (e.g. "/blog/upload")
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object|FormData} [data] - Request body (for POST/PUT)
 * @param {object} [headers] - Additional headers
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function apiRequest(endpoint, method = "GET", data = null, headers = {}) {
  try {
    const token = getAuthToken();

    // Check if data is FormData (for file uploads)
    const isFormData = data instanceof FormData;

    const options = {
      method,
      headers: {
        // Don't set Content-Type for FormData - let the browser set it with boundary
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { 'Authorization': `${token}` } : {}),
        ...headers,
      },
      credentials: "include",
    };

    if (data) {
      // For FormData, use the data directly
      // For JSON, stringify it
      options.body = isFormData ? data : JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}`);
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return { status: 'success' }; // Return a success object for empty responses
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export const Api = {
  getBlogs: () => apiRequest("/blog", "GET"),
  uploadBlog: (blogData) => apiRequest("/blog/upload", "POST", blogData),
  getUser: () => apiRequest("/user", "GET"),

  //leads
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
  importCustomersExcel: (formData) => apiRequest("/api/lead/import-from-excel", "POST", formData),
  sendWhatsAppMessage : (leadId, messageData) => apiRequest(`/api/lead/${leadId}/send-whatsapp`, "POST", messageData),

  //categories
  getCategories: (userId, page = 1, limit = 10, search = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (search && search.trim()) {
      queryParams.append('search', search.trim());
    }

    return apiRequest(`/api/admin/banner/${userId}/categories?${queryParams.toString()}`, "GET");
  },
  createCategory: (userId, categoryData) => apiRequest(`/api/admin/banner/${userId}/create-category`, "POST", categoryData),
  updateCategory: (id, categoryData) => apiRequest(`/api/admin/banner/category/${id}/editname`, "PATCH", categoryData),

  // category-items
  getCategoryItems: (userId, categoryId) =>
    apiRequest(`/api/user/banner/${userId}/category/${categoryId}`, "GET"),

  addItemToCategory: (userId, categoryId, itemData) =>
    apiRequest(`/api/admin/banner/${userId}/category/${categoryId}/upload`, "POST", itemData),

  deleteItemFromCategory: (userId, categoryId, itemId) =>
    apiRequest(`/api/admin/banner/${userId}/category/${categoryId}/upload/${itemId}`, "DELETE"),

  // Support/Help
  createHelpItem: (helpData) => apiRequest("/api/help", "POST", helpData),
  getHelpItems: (page = 1, limit = 10, search = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })

    if (search && search.trim()) {
      queryParams.append('search', search.trim());
    }

    return apiRequest(`/api/help?${queryParams.toString()}`, "GET");
  },
  getHelpItem: (id) => apiRequest(`/api/help/${id}`, "GET"),
  updateHelpItem: (id, helpData) => apiRequest(`/api/help/${id}`, "PATCH", helpData),
  deleteHelpItem: (id) => apiRequest(`/api/help/${id}`, "DELETE"),

  // FAQ APIs (new)
  addFAQ: (categoryId, faqData) =>
    apiRequest(`/api/help/${categoryId}/faqs`, "POST", faqData),

  updateFAQ: (categoryId, faqId, faqData) =>
    apiRequest(`/api/help/${categoryId}/faqs/${faqId}`, "PATCH", faqData),

  deleteFAQ: (categoryId, faqId) =>
    apiRequest(`/api/help/${categoryId}/faqs/${faqId}`, "DELETE"),

  getHelpBySlug: (slug) =>
    apiRequest(`/api/help/slug/${slug}`, "GET"),

  // Special Offer
  getMySpecialOffers: () => apiRequest("/api/special-offer/my-special-offers", "GET"),
  createSpecialOffer: () => apiRequest("/api/special-offer/create-special-offer", "POST"),
  addSpecialOfferItem: (itemId) => apiRequest("/api/special-offer/add-items", "POST", { itemId }),
  removeSpecialOfferItem: (itemId) => apiRequest("/api/special-offer/remove-items", "POST", { itemId }),
  toggleSpecialOffer: (id) => apiRequest(`/api/special-offer/${id}/toggle`, "POST"),
  getAllSpecialOffers: () => apiRequest("/api/card/special-offer", "GET"),
  // delete gallery api
  deleteGalleryImage: ({ imageUrl }) => {
   return apiRequest(`/api/user/card/gallery/delete-gallery-image`, "DELETE", { imageUrl })
  },
  deleteBrochure: ({ brochureUrl }) => {
    return apiRequest(`/api/user/card/brochures/delete-brochure-file`, "DELETE", { fileUrl:brochureUrl })
   }
};