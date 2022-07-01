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
  adminAnalytics: {
    handler: async function (request, h) {
      const categories = await db.poiCategoryStore.getAllCategories();
      const users = await db.userStore.getAllUsers();
      const loggedInUser = request.auth.credentials;
      const creators = [];
      const categoryCount = categories.map((item) => ({ title: item.title, count: 0 }));
      const pois = await db.poiStore.getAllPOIs();
      pois.forEach((poi) => {
        if (poi.creator) {
          if (!creators.includes(poi.creator._id)) creators.push(poi.creator._id);
        }
        if (poi.categories) {
          poi.categories.forEach((category) => {
            // eslint-disable-next-line array-callback-return
            categoryCount.find((o, i) => {
              if (o.title === category.title) {
                categoryCount[i].count += 1;
              }
            });
          });
        }
      });
      return h.view("AdminAnalytics", {
        countCreators: creators.length,
        countUsers: users.length,
        user: loggedInUser,
        categoryCount: categoryCount,
      });
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
