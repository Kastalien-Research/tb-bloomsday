#!/usr/bin/env node

/**
 * Thoughtbox MCP Server - Entry Point (Streamable HTTP)
 */

import * as path from "node:path";
import * as os from "node:os";
import type { Request, Response } from "express";
import {
  FileSystemStorage,
  InMemoryStorage,
  SupabaseStorage,
  migrateExports,
  type ThoughtboxStorage,
} from "./persistence/index.js";
import { SupabaseKnowledgeStorage } from "./knowledge/index.js";
import type { KnowledgeStorage } from "./knowledge/types.js";
import {
  createObservatoryServer,
  loadObservatoryConfig,
  type ObservatoryServer,
} from "./observatory/index.js";
import { createFileSystemHubStorage } from "./hub/hub-storage-fs.js";
import type { HubStorage } from "./hub/hub-types.js";
import { initEvaluation, initMonitoring } from "./evaluation/index.js";
import { createHubHandler, type HubEvent } from "./hub/hub-handler.js";
import {
  GatewayRegistry,
  CompositeGatewayRuntime,
  DedalusMarketplaceRuntime,
} from "./gateway/index.js";
import type { GatewayRuntime } from "./gateway/index.js";
import { createThoughtboxMarketplaceHttpApp } from "./dedalus-marketplace/http.js";
import type { Logger } from "./types.js";

/**
 * Get the storage backend based on environment configuration.
 *
 * THOUGHTBOX_STORAGE=memory  -> InMemoryStorage (volatile, for testing)
 * THOUGHTBOX_STORAGE=fs      -> FileSystemStorage (persistent, default)
 *
 * THOUGHTBOX_DATA_DIR -> Custom data directory (default: ~/.thoughtbox)
 *
 * Project scope is set via MCP roots or THOUGHTBOX_PROJECT env var.
 */
interface StorageFactory {
  getStorage: (workspaceId?: string) => ThoughtboxStorage;
  getKnowledgeStorage: (workspaceId?: string) => KnowledgeStorage | undefined;
}

interface StorageBundle {
  factory: StorageFactory;
  hubStorage: HubStorage;
  dataDir: string;
}

async function createStorage(): Promise<StorageBundle> {
  const storageType = (process.env.THOUGHTBOX_STORAGE || "fs").toLowerCase();

  // Determine base directory (used for both main and hub storage)
  const baseDir =
    process.env.THOUGHTBOX_DATA_DIR ||
    path.join(os.homedir(), ".thoughtbox");

  if (storageType === "supabase") {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "THOUGHTBOX_STORAGE=supabase requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
      );
    }

    console.error("[Storage] Using Supabase per-session storage factory");

    const factory: StorageFactory = {
      getStorage: (workspaceId?: string) => {
        if (!workspaceId) throw new Error('workspaceId is required for Supabase storage');
        return new SupabaseStorage({ supabaseUrl, serviceRoleKey, workspaceId });
      },
      getKnowledgeStorage: (workspaceId?: string) => {
        if (!workspaceId) throw new Error('workspaceId is required for Supabase knowledge storage');
        return new SupabaseKnowledgeStorage({ supabaseUrl, serviceRoleKey, workspaceId });
      }
    };

    return {
      factory,
      hubStorage: createFileSystemHubStorage(baseDir),
      dataDir: baseDir,
    };
  }

  if (storageType === "memory") {
    console.error("[Storage] Using in-memory storage (volatile)");
    const factory: StorageFactory = {
      getStorage: () => new InMemoryStorage(),
      getKnowledgeStorage: () => undefined,
    };
    return {
      factory,
      hubStorage: createFileSystemHubStorage(baseDir),
      dataDir: baseDir,
    };
  }

  console.error(`[Storage] Using filesystem storage at ${baseDir}`);

  // Base init for FileSystem: config, legacy migration. Done once globally.
  const fsStorage = new FileSystemStorage({
    basePath: baseDir,
    partitionGranularity: "monthly",
  });
  await fsStorage.initialize();

  // Auto-migrate existing exports if any
  try {
    const migrationResult = await migrateExports({
      destDir: baseDir,
      skipExisting: true,
      dryRun: false,
    });
    if (migrationResult.migrated > 0) {
      console.error(
        `[Storage] Migrated ${migrationResult.migrated} sessions from exports`
      );
    }
  } catch (err) {
    console.error("[Storage] Migration check failed (non-fatal):", err);
  }

  const factory: StorageFactory = {
    getStorage: () => new FileSystemStorage({
      basePath: baseDir,
      partitionGranularity: "monthly",
    }),
    getKnowledgeStorage: () => undefined,
  };

  return {
    factory,
    hubStorage: createFileSystemHubStorage(baseDir),
    dataDir: baseDir,
  };
}

async function maybeStartObservatory(hubStorage?: HubStorage, persistentStorage?: ThoughtboxStorage): Promise<ObservatoryServer | null> {
  const observatoryConfig = loadObservatoryConfig();
  if (!observatoryConfig.enabled) return null;

  const observatoryServer = createObservatoryServer({
    _type: 'options',
    config: observatoryConfig,
    hubStorage,
    persistentStorage,
  });
  await observatoryServer.start();
  console.error(`[Observatory] Server started on port ${observatoryConfig.port}`);
  return observatoryServer;
}

async function startHttpServer() {
  const { factory, hubStorage, dataDir } = await createStorage();

  // Provide observatory with a generic un-scoped storage if possible, otherwise it limits functionality
  let observatoryBaseStorage: ThoughtboxStorage | undefined;
  try {
    observatoryBaseStorage = factory.getStorage();
    if (observatoryBaseStorage) {
      await observatoryBaseStorage.initialize();
    }
  } catch (e) {
    // Fails for Supabase without workspaceId, which is fine since Observatory skips persistent reading in MVP
  }

  const observatoryServer = await maybeStartObservatory(hubStorage, observatoryBaseStorage);

  // Initialize LangSmith evaluation tracing (no-op if LANGSMITH_API_KEY not set)
  const traceListener = initEvaluation();
  initMonitoring(traceListener ?? undefined);

  const gatewayLogger: Logger = {
    debug(message, ...args) {
      console.error(`[DEBUG] ${message}`, ...args);
    },
    info(message, ...args) {
      console.error(`[INFO] ${message}`, ...args);
    },
    warn(message, ...args) {
      console.error(`[WARN] ${message}`, ...args);
    },
    error(message, ...args) {
      console.error(`[ERROR] ${message}`, ...args);
    },
  };

  const fileGateway = await GatewayRegistry.fromDefaultManifest(gatewayLogger);

  let gateway: GatewayRuntime = fileGateway;
  const dedalusApiKey = process.env.DEDALUS_API_KEY;
  if (dedalusApiKey) {
    const marketplace = new DedalusMarketplaceRuntime(
      dedalusApiKey,
      gatewayLogger,
    );
    gateway = new CompositeGatewayRuntime([fileGateway, marketplace]);
    await gateway.refresh();
    gatewayLogger.info("[Dedalus] Marketplace integration enabled");
  }

  const app = createThoughtboxMarketplaceHttpApp({ gateway });

  // ---------------------------------------------------------------------------
  // Hub Event SSE Endpoint — pushes HubEvents to Channel subscribers
  // ---------------------------------------------------------------------------

  interface SseClient {
    res: Response;
    workspaceId: string;
  }

  const sseClients = new Set<SseClient>();

  function broadcastHubEvent(event: HubEvent): void {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of sseClients) {
      if (client.workspaceId === event.workspaceId || client.workspaceId === "*") {
        try {
          client.res.write(payload);
        } catch {
          sseClients.delete(client);
        }
      }
    }
  }

  // Minimal thought store for the shared hub-handler (hub operations that
  // create sessions/thoughts use this; most Channel operations don't need it)
  const sharedThoughtStore = {
    sessions: new Map<string, Map<number, unknown>>(),
    async createSession(sessionId: string) {
      this.sessions.set(sessionId, new Map());
    },
    async saveThought(sessionId: string, thought: any) {
      if (!this.sessions.has(sessionId)) this.sessions.set(sessionId, new Map());
      this.sessions.get(sessionId)!.set(thought.thoughtNumber, thought);
    },
    async getThought(sessionId: string, thoughtNumber: number) {
      return this.sessions.get(sessionId)?.get(thoughtNumber) ?? null;
    },
    async getThoughts(sessionId: string) {
      const session = this.sessions.get(sessionId);
      if (!session) return [];
      return [...session.values()];
    },
    async getThoughtCount(sessionId: string) {
      return this.sessions.get(sessionId)?.size ?? 0;
    },
    async saveBranchThought(_sessionId: string, _branchId: string, _thought: any) {},
    async getBranch(_sessionId: string, _branchId: string) { return []; },
  };

  const sharedHubHandler = createHubHandler(
    hubStorage,
    sharedThoughtStore,
    broadcastHubEvent,
  );

  app.get("/hub/events", (req: Request, res: Response) => {
    const workspaceId = (req.query.workspace_id as string) || "*";

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write(": connected\n\n");

    const client: SseClient = { res, workspaceId };
    sseClients.add(client);

    req.on("close", () => {
      sseClients.delete(client);
    });
  });

  // ---------------------------------------------------------------------------
  // Hub API Endpoint — direct Hub operations for Channel reply tools
  // ---------------------------------------------------------------------------

  app.post("/hub/api", async (req: Request, res: Response) => {
    try {
      const { operation, agentId, ...args } = req.body as {
        operation: string;
        agentId?: string;
        [key: string]: unknown;
      };

      if (!operation) {
        res.status(400).json({ error: "operation is required" });
        return;
      }

      const result = await sharedHubHandler.handle(
        agentId ?? null,
        operation,
        args as Record<string, any>,
      );

      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: message });
    }
  });

  const port = parseInt(process.env.PORT || "1731", 10);
  const httpServer = app.listen(port, () => {
    console.log(`Thoughtbox MCP Server listening on port ${port}`);
  });

  const shutdown = async () => {
    await Promise.allSettled([gateway.close()]);
    if (observatoryServer?.isRunning()) {
      try {
        await observatoryServer.stop();
      } catch {
        // ignore
      }
    }
    httpServer.close(() => process.exit(0));
  };

  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());
}

startHttpServer().catch((error) => {
  console.error("Fatal error starting HTTP server:", error);
  process.exit(1);
});
