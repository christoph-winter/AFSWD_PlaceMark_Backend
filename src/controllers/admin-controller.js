import { db } from "../models/db.js";
import { POICategorySpec, POICategorySpecUpdate, POISpec, UserSpecUpdate } from "../models/joi-schemas.js";

export const adminController = {
  adminDashboard: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (loggedInUser.isadmin) {
        const allUsers = await db.userStore.getAllUsers(request.params.id);
        const allCategories = await db.poiCategoryStore.getAllCategories();
        return h.view("AdminDashboard", {
          user: loggedInUser,
          users: allUsers,
          categories: allCategories,
        });
      }
      return h.response().code(404);
    },
  },
  addCategory: {
    validate: {
      payload: POICategorySpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const allCategories = await db.poiCategoryStore.getAllCategories();
        return h
          .view("AdminDashboard", { error: { details: error.details }, categories: allCategories })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (loggedInUser.isadmin) {
        await db.poiCategoryStore.addCategory(request.payload);
        return h.redirect("/admindashboard");
      }
      return h.response().code(404);
    },
  },
  setAdmin: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (loggedInUser.isadmin) {
        await db.userStore.updateUser(request.params.id, { isadmin: true });
        return h.redirect("/admindashboard");
      }
      return h.response().code(404);
    },
  },
  deleteUser: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (loggedInUser.isadmin) {
        await db.userStore.deleteUserById(request.params.id);
        return h.redirect("/admindashboard");
      }
      return h.response().code(404);
    },
  },
};
