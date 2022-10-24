import type { Plugin } from "vite";
import { defu } from "defu";
import bodyParser from "body-parser";
import { createVitePrismMiddleware } from "./prism-vite-middleware.js";
import { type PrismPluginOptions } from "./client.js";

export const defaultConfig = {
  route: "/api",
};

const vitePluginPrism = (config: PrismPluginOptions): Plugin => ({
  name: "vite-plugin-prism:middleware",
  async configureServer(devServer) {
    const resolvedConfig = defu(config, defaultConfig);
    devServer.middlewares.use(bodyParser.json({ strict: false }));
    devServer.middlewares.use(bodyParser.raw());
    devServer.middlewares.use(bodyParser.text());
    devServer.middlewares.use(bodyParser.urlencoded());
    devServer.middlewares.use(createVitePrismMiddleware(config, resolvedConfig.route));
  },
});

export default vitePluginPrism;
