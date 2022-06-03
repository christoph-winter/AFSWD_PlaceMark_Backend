import { db } from "../models/db.js";
import { UserCredentialsSpec, UserSpec } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("Main");
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("Signup");
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        console.log({ message: error.details });
        return h
          .view("Signup", { error: { details: error.details } })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      const usernameAvailable = (await db.userStore.getUserByUsername(user.username)) == null;
      const emailAvailable = (await db.userStore.getUserByEmail(user.email)) == null;
      if (usernameAvailable && emailAvailable) {
        const addedUser = await db.userStore.addUser(user);
        return h.redirect("/login");
      }
      let errorMsg = "";
      if (!usernameAvailable) errorMsg = "Username already exists";
      if (!emailAvailable) errorMsg = "Email address already in use";
      console.log([{ message: errorMsg }]);
      return h
        .view("Signup", { error: { details: [{ message: errorMsg }] } })
        .takeover()
        .code(400);
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("Login");
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: {
        abortEarly: false,
      },
      failAction(request, h, error) {
        return h
          .view("Login", { error: { details: error.details } })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h
          .view("Login", { error: { details: [{ message: "Wrong email or password" }] } })
          .takeover()
          .code(400);
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/dashboard");
    },
  },
  profile: {
    handler: function (request, h) {
      // TODO: profile page. account settings.
      const loggedInUser = request.auth.credentials;
      return h.view("Profile", { user: loggedInUser });
    },
  },
  editAccount: {
    handler: function (request, h) {
      const loggedInUser = request.auth.credentials;
      return h.redirect("/profile");
    },
  },
  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    // TODO: admin account. Check if admin.
    if (!user) {
      return { valid: false };
    }
    return { valid: true, credentials: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname } };
  },
};
