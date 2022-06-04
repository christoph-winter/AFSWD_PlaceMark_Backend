import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { POISpec } from "../models/joi-schemas.js";

export const poiApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const pois = await db.poiStore.getAllPOIs();
        return h.response(pois).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  findOne: {
    auth: false,
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
  },
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const poi = request.payload;
        const { creator } = poi;
        const { categories } = poi;
        const newPOI = await db.poiStore.addPOI(poi, creator, categories);
        if (newPOI) {
          return h.response(newPOI).code(201);
        }
        return Boom.badImplementation("error creating new POI");
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.getPOIById(request.params.id);
        if (!poi) {
          return Boom.notFound("No POI with this id");
        }
        await db.poiStore.deletePOIById(poi._id);
        return h.response().code(204);
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.poiStore.deleteAll();
        return h.response().code(204);
      } catch (e) {
        console.log(e);
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  updateOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.updatePOI(request.params.id, request.payload);
        if (poi) {
          return h.response(poi).code(200);
        }
        return Boom.notFound("No POI with this id");
      } catch (err) {
        return Boom.serverUnavailable("Database error");
      }
    },
  },
};
