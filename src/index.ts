#!/usr/bin/env node

/**
 * Marketplace entry point — minimal gateway only.
 * thoughtbox_search + thoughtbox_execute via Dedalus Marketplace.
 */

import {
  GatewayRegistry,
  CompositeGatewayRuntime,
  DedalusMarketplaceRuntime,
} from "./gateway/index.js";
import type { GatewayRuntime } from "./gateway/index.js";
import { createThoughtboxMarketplaceHttpApp } from "./dedalus-marketplace/http.js";
import type { Logger } from "./types.js";

const logger: Logger = {
  debug: (msg, ...args) => console.error(`[DEBUG] ${msg}`, ...args),
  info:  (msg, ...args) => console.error(`[INFO]  ${msg}`, ...args),
  warn:  (msg, ...args) => console.error(`[WARN]  ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
};

const fileGateway = await GatewayRegistry.fromDefaultManifest(logger);

let gateway: GatewayRuntime = fileGateway;
const dedalusApiKey = process.env.DEDALUS_API_KEY;
if (dedalusApiKey) {
  const marketplace = new DedalusMarketplaceRuntime(dedalusApiKey, logger);
  gateway = new CompositeGatewayRuntime([fileGateway, marketplace]);
  await gateway.refresh();
  logger.info("[Dedalus] Marketplace integration enabled");
}

const app = createThoughtboxMarketplaceHttpApp({ gateway });
const port = process.env.PORT ?? 1731;

app.listen(port, () => {
  logger.info(`Thoughtbox gateway listening on port ${port}`);
});
