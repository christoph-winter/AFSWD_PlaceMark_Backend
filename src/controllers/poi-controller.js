import { db } from "../models/db.js";
import { POISpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";
import { testPOICategories } from "../../test/fixtures.js";

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
    validate: {
      payload: POISpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const allCategories = await db.poiCategoryStore.getAllCategories();
        return h
          .view("AddNewPOI", { error: { details: error.details }, categories: allCategories })
          .takeover()
          .code(400);
      },
    },
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
    // TODO: EditPOI view
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const poiToEdit = await db.poiStore.getPOIById(request.params.id);
      return h.view("EditPOI", {
        user: loggedInUser,
        poi: poiToEdit,
      });
    },
  },
  uploadImage: {
    handler: async function (request, h) {
      const poi = await db.poiStore.getPOIById(request.params.id);

      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          poi.images.push({ src: url });
          await db.poiStore.updatePOI(request.params.id, { images: poi.images });
        }
        return h.redirect(`/dashboard/${poi._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/dashboard/${poi._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
  // TODO: implement delete image
  deleteImage: {
    handler: async function (request, h) {
      try {
      } catch (e) {}
    },
  },
};
