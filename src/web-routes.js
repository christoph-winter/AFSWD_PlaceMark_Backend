import { poiController } from "./controllers/poi-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: poiController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "POST", path: "/signup", config: accountsController.signup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "POST", path: "/login", config: accountsController.login },
  { method: "POST", path: "/logout", config: accountsController.logout },
  { method: "GET", path: "/dashboard", config: poiController.dashboard },
  { method: "GET", path: "/dashboard/addvenue", config: poiController.showAddPOI },
  { method: "POST", path: "/dashboard/addvenue", config: poiController.addPOI },
  { method: "GET", path: "/profile", config: accountsController.profile },
  { method: "GET", path: "/dashboard/{id}", config: poiController.showEditPOI },
  { method: "POST", path: "/dashboard/{id}/uploadimage", config: poiController.uploadImage },
  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
