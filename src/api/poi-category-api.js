import Boom from "@hapi/boom";
import { db } from "../models/db.js";

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
        return Boom.badImplementation("error creating new Category");
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
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
  },
};
