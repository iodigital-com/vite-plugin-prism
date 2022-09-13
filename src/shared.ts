import { IHttpConfig } from "@stoplight/prism-http";
import { pino } from "pino";
import { defu } from "defu";
import { getHttpOperationsFromSpec } from "@stoplight/prism-cli/dist/operations.js";
import { createClientFromOperations } from "@stoplight/prism-http/dist/client.js";

/* eslint-disable @typescript-eslint/ban-ts-comment */
export const getLogger = (enabled = false) => {
  const logger = pino({ name: "PRISM", enabled });
  // @ts-ignore
  logger.success = logger.info;
  return logger;
};

export type PrismConfig = IHttpConfig & {
  baseUrl?: string;
  logger?: pino.Logger;
};

export interface PrismPluginOptions {
  route?: string;
  specFilePathOrObject: string | object;
  prismConfig?: PrismConfig;
  debug?: boolean;
}

export const getDefaultPrismConfig = (debug?: boolean): Partial<PrismConfig> => {
  const logger = getLogger(debug);
  return {
    logger,
    mock: { dynamic: true },
    validateRequest: true,
    validateResponse: true,
    checkSecurity: true,
    errors: true,
  };
};

export const getPrismClient = async (config: PrismPluginOptions) => {
  const { specFilePathOrObject, debug, prismConfig } = config;
  const operations = await getHttpOperationsFromSpec(specFilePathOrObject);
  const defaultPrismConfig = getDefaultPrismConfig(debug);
  return createClientFromOperations(operations, defu(prismConfig, defaultPrismConfig));
};
