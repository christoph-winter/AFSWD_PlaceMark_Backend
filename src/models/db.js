import { userMongoStore } from "./mongo/user-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";
import { POICategoryMongoStore } from "./mongo/poi-category-mongo-store.js";
import { POIMongoStore } from "./mongo/poi-mongo-store.js";

export const db = {
  userStore: null,
  poiCategoryStore: null,
  poiStore: null,

  init() {
    this.userStore = userMongoStore;
    this.poiCategoryStore = POICategoryMongoStore;
    this.poiStore = POIMongoStore;
    connectMongo();
  },
};
