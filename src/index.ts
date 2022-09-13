/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Plugin } from "vite";
import { pino } from "pino";
import { defu } from "defu";
import bodyParser from "body-parser";
import { getHttpOperationsFromSpec } from "@stoplight/prism-cli/dist/operations.js";
import { createClientFromOperations } from "@stoplight/prism-http/dist/client.js";
import type { IHttpConfig } from "@stoplight/prism-http";

import { createPrismMiddleware } from "./prism-middleware.js";

type IClientConfig = IHttpConfig & {
  baseUrl?: string;
  logger?: pino.Logger;
};

export interface VitePluginPrismOptions {
  specFilePathOrObject: string | object;
  prismConfig?: IClientConfig;
  debug?: boolean;
}

const getLogger = (enabled = false) => {
  const logger = pino({ name: "PRISM", enabled });
  // @ts-ignore
  logger.success = logger.info;
  return logger;
};

const getDefaultPrismConfig = (debug?: boolean): Partial<IClientConfig> => {
  const logger = getLogger(debug);
  return {
    logger,
    mock: { dynamic: true },
    validateRequest: true,
    validateResponse: true,
    checkSecurity: true,
    errors: true,
  };
};

const vitePluginPrism = ({ specFilePathOrObject, prismConfig, debug }: VitePluginPrismOptions): Plugin => ({
  name: "vite-plugin-prism:middleware",
  async configureServer(devServer) {
    const operations = await getHttpOperationsFromSpec(specFilePathOrObject);
    const defaultConfig = getDefaultPrismConfig(debug);
    const client = createClientFromOperations(operations, defu(prismConfig, defaultConfig));
    const { server } = devServer.config;
    const port = server.port ? `:${server.port}` : "";
    const host = server.host || "localhost";
    const https = server.https ? "https" : "http";
    const serverOrigin = `${https}://${host}${port}`;
    devServer.middlewares.use(bodyParser.json({ strict: false }));
    devServer.middlewares.use(bodyParser.raw());
    devServer.middlewares.use(bodyParser.text());
    devServer.middlewares.use(bodyParser.urlencoded());
    devServer.middlewares.use(createPrismMiddleware(client, serverOrigin));
  },
});

export default vitePluginPrism;
