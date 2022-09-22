import { EventHandler, H3Event, readBody, setResponseHeaders } from "h3";
import type { NextFunction, NextHandleFunction } from "connect";
import type { IncomingMessage, ServerResponse } from "http";
import type { PrismHttp } from "@stoplight/prism-http/dist/client.js";
import type { IHttpNameValue } from "@stoplight/prism-http";
import type { HttpMethod } from "@stoplight/types";

export const createPrismMiddleware =
  (client: PrismHttp, prismPath?: string): EventHandler =>
  async (event: H3Event) => {
    const { req, res } = event;
    try {
      if (!req.method || !req.url || !req.url.startsWith(prismPath)) return;

      // Remove dev-server base from URL
      const sanitizedUrl = req?.url.replace(prismPath, "");
      // If sanitizedUrl is an empty string, say it's the root path
      const requestUrl = sanitizedUrl.length ? sanitizedUrl : "/";
      const method = req.method.toLowerCase();
      const { headers } = req;
      const body = ["put", "post"].includes(method) && (await readBody(event));

      client
        .request(requestUrl, {
          headers: headers as IHttpNameValue,
          method: method as HttpMethod,
          body,
        })
        .then((mockedResponse) => {
          setResponseHeaders(event, { ...mockedResponse.headers });
          res.statusCode = mockedResponse.status;
          res.end(JSON.stringify(mockedResponse.data));
        })
        .catch((error) => {
          if (!error.status) {
            throw new Error(error);
          } else {
            console.error(error);
            res.statusCode = error.status;
            res.end(JSON.stringify({ ...error }));
          }
        });
    } catch (error) {
      res.statusCode = 500;
      console.error(error);
      res.end();
    }
  };
