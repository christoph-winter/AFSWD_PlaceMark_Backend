import { userApi } from "./api/user-api.js";
import { poiApi } from "./api/poi-api.js";
import { poiCategoryApi } from "./api/poi-category-api.js";

export const apiRoute = [
  { method: "GET", path: "/rest-api/users", config: userApi.find },
  { method: "POST", path: "/rest-api/users", config: userApi.create },
  { method: "DELETE", path: "/rest-api/users", config: userApi.deleteAll },
  { method: "GET", path: "/rest-api/users/{id}", config: userApi.findOne },
  { method: "DELETE", path: "/rest-api/users/{id}", config: userApi.deleteOne },
  { method: "PUT", path: "/rest-api/users/{id}", config: userApi.updateOne },
  { method: "POST", path: "/rest-api/users/authenticate", config: userApi.authenticate },

  { method: "GET", path: "/rest-api/poi", config: poiApi.find },
  { method: "POST", path: "/rest-api/poi", config: poiApi.create },
  { method: "DELETE", path: "/rest-api/poi", config: poiApi.deleteAll },
  { method: "GET", path: "/rest-api/poi/{id}", config: poiApi.findOne },
  { method: "DELETE", path: "/rest-api/poi/{id}", config: poiApi.deleteOne },
  { method: "PUT", path: "/rest-api/poi/{id}", config: poiApi.updateOne },

  { method: "GET", path: "/rest-api/poi/categories", config: poiCategoryApi.find },
  { method: "POST", path: "/rest-api/poi/categories", config: poiCategoryApi.create },
  { method: "DELETE", path: "/rest-api/poi/categories", config: poiCategoryApi.deleteAll },
  { method: "GET", path: "/rest-api/poi/categories/{id}", config: poiCategoryApi.findOne },
  { method: "DELETE", path: "/rest-api/poi/categories/{id}", config: poiCategoryApi.deleteOne },
  { method: "PUT", path: "/rest-api/poi/categories/{id}", config: poiCategoryApi.updateOne },
];
