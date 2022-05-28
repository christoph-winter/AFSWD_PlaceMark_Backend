import { db } from "../models/db.js";

export const poiController = {
  index: {
    auth: false,
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // TODO: Welcome Page
      return h.view("Welcome", { user: loggedInUser });
    },
  },
  dashboard: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const POIs = await db.poiStore.getAllPOIs();
      if (loggedInUser) {
        // only creator or admin can edit an POI
        // TODO: Check if user is admin
        POIs.forEach((current) => {
          console.log(current.creator._id);
          if (current.creator._id.equals(loggedInUser.id)) current.iseditable = true;
          else current.iseditable = false;
        });
        console.log(POIs);
      }
      return h.view("Dashboard", {
        user: loggedInUser,
        pois: POIs,
      });
    },
  },
  showAddPOI: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const allCategories = await db.poiCategoryStore.getAllCategories();
      return h.view("AddNewPOI", {
        user: loggedInUser,
        categories: allCategories,
      });
    },
  },
  addPOI: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newPOI = {
        title: request.payload.title,
        description: request.payload.description,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
      };
      const newDBPOI = await db.poiStore.addPOI(newPOI, loggedInUser.id, request.payload.categories);
      console.log(newDBPOI);
      return h.redirect("/dashboard");
    },
  },
  showEditPOI: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const poiToEdit = await db.poiStore.getPOIById(request.params.id);
      return h.view("EditPOI", {
        user: loggedInUser,
        poi: poiToEdit,
      });
    },
  },
};
