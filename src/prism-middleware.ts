/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, NextHandleFunction } from "connect";
import type { IncomingMessage, ServerResponse } from "http";
import type { PrismHttp } from "@stoplight/prism-http/dist/client.js";
import type { IHttpNameValue } from "@stoplight/prism-http";
import type { HttpMethod } from "@stoplight/types";

export const createPrismMiddleware = (client: PrismHttp, prismPath?: string): NextHandleFunction => {
  return async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    try {
      if (!req.method || !req.url || !req.url.startsWith(prismPath)) {
        next();
      } else {
        // Remove dev-server base from URL
        const sanitizedUrl = req?.url.replace(prismPath, "");
        // If sanitizedUrl is an empty string, say it's the root path
        const requestUrl = sanitizedUrl.length ? sanitizedUrl : "/";
        const method = req.method.toLocaleLowerCase();
        const { headers } = req;

        client
          .request(requestUrl, {
            headers: headers as IHttpNameValue,
            method: method as HttpMethod,
          })
          .then((mockedResponse) => {
            res.writeHead(mockedResponse.status, { ...mockedResponse.headers });
            res.end(JSON.stringify(mockedResponse.data));
          })
          .catch((error) => {
            if (!error.status) {
              throw new Error(error);
            } else {
              console.error(error);
              res.writeHead(error.status);
              res.end();
            }
          });
      }
    } catch (error) {
      res.statusCode = 500;
      console.error(error);
      res.end();
    }
  };
};
