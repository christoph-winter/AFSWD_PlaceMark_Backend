import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, POICategorySpecPlus, UserArraySpec, UserSpec, UserSpecPlus, UserSpecUpdate } from "../models/joi-schemas.js";
import { validationErrorInput, validationErrorOutput } from "./logger.js";

export const userApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return h.response(users).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all Users",
    notes: "Returns all Users.",
    response: { schema: UserArraySpec, failAction: validationErrorOutput },
  },
  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return h.response(user).code(200);
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Find a User",
    notes: "Returns a User.",
    validate: { params: { id: IdSpec }, failAction: validationErrorInput },
    response: { schema: UserSpecPlus, failAction: validationErrorOutput },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      const user = request.payload;
      try {
        const usernameAvailable = (await db.userStore.getUserByUsername(user.username)) == null;
        const emailAvailable = (await db.userStore.getUserByEmail(user.email)) == null;
        if (usernameAvailable && emailAvailable) {
          const addedUser = await db.userStore.addUser(user);
          if (addedUser) return h.response(addedUser).code(201);
          return Boom.badImplementation("Error creating new User");
        }
        let errorMsg = "";
        if (!usernameAvailable) errorMsg = "Username already exists.";
        if (!emailAvailable) errorMsg = "Email address already in use.";

        return Boom.conflict(errorMsg);
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create User",
    notes: "Consumes specified key-value pairs for creation of a User. Produces created User object.",
    validate: { payload: UserSpec, failAction: validationErrorInput },
    response: { schema: UserSpecPlus, failAction: validationErrorOutput },
  },
  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.userStore.deleteUserById(request.params.id);
        return h.response().code(204);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes one User",
    validate: { params: { id: IdSpec }, failAction: validationErrorInput },
  },
  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes all Users",
  },
  updateOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = request.payload;
        const usernameAvailable = user.username ? (await db.userStore.getUserByUsername(user.username)) === null : true;
        const emailAvailable = user.email ? (await db.userStore.getUserByEmail(user.email)) === null : true;
        const updatedUser = await db.userStore.updateUser(request.params.id, request.payload);
        if (usernameAvailable && emailAvailable) return h.response(updatedUser).code(200);
        let errorMsg = "";
        if (!usernameAvailable) errorMsg = "Username already exists.";
        if (!emailAvailable) errorMsg = "Email address already in use.";
        return Boom.conflict(errorMsg);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Update one User",
    notes: "Consumes specified key-value pairs for POICategory update. Produces updated User object.",
    validate: { params: { id: IdSpec }, payload: UserSpecUpdate, failAction: validationErrorInput },
    response: { schema: UserSpecPlus, failAction: validationErrorOutput },
  },
};
