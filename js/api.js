const BASE_URL = "http://localhost:3000";

export const api = {
  async createUser(data) {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Http response: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUsers() {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`Http response: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Network Error: ${error.message}`);
      throw error;
    }
  },

  async updateUser(id, data) {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP response: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP response: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
