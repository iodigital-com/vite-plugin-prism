import { IHttpNameValue, IHttpRequest } from "@stoplight/prism-http";
import { HttpMethod } from "@stoplight/types";
import { matchPath } from '@stoplight/prism-http/dist/router/matchPath.js';
import type { IncomingMessage, ServerResponse } from "http";
import { getHttpOperationsFromSpecs, getPrismClient, PrismPluginOptions } from "./client.js";
import { f } from "./prism-interceptors.js";

interface IPrismMiddlewareOptions {
  req: IncomingMessage;
  res: ServerResponse;
  prismPath: string;
  body?: unknown;
  config: Partial<PrismPluginOptions>;
}

const getOperationByRequest = async ({requestUrl, method, config}) => {
  const operations = await getHttpOperationsFromSpecs(config.specFilePathOrObject);
  return operations.filter(operation => {
    return matchPath(requestUrl, operation.path).right !== 'no-match' && method === operation.method;
  })[0];
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

    return client
      .request(requestUrl, {
        headers: headers as IHttpNameValue,
        method: method as HttpMethod,
        body,
      })
      .then(async (mockedResponse) => {
        // get the operation from this response
        const operation = await getOperationByRequest({ requestUrl, method, config });
        // use it to get the interceptor
        const interceptedResponse = await f({config, operation, mockedResponse});
        res.writeHead(interceptedResponse.status, { ...interceptedResponse.headers });
        res.end(JSON.stringify(interceptedResponse.data));
        return res;
      })
      .catch((error) => {
        if (!error.status) {
          throw new Error(error);
        } else {
          console.error(error);
          res.statusCode = error.status;
          res.end(JSON.stringify({ ...error }));
          return res;
        }
      });
  } catch (error) {
    res.statusCode = 500;
    console.error(error);
    res.end();
    return res;
  }
};
