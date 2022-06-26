import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, POIArraySpec, POISpec, POISpecPlus, POISpecUpdate } from "../models/joi-schemas.js";
import { validationErrorInput, validationErrorOutput } from "./logger.js";

export const poiApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const pois = await db.poiStore.getAllPOIs();
        return h.response(pois).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all POIs",
    notes: "Returns all POIs.",
    response: { schema: POIArraySpec, failAction: validationErrorOutput },
  },
  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request, h) {
      try {
        const poi = await db.poiStore.getPOIById(request.params.id);
        if (poi) {
          return h.response(poi).code(200);
        }
        return Boom.notFound("No POI with this id");
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Find a POI",
    notes: "Returns a POI.",
    validate: { params: { id: IdSpec }, failAction: validationErrorInput },
    response: { schema: POISpecPlus, failAction: validationErrorOutput },
  },
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const poi = request.payload;
        const newPOI = await db.poiStore.addPOI(poi, poi.creator, poi.categories);
        if (newPOI) {
          return h.response(newPOI).code(201);
        }
        return Boom.badImplementation("Error creating new POI");
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create POI",
    notes: "Consumes specified key-value pairs for creation of a POI. Produces created POI object.",
    validate: { payload: POISpec, failAction: validationErrorInput },
    response: { schema: POISpecPlus, failAction: validationErrorOutput },
  },
  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      try {
        const poi = await db.poiStore.getPOIById(request.params.id);
        if (!poi) {
          return Boom.notFound("No POI with this id");
        }
        if (poi.creator === loggedInUser.userid || loggedInUser.isadmin) {
          await db.poiStore.deletePOIById(poi._id);
          return h.response().code(204);
        }
        return Boom.forbidden("Insufficient user permissions");
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes one POI",
    validate: { params: { id: IdSpec }, failAction: validationErrorInput },
  },
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const authenticatedUser = request.auth.credentials;
      if (authenticatedUser.isadmin) {
        try {
          await db.poiStore.deleteAll();
          return h.response().code(204);
        } catch (e) {
          console.log(e);
          return Boom.serverUnavailable("Database Error");
        }
      }
      return Boom.forbidden("Insufficient user permissions");
    },
    tags: ["api"],
    description: "Delete all POIs",
  },
  updateOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const authenticatedUser = request.auth.credentials;
      try {
        let poi = await db.poiStore.getPOIById(request.params.id);
        if (poi.creator || authenticatedUser.isadmin)
          if (authenticatedUser.isadmin || authenticatedUser.userid.equals(poi.creator._id)) {
            poi = await db.poiStore.updatePOI(request.params.id, request.payload);
            if (poi) {
              return h.response(poi).code(200);
            }
            return Boom.notFound("No POI with this id");
          }
        return Boom.forbidden("Insufficient user permissions");
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database error");
      }
    },
    tags: ["api"],
    description: "Update one POI",
    notes: "Consumes specified key-value pairs for POI update. Produces updated POI object.",
    validate: { params: { id: IdSpec }, payload: POISpecUpdate, failAction: validationErrorInput },
    response: { schema: POISpecPlus, failAction: validationErrorOutput },
  },
};
