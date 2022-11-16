import type { Plugin } from "vite";
import { defu } from "defu";
import bodyParser from "body-parser";
import { createVitePrismMiddleware } from "./prism-vite-middleware.js";
import { type PrismPluginOptions } from "./client.js";

export const defaultConfig = {
  route: "/api",
};

const vitePluginPrism = (moduleConfig: Partial<PrismPluginOptions>[]): Plugin => ({
  name: "vite-plugin-prism:middleware",
  async configureServer(devServer) {
    devServer.middlewares.use(bodyParser.json({ strict: false }));
    devServer.middlewares.use(bodyParser.raw());
    devServer.middlewares.use(bodyParser.text());
    devServer.middlewares.use(bodyParser.urlencoded({ extended: true }));

    moduleConfig.forEach((config) => {
      const resolvedConfig = defu(config, defaultConfig);
      if (!config.specFilePathOrObject) {
        throw new Error("specFilePathOrObject is not defined. Cannot start Prism Dev Server");
      }
      devServer.middlewares.use(createVitePrismMiddleware({ config: resolvedConfig, prismPath: resolvedConfig.route }));
    });
  },
});

export default vitePluginPrism;

export { definePrismResponseInterceptor } from "./prism-interceptors.js";
