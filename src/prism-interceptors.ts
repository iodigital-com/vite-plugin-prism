import type { IHttpOperation, IHttpRequest } from "@stoplight/types";
import type { PromiseType, Overwrite } from "utility-types";
import { PrismHttp } from "@stoplight/prism-http/dist/client.js";
import { camelCase } from "lodash";
import { PrismPluginOptions } from "./client.js";
import chalk from "chalk";

export type PrismOutput = PromiseType<ReturnType<PrismHttp["request"]>>;

export interface IHttpRequestTyped<T = void> extends Omit<Partial<IHttpRequest>, "url"> {
  body?: T;
}

export type PrismOutputTyped<ResponseBody, RequestBody> = Overwrite<
  PrismOutput,
  {
    data: ResponseBody;
    request: IHttpRequestTyped<RequestBody>;
  }
>;

export type InterceptorContext<T, K> = {
  output: PrismOutputTyped<T, K>;
};

export interface PrismResponseInterceptor<T, K> {
  (ctx: InterceptorContext<T, K>): PrismOutputTyped<T, K> | Promise<PrismOutputTyped<T, K>>;
}

export function definePrismResponseInterceptor<T = any, K = any>(
  plugin: PrismResponseInterceptor<T, K>
): (ctx: InterceptorContext<T, K>) => PrismOutputTyped<T, K> | Promise<PrismOutputTyped<T, K>> {
  return plugin;
}

export type PrismResponseInterceptorOptions = {
  config: Partial<PrismPluginOptions>;
  operation: IHttpOperation;
  output: PrismOutputTyped<any, any>;
};

export async function prismResponseInterceptor({ config, operation, output }: PrismResponseInterceptorOptions) {
  const { interceptors } = config;
  const interceptor =
    interceptors && Object.entries(interceptors).find(([key]) => key === `${camelCase(operation.iid)}Response`)?.[1];

  if (interceptor) {
    console.log(
      "PRISM",
      chalk.black.bgHex("#818cf8")(`[INTERCEPTOR]`),
      `Running response interceptor for ${operation.iid}`
    );
    const context: InterceptorContext<any, any> = { output };
    return interceptor(context);
  }
  return output;
}
