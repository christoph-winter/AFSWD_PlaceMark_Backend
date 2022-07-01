import { db } from "../models/db.js";
import { POISpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";

export const poiController = {
  index: {
    auth: false,
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      return h.view("Welcome", { user: loggedInUser });
    },
  },
  dashboard: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const POIs = await db.poiStore.getAllPOIs();
      if (loggedInUser) {
        // only creator or admin can edit an POI
        POIs.forEach((current) => {
          if (current.creator) {
            if (current.creator._id.equals(loggedInUser.id) || loggedInUser.isadmin) current.iseditable = true;
            else current.iseditable = false;
          } else current.iseditable = false;
        });
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
      return h.redirect("/dashboard");
    },
  },
  showEditPOI: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const poiToEdit = await db.poiStore.getPOIById(request.params.id);
      const allCategories = await db.poiCategoryStore.getAllCategories();
      return h.view("EditPOI", {
        user: loggedInUser,
        poi: poiToEdit,
        categories: allCategories,
      });
    },
  },
  editPOI: {
    validate: {
      payload: POISpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const loggedInUser = request.auth.credentials;
        const poiToEdit = await db.poiStore.getPOIById(request.params.id);
        const allCategories = await db.poiCategoryStore.getAllCategories();
        return h
          .view("EditPOI", { error: { details: error.details }, user: loggedInUser, poi: poiToEdit, categories: allCategories })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const poiToEdit = await db.poiStore.getPOIById(request.params.id);
      const allCategories = await db.poiCategoryStore.getAllCategories();
      try {
        await db.poiStore.updatePOI(request.params.id, request.payload);
        return h.redirect("/dashboard");
      } catch (err) {
        console.log(err);
        return h
          .view("EditPOI", { error: { details: err.details }, user: loggedInUser, poi: poiToEdit, categories: allCategories })
          .takeover()
          .code(400);
      }
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
        const poi = await db.poiStore.getPOIById(request.params.id);
        const img = request.params.imgid;
        console.log(poi);
        console.log(img);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
