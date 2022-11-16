import { eventHandler, EventHandler, H3Event, readBody } from "h3";
import { PrismPluginOptions } from "./client.js";
import { createPrismMiddleware } from "./prism-middleware.js";

export const createPrismNuxtMiddleware = (config: Partial<PrismPluginOptions>, prismPath?: string): EventHandler =>
  eventHandler(async (event: H3Event) => {
    const { req, res } = event;
    if (!req.method || !req.url || !req.url.startsWith(prismPath)) return;
    const method = req.method.toLowerCase();
    const body = ["put", "post", "patch"].includes(method) && (await readBody(event));
    return createPrismMiddleware({ req, res, prismPath, body, config });
  });
