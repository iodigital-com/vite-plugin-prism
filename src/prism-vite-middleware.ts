/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, NextHandleFunction } from "connect";
import type { IncomingMessage, ServerResponse } from "http";
import type { PrismHttp } from "@stoplight/prism-http/dist/client.js";
import type { IHttpNameValue } from "@stoplight/prism-http";
import type { HttpMethod } from "@stoplight/types";
import { PrismPluginOptions } from "./client.js";
import { createPrismMiddleware } from "./prism-middleware.js";

export const createVitePrismMiddleware = (
  config: Partial<PrismPluginOptions>,
  prismPath?: string
): NextHandleFunction => {
  return async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    if (!req.method || !req.url || !req.url.startsWith(prismPath)) {
      next();
    } else {
      // @ts-ignore
      const { body } = req;
      createPrismMiddleware({ req, res, prismPath, body, config });
    }
  };
};
