import { IHttpNameValue, IHttpRequest } from "@stoplight/prism-http";
import { HttpMethod } from "@stoplight/types";
import type { IncomingMessage, ServerResponse } from "http";
import { getPrismClient, PrismPluginOptions } from "./client.js";

interface IPrismMiddlewareOptions {
  req: IncomingMessage;
  res: ServerResponse;
  prismPath: string;
  body?: unknown;
  config: Partial<PrismPluginOptions>;
}

export const createPrismMiddleware = async ({ req, res, prismPath, config, body }: IPrismMiddlewareOptions) => {
  try {
    // Remove dev-server base from URL
    const sanitizedUrl = req?.url.replace(prismPath, "");
    // If sanitizedUrl is an empty string, say it's the root path
    const requestUrl = sanitizedUrl.length ? sanitizedUrl : "/";
    const { headers } = req;
    const method = req.method.toLowerCase();
    const prismRequest: Pick<IHttpRequest, "headers" | "url"> = {
      headers: req.headers as IHttpNameValue,
      url: { path: requestUrl },
    };
    const client = await getPrismClient(config, prismRequest);

    client
      .request(requestUrl, {
        headers: headers as IHttpNameValue,
        method: method as HttpMethod,
        body,
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
