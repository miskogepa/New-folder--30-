const API_BASE_URL = "http://localhost:5000/api";

// Helper funkcija za kreiranje headers-a sa tokenom
const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

// Helper funkcija za API pozive
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Autentikacija
export const authAPI = {
  register: async (userData) => {
    return apiCall("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};

// EDC predmeti
export const edcItemsAPI = {
  // Dohvati sve predmete korisnika
  getItems: async (token) => {
    return apiCall("/items", {
      headers: getAuthHeaders(token),
    });
  },

  // Dodaj novi predmet
  addItem: async (itemData, token) => {
    return apiCall("/items", {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
    });
  },

  // Ažuriraj predmet
  updateItem: async (itemId, itemData, token) => {
    return apiCall(`/items/${itemId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
    });
  },

  // Obriši predmet
  deleteItem: async (itemId, token) => {
    return apiCall(`/items/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
  },
};

// Rančevi
export const backpacksAPI = {
  // Dohvati sve rančeve korisnika
  getBackpacks: async (token) => {
    return apiCall("/backpacks", {
      headers: getAuthHeaders(token),
    });
  },

  // Kreiraj novi ranac
  createBackpack: async (backpackData, token) => {
    return apiCall("/backpacks", {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(backpackData),
    });
  },

  // Ažuriraj ranac
  updateBackpack: async (backpackId, backpackData, token) => {
    return apiCall(`/backpacks/${backpackId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(backpackData),
    });
  },

  // Obriši ranac
  deleteBackpack: async (backpackId, token) => {
    return apiCall(`/backpacks/${backpackId}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
  },
};

// Praćenje korišćenja predmeta
export const itemUsageAPI = {
  // Dohvati korišćenje predmeta
  getItemUsage: async (backpackId, token) => {
    return apiCall(`/item-usage?backpackId=${backpackId}`, {
      headers: getAuthHeaders(token),
    });
  },

  // Dodaj/azuriraj korišćenje predmeta
  updateItemUsage: async (usageData, token) => {
    return apiCall("/item-usage", {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(usageData),
    });
  },
};

// Zdravlje
export const healthAPI = {
  // Dohvati health log za dan
  getHealthLog: async (date, token) => {
    return apiCall(`/health?date=${date}`, {
      headers: getAuthHeaders(token),
    });
  },

  // Dodaj/azuriraj health log
  updateHealthLog: async (healthData, token) => {
    return apiCall("/health", {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(healthData),
    });
  },
};

// Health Items (konfiguracija)
export const healthItemsAPI = {
  // Dohvati sve health item-e korisnika
  getHealthItems: async (token) => {
    return apiCall("/health-items", {
      headers: getAuthHeaders(token),
    });
  },

  // Kreiraj novi health item
  createHealthItem: async (itemData, token) => {
    return apiCall("/health-items", {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
    });
  },

  // Ažuriraj health item
  updateHealthItem: async (itemId, itemData, token) => {
    return apiCall(`/health-items/${itemId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
    });
  },

  // Obriši health item
  deleteHealthItem: async (itemId, token) => {
    return apiCall(`/health-items/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
  },

  // Ažuriraj redosled health item-a
  updateHealthItemOrder: async (items, token) => {
    return apiCall("/health-items/order/update", {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ items }),
    });
  },
};
