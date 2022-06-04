import Boom from "@hapi/boom";
import { db } from "../models/db.js";

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
          return Boom.badImplementation("Error creating new user");
        }
        let errorMsg = "";
        if (!usernameAvailable) errorMsg = "Username already exists.";
        if (!emailAvailable) errorMsg = "Email address already in use.";

        return Boom.conflict(errorMsg);
      } catch (e) {
        return Boom.serverUnavailable("Database Error");
      }
    },
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
  },
  updateOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const updatedUser = await db.userStore.updateUser(request.params.id, request.payload);
        return h.response(updatedUser).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};
