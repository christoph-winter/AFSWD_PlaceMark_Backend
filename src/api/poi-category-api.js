import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, POICategoryArray, POICategorySpec, POICategorySpecPlus, POICategorySpecUpdate } from "../models/joi-schemas.js";
import { validationErrorInput, validationErrorOutput } from "./logger.js";

export const poiCategoryApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const categories = await db.poiCategoryStore.getAllCategories();
        return h.response(categories).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all POICategories",
    notes: "Returns all POICategories.",
    response: { schema: POICategoryArray, failAction: validationErrorOutput },
  },
  findOne: {
    auth: false,
    async handler(request, h) {
      try {
        const category = await db.poiCategoryStore.getCategoryById(request.params.id);
        if (category) {
          return h.response(category).code(200);
        }
        return Boom.notFound("No Category with this id");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Find a POICategory",
    notes: "Returns a POICategory.",
    validate: { params: { id: IdSpec }, failAction: validationErrorInput },
    response: { schema: POICategorySpecPlus, failAction: validationErrorOutput },
  },
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const category = request.payload;
        const newCategory = await db.poiCategoryStore.addCategory(category);
        if (newCategory) {
          return h.response(newCategory).code(201);
        }
        return Boom.badImplementation("Error creating new Category");
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create POICategory",
    notes: "Consumes specified key-value pairs for creation of a POICategory. Produces created POICategory.",
    validate: { payload: POICategorySpec, failAction: validationErrorInput },
    response: { schema: POICategorySpecPlus, failAction: validationErrorOutput },
  },
  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const category = await db.poiCategoryStore.getCategoryById(request.params.id);
        if (!category) {
          return Boom.notFound("No Category with this id");
        }
        await db.poiCategoryStore.deleteCategoryById(category._id);
        return h.response().code(204);
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes one POICategory",
    validate: { params: { id: IdSpec }, failAction: validationErrorInput },
  },
  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.poiCategoryStore.deleteAllCategories();
        return h.response().code(204);
      } catch (e) {
        console.log(e);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes all POICategories",
  },
  updateOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const category = await db.poiCategoryStore.updateCategory(request.params.id, request.payload);
        if (category) {
          return h.response(category).code(200);
        }
        return Boom.notFound("No Category with this id");
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database error");
      }
    },
    tags: ["api"],
    description: "Update one POICategory",
    notes: "Consumes specified key-value pairs for POICategory update. Produces updated POICategory object.",
    validate: { params: { id: IdSpec }, payload: POICategorySpecUpdate, failAction: validationErrorInput },
    response: { schema: POICategorySpecPlus, failAction: validationErrorOutput },
  },
};
