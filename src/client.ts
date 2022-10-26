import type { LogDescriptor, pino } from "pino";
import type { IHttpConfig, IHttpRequest } from "@stoplight/prism-http";
import { defu } from "defu";
import { createLogger } from "@stoplight/prism-core";
import { getHttpOperationsFromSpec } from "@stoplight/prism-cli/dist/operations.js";
import { createClientFromOperations } from "@stoplight/prism-http/dist/client.js";
import { LOG_COLOR_MAP } from "@stoplight/prism-cli/dist/const/options.js";
import { getHttpConfigFromRequest } from "@stoplight/prism-http-server/dist/getHttpConfigFromRequest.js";

import signale from "signale";
import split from "split2";
import { PassThrough, Readable } from "stream";
import chalk from "chalk";

type PrismLogDescriptor = LogDescriptor & { name: keyof typeof LOG_COLOR_MAP; offset?: number; input: IHttpRequest };

function pipeOutputToSignale(stream: Readable) {
  function constructPrefix(logLine: PrismLogDescriptor): string {
    const logOptions = LOG_COLOR_MAP[logLine.name];
    const prefix = "PRISM "
      .repeat(logOptions.index + (logLine.offset || 0))
      .concat(logOptions.color.black(`[${logLine.name}]`));

    return logLine.input
      ? prefix.concat(" " + chalk.bold.white(`${logLine.input.method} ${logLine.input.url.path}`))
      : prefix;
  }

  stream.pipe(split(JSON.parse)).on("data", (logLine: PrismLogDescriptor) => {
    signale.log({ prefix: constructPrefix(logLine), message: logLine.msg });
  });
}

export const getLogger = (enabled = false) => {
  const logStream = new PassThrough();
  const logInstance = createLogger(
    "PRISM",
    {
      enabled,
      customLevels: { start: 11 },
      level: "start",
      formatters: {
        level: (level) => ({ level }),
      },
    },
    logStream
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  logInstance.success = logInstance.info;
  pipeOutputToSignale(logStream);
  return logInstance;
};

export type PrismConfig = IHttpConfig & {
  baseUrl?: string;
  logger?: pino.Logger;
};

export interface PrismPluginOptions {
  route?: string;
  specFilePathOrObject: string | string[] | object | object[];
  prismConfig?: Partial<PrismConfig>;
  debug?: boolean;
}

export const getDefaultPrismConfig = (debug?: boolean): Partial<PrismConfig> => {
  const logger = getLogger(debug);
  return {
    logger,
    mock: { dynamic: false },
    validateRequest: true,
    validateResponse: true,
    checkSecurity: true,
    errors: true,
  };
};

const getHttpOperationsFromSpecs = async (specFilePathOrObject: PrismPluginOptions["specFilePathOrObject"]) => {
  if (Array.isArray(specFilePathOrObject)) {
    const operationBundles = await Promise.all(
      specFilePathOrObject.map((spec: string | object) => getHttpOperationsFromSpec(spec))
    );
    return operationBundles.flat();
  }
  return getHttpOperationsFromSpec(specFilePathOrObject);
};

export const getPrismClient = async (
  config: Partial<PrismPluginOptions>,
  req: Pick<IHttpRequest, "headers" | "url">
) => {
  const { specFilePathOrObject, debug, prismConfig } = config;
  const operations = await getHttpOperationsFromSpecs(specFilePathOrObject);
  const defaultPrismConfig = getDefaultPrismConfig(debug);
  const requestConfig = { mock: getHttpConfigFromRequest(req).right };
  const mergedConfig = defu(requestConfig, prismConfig, defaultPrismConfig);
  return createClientFromOperations(operations, mergedConfig);
};
