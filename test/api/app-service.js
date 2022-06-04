import axios from "axios";

export const appService = {
  appURL: "http://localhost:4000",

  async createUser(user) {
    const res = await axios.post(`${this.appURL}/rest-api/users`, user);
    return res.data;
  },
  async getUser(id) {
    const res = await axios.get(`${this.appURL}/rest-api/users/${id}`);
    return res.data;
  },
  async getAllUsers() {
    const res = await axios.get(`${this.appURL}/rest-api/users`);
    return res.data;
  },
  async deleteUser(id) {
    const res = await axios.delete(`${this.appURL}/rest-api/users/${id}`);
    return res.data;
  },
  async deleteAllUsers() {
    const res = await axios.delete(`${this.appURL}/rest-api/users`);
    return res.data;
  },
  async updateUser(id, newValues) {
    const res = await axios.put(`${this.appURL}/rest-api/users/${id}`, newValues);
    return res.data;
  },

  async deleteAllPOIs() {
    const res = await axios.delete(`${this.appURL}/rest-api/poi`);
    return res.data;
  },
  async createPOI(poi) {
    const res = await axios.post(`${this.appURL}/rest-api/poi`, poi);
    return res.data;
  },
  async getAllPOIs() {
    const res = await axios.get(`${this.appURL}/rest-api/poi`);
    return res.data;
  },
  async getPOI(id) {
    const res = await axios.get(`${this.appURL}/rest-api/poi/${id}`);
    return res.data;
  },
  async deletePOI(id) {
    const res = await axios.delete(`${this.appURL}/rest-api/poi/${id}`);
    return res.data;
  },
  async updatePOI(id, newVars) {
    const res = await axios.put(`${this.appURL}/rest-api/poi/${id}`, newVars);
    return res.data;
  },

  async deleteAllCategories() {
    const res = await axios.delete(`${this.appURL}/rest-api/poi/categories`);
    return res.data;
  },
  async createCategory(poi) {
    const res = await axios.post(`${this.appURL}/rest-api/poi/categories`, poi);
    return res.data;
  },
  async getAllCategories() {
    const res = await axios.get(`${this.appURL}/rest-api/poi/categories`);
    return res.data;
  },
  async getCategory(id) {
    const res = await axios.get(`${this.appURL}/rest-api/poi/categories/${id}`);
    return res.data;
  },
  async deleteCategory(id) {
    const res = await axios.delete(`${this.appURL}/rest-api/poi/categories/${id}`);
    return res.data;
  },
  async updateCategory(id, newValues) {
    const res = await axios.put(`${this.appURL}/rest-api/poi/categories/${id}`, newValues);
    return res.data;
  },
};
