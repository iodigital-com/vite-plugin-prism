import { defineNuxtModule, addDevServerHandler } from "@nuxt/kit";
import { createPrismMiddleware } from "./prism-middleware.js";
import { getPrismClient, PrismPluginOptions } from "./shared.js";

export default defineNuxtModule<Partial<PrismPluginOptions>>({
  meta: {
    // Usually  npm package name of your module
    name: "@iodigital/vite-plugin-prism",
    // The key in `nuxt.config` that holds your module options
    configKey: "prism",
    // Compatibility constraints
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: ">=3.0.0-rc.9",
    },
  },
  // Default configuration options for your module
  defaults: {
    route: "/api",
  },
  async setup(config) {
    try {
      if (!config.specFilePathOrObject) {
        throw new Error("specFilePathOrObject is not defined. Cannot start Prism Dev Server");
      }
      const client = await getPrismClient(config as PrismPluginOptions);
      addDevServerHandler({
        route: config.route,
        handler: createPrismMiddleware(client, "/"),
      });
    } catch (error) {
      console.error(error);
    }
  },
});
