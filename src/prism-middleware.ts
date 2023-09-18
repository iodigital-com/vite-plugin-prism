import { IHttpNameValue, IHttpRequest } from "@stoplight/prism-http";
import { HttpMethod, IHttpOperation } from "@stoplight/types";
import { matchPath } from "@stoplight/prism-http/dist/router/matchPath.js";
import type { IncomingMessage, ServerResponse } from "http";
import { isFunction } from "lodash-es";
import { getPrismClient, PrismPluginOptions } from "./client.js";
import { prismResponseInterceptor } from "./prism-interceptors.js";

interface IPrismMiddlewareOptions {
  req: IncomingMessage;
  res: ServerResponse;
  prismPath: string;
  body?: unknown;
  config: Partial<PrismPluginOptions>;
}

const getOperationByRequest = ({
  requestUrl,
  method,
  operations,
}: {
  requestUrl: string;
  method: string;
  operations: IHttpOperation[];
}): IHttpOperation<false> | undefined => {
  const matchedOperations = operations.filter((operation) => {
    const url = requestUrl.split("?")[0];
    return matchPath(url, operation.path).right !== "no-match" && method === operation.method;
  });
  if (matchedOperations.length > 0) return matchedOperations[0];
  return undefined;
};

export const createPrismMiddleware = async ({ req, res, config, body }: IPrismMiddlewareOptions) => {
  try {
    // Remove dev-server base from URL
    const sanitizedUrl = req?.url.replace(config.route, "");
    // If sanitizedUrl is an empty string, say it's the root path
    const requestUrl = sanitizedUrl.length ? sanitizedUrl : "/";
    // If the pathRewrite function is defined, use it to rewrite the URL
    const rewrittenUrl = isFunction(config.pathRewrite) ? await config.pathRewrite(requestUrl) : requestUrl;

    const { headers } = req;
    const method = req.method.toLowerCase();
    const prismRequest: Pick<IHttpRequest, "headers" | "url"> = {
      headers: req.headers as IHttpNameValue,
      url: { path: rewrittenUrl },
    };
    const { client, config: fullConfig, operations } = await getPrismClient(config, prismRequest);
    const operation = getOperationByRequest({ requestUrl: rewrittenUrl, method, operations });

    return client
      .request(rewrittenUrl, {
        headers: headers as IHttpNameValue,
        method: method as HttpMethod,
        body,
      })
      .then(async (output) => {
        const interceptedOutput = await prismResponseInterceptor({ operation, output, config: fullConfig });
        res.writeHead(interceptedOutput.status, { ...interceptedOutput.headers });
        res.end(JSON.stringify(interceptedOutput.data));
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
