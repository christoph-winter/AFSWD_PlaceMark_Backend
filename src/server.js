import Inert from "@hapi/inert";
import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import HapiSwagger from "hapi-swagger";
import Joi from "joi";
import { db } from "./models/db.js";
import { webRoutes } from "./web-routes.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { apiRoute } from "./api-route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
}

const swaggerOptions = {
  info: {
    title: "POI App API",
    version: "0.1",
  },
};
async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    routes: { cors: true },
  });
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.validator(Joi);
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views",
    partialsPath: "./views/components",
    layout: true,
    isCached: false,
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/login",
    validateFunc: accountsController.validate,
  });
  server.auth.default("session");
  db.init("mongo");

  server.route(apiRoute);
  server.route(webRoutes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

await init();
