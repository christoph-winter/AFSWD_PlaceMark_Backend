import { db } from "../models/db.js";

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
    handler: async function (request, h) {
      const user = request.payload;
      const usernameAvailable = (await db.userStore.getUserByUsername(user.username)) == null;
      const emailAvailable = (await db.userStore.getUserByEmail(user.email)) == null;
      if (usernameAvailable && emailAvailable) {
        const addedUser = await db.userStore.addUser(user);
        return h.redirect("/login");
      }
      let errormsg = null;
      if (!usernameAvailable) errormsg = "Username already exists";
      if (!emailAvailable) errormsg = "Email address already in use";
      return h.view("Signup", { error: { message: errormsg } });
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
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.view("Login", { error: { message: "Wrong email or password" } });
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
  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    // TODO: admin account. Check if admin.
    if (!user) {
      return { valid: false };
    }
    return { valid: true, credentials: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname } };
  },
};
