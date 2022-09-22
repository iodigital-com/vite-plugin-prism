import type { Plugin } from "vite";
import { defu } from "defu";
import bodyParser from "body-parser";
import { createPrismMiddleware } from "./prism-vite-middleware.js";
import { getPrismClient, type PrismPluginOptions } from "./shared.js";

export const defaultConfig = {
  route: "/api",
};

const vitePluginPrism = (config: PrismPluginOptions): Plugin => ({
  name: "vite-plugin-prism:middleware",
  async configureServer(devServer) {
    const resolvedConfig = defu(config, defaultConfig);
    const client = await getPrismClient(resolvedConfig);
    devServer.middlewares.use(bodyParser.json({ strict: false }));
    devServer.middlewares.use(bodyParser.raw());
    devServer.middlewares.use(bodyParser.text());
    devServer.middlewares.use(bodyParser.urlencoded());
    devServer.middlewares.use(createPrismMiddleware(client, resolvedConfig.route));
  },
});

export default vitePluginPrism;
