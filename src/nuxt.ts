import { defineNuxtModule, addDevServerHandler } from "@nuxt/kit";
import { createPrismNuxtMiddleware } from "./prism-nuxt-middleware.js";
import { PrismPluginOptions } from "./client.js";

export default defineNuxtModule<Partial<PrismPluginOptions>[]>({
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
  defaults: [],
  async setup(moduleConfig) {
    try {
      Object.values(moduleConfig).forEach((config) => {
        if (!config.specFilePathOrObject) {
          throw new Error("specFilePathOrObject is not defined. Cannot start Prism Dev Server");
        }
        addDevServerHandler({
          route: config.route || "/api",
          handler: createPrismNuxtMiddleware(config, "/"),
        });
      });
    } catch (error) {
      console.error(error);
    }
  },
});
