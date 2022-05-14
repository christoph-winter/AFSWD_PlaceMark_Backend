import { userMongoStore } from "./mongo/user-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,

  init() {
    this.userStore = userMongoStore;
    connectMongo();
  },
};
