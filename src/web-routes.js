import { poiController } from "./controllers/poi-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { adminController } from "./controllers/admin-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: poiController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "POST", path: "/signup", config: accountsController.signup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "POST", path: "/login", config: accountsController.login },
  { method: "POST", path: "/logout", config: accountsController.logout },
  { method: "GET", path: "/admindashboard", config: adminController.adminDashboard },
  { method: "POST", path: "/admindashboard/addcategory", config: adminController.addCategory },
  { method: "POST", path: "/admindashboard/setadmin/{id}", config: adminController.setAdmin },
  { method: "POST", path: "/admindashboard/deleteuser/{id}", config: adminController.deleteUser },
  { method: "GET", path: "/dashboard", config: poiController.dashboard },
  { method: "GET", path: "/dashboard/addvenue", config: poiController.showAddPOI },
  { method: "POST", path: "/dashboard/addvenue", config: poiController.addPOI },
  { method: "GET", path: "/profile", config: accountsController.profile },
  { method: "POST", path: "/profile/updateuser/{id}", config: accountsController.updateUser },
  { method: "GET", path: "/dashboard/{id}", config: poiController.showEditPOI }, //FIXME: Does not route;
  { method: "PUT", path: "/dashboard/{id}", config: poiController.editPOI },
  { method: "POST", path: "/dashboard/{id}/uploadimage", config: poiController.uploadImage },
  { method: "POST", path: "/dashboard/{id}/images/{imgid}", config: poiController.deleteImage },
  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
