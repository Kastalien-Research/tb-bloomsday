/**
 * Knowledge storage stub — SQLite implementation removed.
 * Not needed for the Marketplace gateway deployment.
 */

import type {
  KnowledgeStorage,
  Entity,
  Relation,
  Observation,
  CreateEntityParams,
  CreateRelationParams,
  AddObservationParams,
  EntityFilter,
  GraphTraversalParams,
  GraphTraversalResult,
  KnowledgeStats,
} from './types.js';

export interface KnowledgeStorageOptions {
  basePath?: string;
}

export class FileSystemKnowledgeStorage implements KnowledgeStorage {
  constructor(_options?: KnowledgeStorageOptions) { this.notAvailable(); }

  private notAvailable(): never {
    throw new Error('FileSystemKnowledgeStorage is not available in this deployment.');
  }

  async initialize(): Promise<void> { this.notAvailable(); }
  async setProject(_project: string): Promise<void> { this.notAvailable(); }
  async createEntity(_params: CreateEntityParams): Promise<Entity> { this.notAvailable(); }
  async getEntity(_id: string): Promise<Entity | null> { this.notAvailable(); }
  async listEntities(_filter?: EntityFilter): Promise<Entity[]> { this.notAvailable(); }
  async deleteEntity(_id: string): Promise<void> { this.notAvailable(); }
  async createRelation(_params: CreateRelationParams): Promise<Relation> { this.notAvailable(); }
  async getRelationsFrom(_entityId: string, _types?: string[]): Promise<Relation[]> { this.notAvailable(); }
  async getRelationsTo(_entityId: string, _types?: string[]): Promise<Relation[]> { this.notAvailable(); }
  async deleteRelation(_id: string): Promise<void> { this.notAvailable(); }
  async addObservation(_params: AddObservationParams): Promise<Observation> { this.notAvailable(); }
  async getObservations(_entityId: string): Promise<Observation[]> { this.notAvailable(); }
  async traverseGraph(_params: GraphTraversalParams): Promise<GraphTraversalResult> { this.notAvailable(); }
  async getStats(): Promise<KnowledgeStats> { this.notAvailable(); }
  async rebuildIndexFromJsonl(): Promise<void> { this.notAvailable(); }
}
