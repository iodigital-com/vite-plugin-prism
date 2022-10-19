import { EventHandler, H3Event, readBody, setResponseHeaders } from "h3";
import type { NextFunction, NextHandleFunction } from "connect";
import type { IncomingMessage, ServerResponse } from "http";
import type { PrismHttp } from "@stoplight/prism-http/dist/client.js";
import type { IHttpNameValue, IHttpRequest } from "@stoplight/prism-http";
import type { HttpMethod } from "@stoplight/types";
import { getPrismClient, PrismPluginOptions } from "./client.js";
import { createPrismMiddleware } from "./prism-middleware.js";

export const createPrismNuxtMiddleware =
  (config: Partial<PrismPluginOptions>, prismPath?: string): EventHandler =>
  async (event: H3Event) => {
    const { req, res } = event;
    if (!req.method || !req.url || !req.url.startsWith(prismPath)) return;
    const method = req.method.toLowerCase();
    const body = ["put", "post", "patch"].includes(method) && (await readBody(event));
    return createPrismMiddleware({ req, res, prismPath, body, config });
  };
