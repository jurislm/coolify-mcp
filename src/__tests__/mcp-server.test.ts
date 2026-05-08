/**
 * MCP Server Tests v2.0.0
 *
 * Tests for the consolidated MCP tool layer.
 * CoolifyClient methods are fully tested in coolify-client.test.ts (174 tests).
 * These tests verify MCP server instantiation and structure.
 */
import { createRequire } from 'module';
import { describe, it, expect, beforeEach, jest } from 'bun:test';
import {
  CoolifyMcpServer,
  VERSION,
  truncateLogs,
  getApplicationActions,
  getDeploymentActions,
  getPagination,
} from '../lib/mcp-server.js';
import { CoolifyClient } from '../lib/coolify-client.js';
import type {
  Server,
  Application,
  Database,
  UuidResponse,
  MessageResponse,
  ApplicationActionResponse,
  GitHubAppUpdateResponse,
  BatchOperationResult,
  CloudTokenValidation,
  HetznerLocation,
  HetznerServerType,
  HetznerImage,
  HetznerSSHKey,
  CreateHetznerServerResponse,
} from '../types/coolify.js';

type RegisteredToolMap = Record<
  string,
  { handler: (args: Record<string, unknown>) => Promise<unknown> }
>;

class TestableMcpServer extends CoolifyMcpServer {
  getClient(): CoolifyClient {
    return this.client;
  }

  /** Access a registered MCP tool handler by name for dispatch testing. */
  getHandler(toolName: string): ((args: Record<string, unknown>) => Promise<unknown>) | undefined {
    const tools = (this as unknown as { _registeredTools: RegisteredToolMap })['_registeredTools'];
    return tools[toolName]?.handler;
  }
}

describe('CoolifyMcpServer v2', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  describe('constructor', () => {
    it('should create server instance', () => {
      expect(server).toBeInstanceOf(CoolifyMcpServer);
    });

    it('should be an MCP server with connect method', () => {
      expect(typeof server.connect).toBe('function');
    });

    it('should report version matching package.json', () => {
      const _require = createRequire(import.meta.url);
      const { version } = _require('../../package.json');
      expect(VERSION).toBe(version);
    });
  });

  describe('client', () => {
    it('should have client instance', () => {
      const client = server['client'];
      expect(client).toBeDefined();
    });

    it('should have all required client methods', () => {
      const client = server['client'];

      // Core methods
      expect(typeof client.getVersion).toBe('function');

      // Server operations
      expect(typeof client.listServers).toBe('function');
      expect(typeof client.getServer).toBe('function');
      expect(typeof client.createServer).toBe('function');
      expect(typeof client.updateServer).toBe('function');
      expect(typeof client.deleteServer).toBe('function');
      expect(typeof client.getServerResources).toBe('function');
      expect(typeof client.getServerDomains).toBe('function');
      expect(typeof client.validateServer).toBe('function');

      // Team operations
      expect(typeof client.listTeams).toBe('function');
      expect(typeof client.getCurrentTeam).toBe('function');
      expect(typeof client.getCurrentTeamMembers).toBe('function');
      expect(typeof client.getTeam).toBe('function');
      expect(typeof client.getTeamMembers).toBe('function');

      // Project operations
      expect(typeof client.listProjects).toBe('function');
      expect(typeof client.getProject).toBe('function');
      expect(typeof client.createProject).toBe('function');
      expect(typeof client.updateProject).toBe('function');
      expect(typeof client.deleteProject).toBe('function');

      // Environment operations
      expect(typeof client.listProjectEnvironments).toBe('function');
      expect(typeof client.getProjectEnvironment).toBe('function');
      expect(typeof client.getProjectEnvironmentWithDatabases).toBe('function');
      expect(typeof client.createProjectEnvironment).toBe('function');
      expect(typeof client.deleteProjectEnvironment).toBe('function');

      // Application operations
      expect(typeof client.listApplications).toBe('function');
      expect(typeof client.getApplication).toBe('function');
      expect(typeof client.createApplicationPublic).toBe('function');
      expect(typeof client.createApplicationPrivateGH).toBe('function');
      expect(typeof client.createApplicationPrivateKey).toBe('function');
      expect(typeof client.createApplicationDockerfile).toBe('function');
      expect(typeof client.createApplicationDockerImage).toBe('function');
      expect(typeof client.updateApplication).toBe('function');
      expect(typeof client.deleteApplication).toBe('function');
      expect(typeof client.getApplicationLogs).toBe('function');

      // Control operations
      expect(typeof client.startApplication).toBe('function');
      expect(typeof client.stopApplication).toBe('function');
      expect(typeof client.restartApplication).toBe('function');
      expect(typeof client.startDatabase).toBe('function');
      expect(typeof client.stopDatabase).toBe('function');
      expect(typeof client.restartDatabase).toBe('function');
      expect(typeof client.startService).toBe('function');
      expect(typeof client.stopService).toBe('function');
      expect(typeof client.restartService).toBe('function');

      // Database operations
      expect(typeof client.listDatabases).toBe('function');
      expect(typeof client.getDatabase).toBe('function');
      expect(typeof client.updateDatabase).toBe('function');
      expect(typeof client.deleteDatabase).toBe('function');
      expect(typeof client.createPostgresql).toBe('function');
      expect(typeof client.createMysql).toBe('function');
      expect(typeof client.createMariadb).toBe('function');
      expect(typeof client.createMongodb).toBe('function');
      expect(typeof client.createRedis).toBe('function');
      expect(typeof client.createKeydb).toBe('function');
      expect(typeof client.createClickhouse).toBe('function');
      expect(typeof client.createDragonfly).toBe('function');

      // Service operations
      expect(typeof client.listServices).toBe('function');
      expect(typeof client.getService).toBe('function');
      expect(typeof client.createService).toBe('function');
      expect(typeof client.updateService).toBe('function');
      expect(typeof client.deleteService).toBe('function');

      // Environment variable operations
      expect(typeof client.listApplicationEnvVars).toBe('function');
      expect(typeof client.createApplicationEnvVar).toBe('function');
      expect(typeof client.updateApplicationEnvVar).toBe('function');
      expect(typeof client.deleteApplicationEnvVar).toBe('function');
      expect(typeof client.listServiceEnvVars).toBe('function');
      expect(typeof client.createServiceEnvVar).toBe('function');
      expect(typeof client.deleteServiceEnvVar).toBe('function');
      expect(typeof client.listDatabaseEnvVars).toBe('function');
      expect(typeof client.createDatabaseEnvVar).toBe('function');
      expect(typeof client.updateDatabaseEnvVar).toBe('function');
      expect(typeof client.bulkUpdateDatabaseEnvVars).toBe('function');
      expect(typeof client.deleteDatabaseEnvVar).toBe('function');

      // Deployment operations
      expect(typeof client.listDeployments).toBe('function');
      expect(typeof client.getDeployment).toBe('function');
      expect(typeof client.deployByTagOrUuid).toBe('function');
      expect(typeof client.listApplicationDeployments).toBe('function');
      expect(typeof client.cancelDeployment).toBe('function');

      // Private key operations
      expect(typeof client.listPrivateKeys).toBe('function');
      expect(typeof client.getPrivateKey).toBe('function');
      expect(typeof client.createPrivateKey).toBe('function');
      expect(typeof client.updatePrivateKey).toBe('function');
      expect(typeof client.deletePrivateKey).toBe('function');

      // GitHub App operations
      expect(typeof client.listGitHubApps).toBe('function');
      expect(typeof client.createGitHubApp).toBe('function');
      expect(typeof client.updateGitHubApp).toBe('function');
      expect(typeof client.deleteGitHubApp).toBe('function');
      expect(typeof client.listGitHubAppRepositories).toBe('function');
      expect(typeof client.listGitHubAppBranches).toBe('function');

      // Backup operations
      expect(typeof client.listDatabaseBackups).toBe('function');
      expect(typeof client.getDatabaseBackup).toBe('function');
      expect(typeof client.createDatabaseBackup).toBe('function');
      expect(typeof client.updateDatabaseBackup).toBe('function');
      expect(typeof client.deleteDatabaseBackup).toBe('function');
      expect(typeof client.listBackupExecutions).toBe('function');
      expect(typeof client.getBackupExecution).toBe('function');
      expect(typeof client.deleteBackupExecution).toBe('function');

      // Scheduled task operations
      expect(typeof client.listApplicationScheduledTasks).toBe('function');
      expect(typeof client.createApplicationScheduledTask).toBe('function');
      expect(typeof client.updateApplicationScheduledTask).toBe('function');
      expect(typeof client.deleteApplicationScheduledTask).toBe('function');
      expect(typeof client.listApplicationScheduledTaskExecutions).toBe('function');
      expect(typeof client.listServiceScheduledTasks).toBe('function');
      expect(typeof client.createServiceScheduledTask).toBe('function');
      expect(typeof client.updateServiceScheduledTask).toBe('function');
      expect(typeof client.deleteServiceScheduledTask).toBe('function');
      expect(typeof client.listServiceScheduledTaskExecutions).toBe('function');

      // Storage operations
      expect(typeof client.listApplicationStorages).toBe('function');
      expect(typeof client.createApplicationStorage).toBe('function');
      expect(typeof client.updateApplicationStorage).toBe('function');
      expect(typeof client.deleteApplicationStorage).toBe('function');
      expect(typeof client.listDatabaseStorages).toBe('function');
      expect(typeof client.createDatabaseStorage).toBe('function');
      expect(typeof client.updateDatabaseStorage).toBe('function');
      expect(typeof client.deleteDatabaseStorage).toBe('function');
      expect(typeof client.listServiceStorages).toBe('function');
      expect(typeof client.createServiceStorage).toBe('function');
      expect(typeof client.updateServiceStorage).toBe('function');
      expect(typeof client.deleteServiceStorage).toBe('function');

      // Cloud token operations
      expect(typeof client.listCloudTokens).toBe('function');
      expect(typeof client.getCloudToken).toBe('function');
      expect(typeof client.createCloudToken).toBe('function');
      expect(typeof client.updateCloudToken).toBe('function');
      expect(typeof client.deleteCloudToken).toBe('function');
      expect(typeof client.validateCloudToken).toBe('function');

      // Diagnostic operations
      expect(typeof client.diagnoseApplication).toBe('function');
      expect(typeof client.diagnoseServer).toBe('function');
      expect(typeof client.findInfrastructureIssues).toBe('function');

      // Batch operations
      expect(typeof client.restartProjectApps).toBe('function');
      expect(typeof client.bulkEnvUpdate).toBe('function');
      expect(typeof client.stopAllApps).toBe('function');
      expect(typeof client.redeployProjectApps).toBe('function');
      // Hetzner endpoints
      expect(typeof client.getHetznerLocations).toBe('function');
      expect(typeof client.getHetznerServerTypes).toBe('function');
      expect(typeof client.getHetznerImages).toBe('function');
      expect(typeof client.getHetznerSSHKeys).toBe('function');
      expect(typeof client.createHetznerServer).toBe('function');
      // Service bulk env vars
      expect(typeof client.bulkUpdateServiceEnvVars).toBe('function');
      // Resources aggregation
      expect(typeof client.listResources).toBe('function');
      // Health check
      expect(typeof client.getHealth).toBe('function');
      // Application preview
      expect(typeof client.deleteApplicationPreview).toBe('function');
      // API control
      expect(typeof client.enableApi).toBe('function');
      expect(typeof client.disableApi).toBe('function');
    });
  });

  describe('server configuration', () => {
    it('should store baseUrl and accessToken in client', () => {
      const client = server['client'];
      // CoolifyClient stores base URL without /api/v1 suffix
      expect(client['baseUrl']).toBe('http://localhost:3000');
      expect(client['accessToken']).toBe('test-token');
    });
  });
});

describe('truncateLogs', () => {
  it('should return logs unchanged when within limits', () => {
    const logs = 'line1\nline2\nline3';
    const result = truncateLogs(logs, 200, 50000);
    expect(result).toBe(logs);
  });

  it('should truncate to last N lines', () => {
    const logs = 'line1\nline2\nline3\nline4\nline5';
    const result = truncateLogs(logs, 3, 50000);
    expect(result).toBe('line3\nline4\nline5');
  });

  it('should truncate by character limit when lines are huge', () => {
    const hugeLine = 'x'.repeat(100);
    const logs = `${hugeLine}\n${hugeLine}\n${hugeLine}`;
    const result = truncateLogs(logs, 200, 50);
    expect(result.length).toBeLessThanOrEqual(50);
    expect(result.startsWith('...[truncated]...')).toBe(true);
  });

  it('should not add truncation prefix when under char limit', () => {
    const logs = 'line1\nline2\nline3';
    const result = truncateLogs(logs, 200, 50000);
    expect(result.startsWith('...[truncated]...')).toBe(false);
  });

  it('should handle empty logs', () => {
    const result = truncateLogs('', 200, 50000);
    expect(result).toBe('');
  });

  it('should use default limits when not specified', () => {
    const logs = 'line1\nline2';
    const result = truncateLogs(logs);
    expect(result).toBe(logs);
  });

  it('should respect custom line limit', () => {
    const lines = Array.from({ length: 300 }, (_, i) => `line${i + 1}`).join('\n');
    const result = truncateLogs(lines, 50, 50000);
    const resultLines = result.split('\n');
    expect(resultLines.length).toBe(50);
    expect(resultLines[0]).toBe('line251');
    expect(resultLines[49]).toBe('line300');
  });

  it('should respect custom char limit', () => {
    const logs = 'x'.repeat(1000);
    const result = truncateLogs(logs, 200, 100);
    expect(result.length).toBe(100);
  });
});

// =============================================================================
// Action Generators Tests
// =============================================================================

describe('getApplicationActions', () => {
  it('should return view logs action for all apps', () => {
    const actions = getApplicationActions('app-uuid', 'stopped');
    expect(actions).toContainEqual({
      tool: 'application_logs',
      args: { uuid: 'app-uuid' },
      hint: 'View logs',
    });
  });

  it('should return restart/stop actions for running apps', () => {
    const actions = getApplicationActions('app-uuid', 'running');
    expect(actions).toContainEqual({
      tool: 'control',
      args: { resource: 'application', action: 'restart', uuid: 'app-uuid' },
      hint: 'Restart',
    });
    expect(actions).toContainEqual({
      tool: 'control',
      args: { resource: 'application', action: 'stop', uuid: 'app-uuid' },
      hint: 'Stop',
    });
  });

  it('should return start action for stopped apps', () => {
    const actions = getApplicationActions('app-uuid', 'stopped');
    expect(actions).toContainEqual({
      tool: 'control',
      args: { resource: 'application', action: 'start', uuid: 'app-uuid' },
      hint: 'Start',
    });
  });

  it('should handle running:healthy status', () => {
    const actions = getApplicationActions('app-uuid', 'running:healthy');
    expect(actions.some((a) => a.hint === 'Restart')).toBe(true);
    expect(actions.some((a) => a.hint === 'Stop')).toBe(true);
  });

  it('should handle undefined status', () => {
    const actions = getApplicationActions('app-uuid', undefined);
    expect(actions).toContainEqual({
      tool: 'control',
      args: { resource: 'application', action: 'start', uuid: 'app-uuid' },
      hint: 'Start',
    });
  });
});

describe('getDeploymentActions', () => {
  it('should return cancel action for in_progress deployments', () => {
    const actions = getDeploymentActions('dep-uuid', 'in_progress', 'app-uuid');
    expect(actions).toContainEqual({
      tool: 'deployment',
      args: { action: 'cancel', uuid: 'dep-uuid' },
      hint: 'Cancel',
    });
  });

  it('should return cancel action for queued deployments', () => {
    const actions = getDeploymentActions('dep-uuid', 'queued', 'app-uuid');
    expect(actions).toContainEqual({
      tool: 'deployment',
      args: { action: 'cancel', uuid: 'dep-uuid' },
      hint: 'Cancel',
    });
  });

  it('should return app actions when appUuid provided', () => {
    const actions = getDeploymentActions('dep-uuid', 'finished', 'app-uuid');
    expect(actions).toContainEqual({
      tool: 'get_application',
      args: { uuid: 'app-uuid' },
      hint: 'View app',
    });
    expect(actions).toContainEqual({
      tool: 'application_logs',
      args: { uuid: 'app-uuid' },
      hint: 'App logs',
    });
  });

  it('should not return cancel for finished deployments', () => {
    const actions = getDeploymentActions('dep-uuid', 'finished', 'app-uuid');
    expect(actions.some((a) => a.hint === 'Cancel')).toBe(false);
  });

  it('should return empty actions when no appUuid and not in_progress', () => {
    const actions = getDeploymentActions('dep-uuid', 'finished', undefined);
    expect(actions).toEqual([]);
  });
});

describe('getPagination', () => {
  it('should return undefined when count is less than perPage and page is 1', () => {
    const result = getPagination('list_apps', 1, 50, 30);
    expect(result).toBeUndefined();
  });

  it('should return next when count equals or exceeds perPage', () => {
    const result = getPagination('list_apps', 1, 50, 50);
    expect(result).toEqual({
      next: { tool: 'list_apps', args: { page: 2, per_page: 50 } },
    });
  });

  it('should return both prev and next for middle pages', () => {
    const result = getPagination('list_apps', 2, 50, 50);
    expect(result).toEqual({
      prev: { tool: 'list_apps', args: { page: 1, per_page: 50 } },
      next: { tool: 'list_apps', args: { page: 3, per_page: 50 } },
    });
  });

  it('should return prev when page > 1 and count < perPage', () => {
    const result = getPagination('list_apps', 3, 50, 20);
    expect(result).toEqual({
      prev: { tool: 'list_apps', args: { page: 2, per_page: 50 } },
    });
  });

  it('should use default page and perPage when undefined', () => {
    const result = getPagination('list_apps', undefined, undefined, 100);
    expect(result).toEqual({
      next: { tool: 'list_apps', args: { page: 2, per_page: 50 } },
    });
  });

  it('should return undefined when count is undefined', () => {
    const result = getPagination('list_apps', 1, 50, undefined);
    expect(result).toBeUndefined();
  });
});

// =============================================================================
// Update Handler Allowlist Tests (RED phase — verify create-only fields excluded)
// =============================================================================

/**
 * Helper to invoke a registered tool handler directly.
 * Bypasses MCP transport layer; args are passed as plain object.
 */
async function callHandler(
  server: TestableMcpServer,
  toolName: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const handler = server.getHandler(toolName);
  if (!handler) throw new Error(`Tool "${toolName}" not registered`);
  return handler(args);
}

describe('update handler allowlist — create-only fields must not be forwarded', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  describe('server update', () => {
    it('should not forward instant_validate to updateServer', async () => {
      const spy = jest.spyOn(server.getClient(), 'updateServer').mockResolvedValue({} as Server);
      await callHandler(server, 'server', {
        action: 'update',
        uuid: 'srv-uuid',
        name: 'my-server',
        instant_validate: true,
      });
      expect(spy).toHaveBeenCalledTimes(1);
      const [, updatePayload] = spy.mock.calls[0] as [string, Record<string, unknown>];
      expect(updatePayload).not.toHaveProperty('instant_validate');
      expect(updatePayload).toHaveProperty('name', 'my-server');
    });
  });

  describe('server create handler dispatch', () => {
    it('should return error when create missing required fields', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'createServer')
        .mockResolvedValue({ uuid: 'mock-uuid' } as UuidResponse);
      const result = (await callHandler(server, 'server', {
        action: 'create',
        name: 'my-server',
        // missing ip and private_key_uuid
      })) as { content: Array<{ text: string }> };
      expect(result.content[0].text).toContain('Error');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call createServer with valid args', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'createServer')
        .mockResolvedValue({ uuid: 'mock-uuid' } as UuidResponse);
      await callHandler(server, 'server', {
        action: 'create',
        name: 'my-server',
        ip: '1.2.3.4',
        private_key_uuid: 'key-uuid',
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('server delete handler dispatch', () => {
    it('should call deleteServer with uuid', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'deleteServer')
        .mockResolvedValue({ message: 'ok' } as MessageResponse);
      await callHandler(server, 'server', {
        action: 'delete',
        uuid: 'srv-uuid',
      });
      expect(spy).toHaveBeenCalledWith('srv-uuid', undefined);
    });
  });

  describe('application update', () => {
    it('should not forward project_uuid to updateApplication', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'updateApplication')
        .mockResolvedValue({} as Application);
      await callHandler(server, 'application', {
        action: 'update',
        uuid: 'app-uuid',
        name: 'my-app',
        project_uuid: 'proj-123',
      });
      expect(spy).toHaveBeenCalledTimes(1);
      const [, updatePayload] = spy.mock.calls[0] as [string, Record<string, unknown>];
      expect(updatePayload).not.toHaveProperty('project_uuid');
      expect(updatePayload).toHaveProperty('name', 'my-app');
    });

    it('should not forward server_uuid to updateApplication', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'updateApplication')
        .mockResolvedValue({} as Application);
      await callHandler(server, 'application', {
        action: 'update',
        uuid: 'app-uuid',
        fqdn: 'https://app.example.com',
        server_uuid: 'srv-456',
      });
      expect(spy).toHaveBeenCalledTimes(1);
      const [, updatePayload] = spy.mock.calls[0] as [string, Record<string, unknown>];
      expect(updatePayload).not.toHaveProperty('server_uuid');
      expect(updatePayload).toHaveProperty('fqdn', 'https://app.example.com');
    });
  });

  describe('database update', () => {
    it('should not forward server_uuid to updateDatabase', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'updateDatabase')
        .mockResolvedValue({} as Database);
      await callHandler(server, 'database', {
        action: 'update',
        uuid: 'db-uuid',
        name: 'my-db',
        server_uuid: 'srv-789',
      });
      expect(spy).toHaveBeenCalledTimes(1);
      const [, updatePayload] = spy.mock.calls[0] as [string, Record<string, unknown>];
      expect(updatePayload).not.toHaveProperty('server_uuid');
      expect(updatePayload).toHaveProperty('name', 'my-db');
    });

    it('should not forward project_uuid to updateDatabase', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'updateDatabase')
        .mockResolvedValue({} as Database);
      await callHandler(server, 'database', {
        action: 'update',
        uuid: 'db-uuid',
        description: 'my desc',
        project_uuid: 'proj-abc',
      });
      expect(spy).toHaveBeenCalledTimes(1);
      const [, updatePayload] = spy.mock.calls[0] as [string, Record<string, unknown>];
      expect(updatePayload).not.toHaveProperty('project_uuid');
      expect(updatePayload).toHaveProperty('description', 'my desc');
    });
  });

  describe('github_apps update', () => {
    // github_apps has no create-only fields to exclude; this test verifies
    // that all valid update fields are forwarded via the allowlist.
    it('should call updateGitHubApp with update fields', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'updateGitHubApp')
        .mockResolvedValue({ message: 'ok', data: {} } as GitHubAppUpdateResponse);
      await callHandler(server, 'github_apps', {
        action: 'update',
        id: 42,
        name: 'my-github-app',
        organization: 'my-org',
      });
      expect(spy).toHaveBeenCalledTimes(1);
      const [id, updatePayload] = spy.mock.calls[0] as [number, Record<string, unknown>];
      expect(id).toBe(42);
      expect(updatePayload).toHaveProperty('name', 'my-github-app');
      expect(updatePayload).toHaveProperty('organization', 'my-org');
    });

    it('should not forward server_uuid or project_uuid to updateGitHubApp', async () => {
      const spy = jest
        .spyOn(server.getClient(), 'updateGitHubApp')
        .mockResolvedValue({ message: 'ok', data: {} } as GitHubAppUpdateResponse);
      await callHandler(server, 'github_apps', {
        action: 'update',
        id: 42,
        name: 'test-app',
      });
      expect(spy).toHaveBeenCalledTimes(1);
      const [, updatePayload] = spy.mock.calls[0] as [number, Record<string, unknown>];
      expect(updatePayload).not.toHaveProperty('server_uuid');
      expect(updatePayload).not.toHaveProperty('project_uuid');
      expect(updatePayload).toHaveProperty('name', 'test-app');
    });
  });
});

describe('application create_dockerfile handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should call createApplicationDockerfile with correct args', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createApplicationDockerfile')
      .mockResolvedValue({ uuid: 'new-app-uuid' });
    await callHandler(server, 'application', {
      action: 'create_dockerfile',
      project_uuid: 'proj-uuid',
      server_uuid: 'server-uuid',
      dockerfile: 'FROM node:18',
      ports_exposes: '3000',
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return error when required fields missing for create_dockerfile', async () => {
    const result = (await callHandler(server, 'application', {
      action: 'create_dockerfile',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('required');
  });

  it('should forward instant_deploy in create_dockerimage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createApplicationDockerImage')
      .mockResolvedValue({ uuid: 'new-app-uuid' });
    await callHandler(server, 'application', {
      action: 'create_dockerimage',
      project_uuid: 'proj-uuid',
      server_uuid: 'server-uuid',
      docker_registry_image_name: 'nginx',
      ports_exposes: '80',
      instant_deploy: true,
    });
    expect(spy).toHaveBeenCalledTimes(1);
    const [payload] = spy.mock.calls[0] as unknown as [Record<string, unknown>];
    expect(payload).toHaveProperty('instant_deploy', true);
  });
});

describe('env_vars bulk_create service', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should return error when bulk_data is missing for service bulk_create', async () => {
    const result = (await callHandler(server, 'env_vars', {
      resource: 'service',
      action: 'bulk_create',
      uuid: 'svc-uuid',
      // bulk_data intentionally omitted
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('bulk_data required');
  });

  it('should call bulkUpdateServiceEnvVars for service bulk_create success path', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'bulkUpdateServiceEnvVars')
      .mockResolvedValue({ message: 'Updated' } as MessageResponse);
    await callHandler(server, 'env_vars', {
      resource: 'service',
      action: 'bulk_create',
      uuid: 'svc-uuid',
      bulk_data: [{ key: 'FOO', value: 'bar' }],
    });
    expect(spy).toHaveBeenCalledWith('svc-uuid', { data: [{ key: 'FOO', value: 'bar' }] });
  });
});

describe('stop_all_apps confirmation', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should call stopAllApps when confirm_stop_all_apps=true', async () => {
    const spy = jest.spyOn(server.getClient(), 'stopAllApps').mockResolvedValue({
      summary: { total: 0, succeeded: 0, failed: 0 },
      succeeded: [],
      failed: [],
    } as BatchOperationResult);
    await callHandler(server, 'stop_all_apps', { confirm_stop_all_apps: true });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return error and not call stopAllApps when confirm_stop_all_apps=false', async () => {
    const spy = jest.spyOn(server.getClient(), 'stopAllApps').mockResolvedValue({
      summary: { total: 0, succeeded: 0, failed: 0 },
      succeeded: [],
      failed: [],
    } as BatchOperationResult);
    const result = (await callHandler(server, 'stop_all_apps', {
      confirm_stop_all_apps: false,
    })) as { content: Array<{ text: string }> };
    expect(spy).not.toHaveBeenCalled();
    expect(result.content[0].text).toContain('confirm_stop_all_apps=true required');
  });
});

describe('cloud_tokens handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('should return error when create missing required fields', async () => {
    const result = (await callHandler(server, 'cloud_tokens', {
      action: 'create',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('required');
  });

  it('should return error when update missing uuid', async () => {
    const result = (await callHandler(server, 'cloud_tokens', {
      action: 'update',
      name: 'new-name',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('required');
  });

  it('should route validate to validateCloudToken', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'validateCloudToken')
      .mockResolvedValue({ valid: true, message: 'ok' } as CloudTokenValidation);
    await callHandler(server, 'cloud_tokens', { action: 'validate', uuid: 'token-uuid' });
    expect(spy).toHaveBeenCalledWith('token-uuid');
  });
});

describe('scheduled_tasks handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('should return error when create missing required fields', async () => {
    const result = (await callHandler(server, 'scheduled_tasks', {
      action: 'create',
      resource_type: 'application',
      uuid: 'app-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('required');
  });

  it('should return error when update has no updatable fields', async () => {
    const result = (await callHandler(server, 'scheduled_tasks', {
      action: 'update',
      resource_type: 'application',
      uuid: 'app-uuid',
      task_uuid: 'task-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('at least one field required');
  });

  it('should return error when list_executions missing task_uuid', async () => {
    const result = (await callHandler(server, 'scheduled_tasks', {
      action: 'list_executions',
      resource_type: 'application',
      uuid: 'app-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('required');
  });
});

describe('list_resources handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('should call listResources when invoked', async () => {
    const spy = jest.spyOn(server.getClient(), 'listResources').mockResolvedValue([]);
    await callHandler(server, 'list_resources', {});
    expect(spy).toHaveBeenCalled();
  });
});

describe('health handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('should call getHealth when invoked', async () => {
    const spy = jest.spyOn(server.getClient(), 'getHealth').mockResolvedValue({ status: 'OK' });
    await callHandler(server, 'health', {});
    expect(spy).toHaveBeenCalled();
  });
});

describe('deploy pr parameter dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('should pass pr to deployByTagOrUuid when provided', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deployByTagOrUuid')
      .mockResolvedValue({ message: 'Deploying' } as MessageResponse);
    await callHandler(server, 'deploy', { tag_or_uuid: 'app-uuid', pr: 42 });
    expect(spy).toHaveBeenCalledWith('app-uuid', undefined, 42, undefined);
  });

  it('should pass undefined pr when not provided', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deployByTagOrUuid')
      .mockResolvedValue({ message: 'Deploying' } as MessageResponse);
    await callHandler(server, 'deploy', { tag_or_uuid: 'app-uuid' });
    expect(spy).toHaveBeenCalledWith('app-uuid', undefined, undefined, undefined);
  });
});

describe('hetzner handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('should route locations action to getHetznerLocations', async () => {
    const mockLocations: HetznerLocation[] = [
      {
        id: 1,
        name: 'nbg1',
        description: 'Nuremberg',
        country: 'DE',
        city: 'Nuremberg',
        latitude: 49,
        longitude: 11,
      },
    ];
    const spy = jest
      .spyOn(server.getClient(), 'getHetznerLocations')
      .mockResolvedValue(mockLocations);
    await callHandler(server, 'hetzner', { action: 'locations' });
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it('should route server_types action to getHetznerServerTypes', async () => {
    const mockTypes: HetznerServerType[] = [
      { id: 1, name: 'cx11', description: 'CX11', cores: 1, memory: 2, disk: 20 },
    ];
    const spy = jest
      .spyOn(server.getClient(), 'getHetznerServerTypes')
      .mockResolvedValue(mockTypes);
    await callHandler(server, 'hetzner', { action: 'server_types' });
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it('should route images action to getHetznerImages', async () => {
    const mockImages: HetznerImage[] = [
      {
        id: 1,
        name: 'ubuntu-22.04',
        description: 'Ubuntu 22.04',
        type: 'system',
        os_flavor: 'ubuntu',
        os_version: '22.04',
        architecture: 'x86',
      },
    ];
    const spy = jest.spyOn(server.getClient(), 'getHetznerImages').mockResolvedValue(mockImages);
    await callHandler(server, 'hetzner', { action: 'images' });
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it('should route ssh_keys action to getHetznerSSHKeys', async () => {
    const mockKeys: HetznerSSHKey[] = [
      { id: 1, name: 'my-key', fingerprint: 'ab:cd', public_key: 'ssh-rsa AAAA' },
    ];
    const spy = jest.spyOn(server.getClient(), 'getHetznerSSHKeys').mockResolvedValue(mockKeys);
    await callHandler(server, 'hetzner', { action: 'ssh_keys' });
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it('should return error for create_server when required fields missing', async () => {
    const result = (await callHandler(server, 'hetzner', {
      action: 'create_server',
      location: 'nbg1',
      // server_type, image, private_key_uuid intentionally omitted
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('required');
  });

  it('should route create_server action to createHetznerServer', async () => {
    const mockResponse: CreateHetznerServerResponse = {
      uuid: 'srv-uuid',
      hetzner_server_id: 12345,
      ip: '1.2.3.4',
    };
    const spy = jest
      .spyOn(server.getClient(), 'createHetznerServer')
      .mockResolvedValue(mockResponse);
    await callHandler(server, 'hetzner', {
      action: 'create_server',
      location: 'nbg1',
      server_type: 'cx11',
      image: 67890,
      private_key_uuid: 'key-uuid',
    });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        location: 'nbg1',
        server_type: 'cx11',
        image: 67890,
        private_key_uuid: 'key-uuid',
      }),
    );
  });
});

// =============================================================================
// align-coolify-api-fields: New parameter tests
// =============================================================================

describe('env_vars with comment field', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should pass comment and runtime fields to createApplicationEnvVar', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createApplicationEnvVar')
      .mockResolvedValue({ uuid: 'env-uuid' } as UuidResponse);
    await callHandler(server, 'env_vars', {
      resource: 'application',
      action: 'create',
      uuid: 'app-uuid',
      key: 'DB_URL',
      value: 'postgres://...',
      comment: 'Production DB',
      is_runtime: true,
      is_buildtime: false,
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', {
      key: 'DB_URL',
      value: 'postgres://...',
      comment: 'Production DB',
      is_runtime: true,
      is_buildtime: false,
    });
  });

  it('should pass comment and runtime fields to updateApplicationEnvVar', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'updateApplicationEnvVar')
      .mockResolvedValue({ message: 'Updated' } as MessageResponse);
    await callHandler(server, 'env_vars', {
      resource: 'application',
      action: 'update',
      uuid: 'app-uuid',
      key: 'DB_URL',
      value: 'postgres://new',
      comment: 'Updated comment',
      is_runtime: false,
      is_buildtime: true,
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', {
      key: 'DB_URL',
      value: 'postgres://new',
      comment: 'Updated comment',
      is_runtime: false,
      is_buildtime: true,
    });
  });
});

describe('control stop with docker_cleanup', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should pass dockerCleanup option to stopApplication', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'stopApplication')
      .mockResolvedValue({ message: 'Stopped' } as ApplicationActionResponse);
    await callHandler(server, 'control', {
      resource: 'application',
      action: 'stop',
      uuid: 'app-uuid',
      docker_cleanup: false,
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', { dockerCleanup: false });
  });

  it('should not pass stopOpts when docker_cleanup is undefined', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'stopApplication')
      .mockResolvedValue({ message: 'Stopped' } as ApplicationActionResponse);
    await callHandler(server, 'control', {
      resource: 'application',
      action: 'stop',
      uuid: 'app-uuid',
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', undefined);
  });
});

describe('server delete with force', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should pass force option to deleteServer', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteServer')
      .mockResolvedValue({ message: 'ok' } as MessageResponse);
    await callHandler(server, 'server', {
      action: 'delete',
      uuid: 'srv-uuid',
      force: true,
    });
    expect(spy).toHaveBeenCalledWith('srv-uuid', { force: true });
  });
});

describe('application update with extended fields', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should pass extended fields to updateApplication', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'updateApplication')
      .mockResolvedValue({} as Application);
    await callHandler(server, 'application', {
      action: 'update',
      uuid: 'app-uuid',
      domains: 'https://app.example.com',
      is_static: true,
      is_auto_deploy_enabled: false,
      redirect: 'www',
      pre_deployment_command: 'php artisan migrate',
    });
    const [, payload] = spy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.domains).toBe('https://app.example.com');
    expect(payload.is_static).toBe(true);
    expect(payload.is_auto_deploy_enabled).toBe(false);
    expect(payload.redirect).toBe('www');
    expect(payload.pre_deployment_command).toBe('php artisan migrate');
  });
});

describe('server update with build fields', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should pass build fields to updateServer', async () => {
    const spy = jest.spyOn(server.getClient(), 'updateServer').mockResolvedValue({} as Server);
    await callHandler(server, 'server', {
      action: 'update',
      uuid: 'srv-uuid',
      concurrent_builds: 4,
      deployment_queue_limit: 10,
    });
    const [, payload] = spy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.concurrent_builds).toBe(4);
    expect(payload.deployment_queue_limit).toBe(10);
  });
});

describe('database with public_port_timeout', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should pass public_port_timeout to updateDatabase', async () => {
    const spy = jest.spyOn(server.getClient(), 'updateDatabase').mockResolvedValue({} as Database);
    await callHandler(server, 'database', {
      action: 'update',
      uuid: 'db-uuid',
      public_port_timeout: 7200,
    });
    const [, payload] = spy.mock.calls[0] as [string, Record<string, unknown>];
    expect(payload.public_port_timeout).toBe(7200);
  });
});

// =============================================================================
// Handler coverage tests — covers previously untested tool handlers
// =============================================================================

describe('wrap() and wrapWithActions() error paths', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('wrap(): returns error text when client method throws Error', async () => {
    jest.spyOn(server.getClient(), 'getVersion').mockRejectedValue(new Error('Network error'));
    const result = (await callHandler(server, 'get_version', {})) as {
      content: Array<{ type: string; text: string }>;
    };
    expect(result.content[0].text).toContain('Error: Network error');
  });

  it('wrap(): returns error text when client method throws non-Error', async () => {
    jest.spyOn(server.getClient(), 'getHealth').mockRejectedValue('plain string error');
    const result = (await callHandler(server, 'health', {})) as {
      content: Array<{ type: string; text: string }>;
    };
    expect(result.content[0].text).toContain('Error: plain string error');
  });

  it('wrapWithActions(): returns error text when client method throws', async () => {
    jest.spyOn(server.getClient(), 'listApplications').mockRejectedValue(new Error('Auth failed'));
    const result = (await callHandler(server, 'list_applications', {})) as {
      content: Array<{ type: string; text: string }>;
    };
    expect(result.content[0].text).toContain('Error: Auth failed');
  });

  it('get_application calls getApplication with HATEOAS actions', async () => {
    jest.spyOn(server.getClient(), 'getApplication').mockResolvedValue({
      uuid: 'app-uuid',
      name: 'test',
      status: 'running:healthy',
    } as Application);
    const result = (await callHandler(server, 'get_application', { uuid: 'app-uuid' })) as {
      content: Array<{ type: string; text: string }>;
    };
    const data = JSON.parse(result.content[0].text) as { data: { uuid: string } };
    expect(data.data.uuid).toBe('app-uuid');
  });
});

describe('simple tool handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('get_version calls getVersion', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'getVersion')
      .mockResolvedValue({ version: '4.0.0' });
    await callHandler(server, 'get_version', {});
    expect(spy).toHaveBeenCalled();
  });

  it('get_mcp_version returns version JSON', async () => {
    const result = (await callHandler(server, 'get_mcp_version', {})) as {
      content: Array<{ type: string; text: string }>;
    };
    const data = JSON.parse(result.content[0].text) as { version: string; name: string };
    expect(data.name).toBe('@jurislm/coolify-mcp');
  });

  it('find_issues calls findInfrastructureIssues', async () => {
    const spy = jest.spyOn(server.getClient(), 'findInfrastructureIssues').mockResolvedValue({
      summary: {
        total_issues: 0,
        unhealthy_applications: 0,
        unhealthy_databases: 0,
        unhealthy_services: 0,
        unreachable_servers: 0,
      },
      issues: [],
    });
    await callHandler(server, 'find_issues', {});
    expect(spy).toHaveBeenCalled();
  });

  it('list_servers calls listServers with summary', async () => {
    const spy = jest.spyOn(server.getClient(), 'listServers').mockResolvedValue([]);
    await callHandler(server, 'list_servers', {});
    expect(spy).toHaveBeenCalledWith({ page: undefined, per_page: undefined, summary: true });
  });

  it('get_server calls getServer', async () => {
    const spy = jest.spyOn(server.getClient(), 'getServer').mockResolvedValue({} as Server);
    await callHandler(server, 'get_server', { uuid: 'srv-uuid' });
    expect(spy).toHaveBeenCalledWith('srv-uuid');
  });

  it('server_resources calls getServerResources', async () => {
    const spy = jest.spyOn(server.getClient(), 'getServerResources').mockResolvedValue([]);
    await callHandler(server, 'server_resources', { uuid: 'srv-uuid' });
    expect(spy).toHaveBeenCalledWith('srv-uuid');
  });

  it('server_domains calls getServerDomains', async () => {
    const spy = jest.spyOn(server.getClient(), 'getServerDomains').mockResolvedValue([]);
    await callHandler(server, 'server_domains', { uuid: 'srv-uuid' });
    expect(spy).toHaveBeenCalledWith('srv-uuid');
  });

  it('validate_server calls validateServer', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'validateServer')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'validate_server', { uuid: 'srv-uuid' });
    expect(spy).toHaveBeenCalledWith('srv-uuid');
  });

  it('list_resources calls listResources', async () => {
    const spy = jest.spyOn(server.getClient(), 'listResources').mockResolvedValue([]);
    await callHandler(server, 'list_resources', {});
    expect(spy).toHaveBeenCalled();
  });

  it('list_databases calls listDatabases with summary', async () => {
    const spy = jest.spyOn(server.getClient(), 'listDatabases').mockResolvedValue([]);
    await callHandler(server, 'list_databases', {});
    expect(spy).toHaveBeenCalledWith({ page: undefined, per_page: undefined, summary: true });
  });

  it('get_database calls getDatabase', async () => {
    const spy = jest.spyOn(server.getClient(), 'getDatabase').mockResolvedValue({} as Database);
    await callHandler(server, 'get_database', { uuid: 'db-uuid' });
    expect(spy).toHaveBeenCalledWith('db-uuid');
  });

  it('list_services calls listServices with summary', async () => {
    const spy = jest.spyOn(server.getClient(), 'listServices').mockResolvedValue([]);
    await callHandler(server, 'list_services', {});
    expect(spy).toHaveBeenCalledWith({ page: undefined, per_page: undefined, summary: true });
  });

  it('list_applications calls listApplications with summary', async () => {
    const spy = jest.spyOn(server.getClient(), 'listApplications').mockResolvedValue([]);
    await callHandler(server, 'list_applications', {});
    expect(spy).toHaveBeenCalledWith({ page: undefined, per_page: undefined, summary: true });
  });
});

describe('get_infrastructure_overview handler', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('returns overview with counts', async () => {
    jest.spyOn(server.getClient(), 'listServers').mockResolvedValue([]);
    jest.spyOn(server.getClient(), 'listProjects').mockResolvedValue([]);
    jest.spyOn(server.getClient(), 'listApplications').mockResolvedValue([]);
    jest.spyOn(server.getClient(), 'listDatabases').mockResolvedValue([]);
    jest.spyOn(server.getClient(), 'listServices').mockResolvedValue([]);
    const result = (await callHandler(server, 'get_infrastructure_overview', {})) as {
      content: Array<{ type: string; text: string }>;
    };
    const data = JSON.parse(result.content[0].text) as { summary: { servers: number } };
    expect(data.summary.servers).toBe(0);
  });
});

describe('projects tool handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('list action calls listProjects', async () => {
    const spy = jest.spyOn(server.getClient(), 'listProjects').mockResolvedValue([]);
    await callHandler(server, 'projects', { action: 'list' });
    expect(spy).toHaveBeenCalled();
  });

  it('get action requires uuid', async () => {
    const result = (await callHandler(server, 'projects', { action: 'get' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('uuid required');
  });

  it('create action requires name', async () => {
    const result = (await callHandler(server, 'projects', { action: 'create' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('name required');
  });

  it('update action requires uuid', async () => {
    const result = (await callHandler(server, 'projects', { action: 'update' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('uuid required');
  });

  it('delete action requires uuid', async () => {
    const result = (await callHandler(server, 'projects', { action: 'delete' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('uuid required');
  });

  it('create action calls createProject', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createProject')
      .mockResolvedValue({ uuid: 'new-uuid' });
    await callHandler(server, 'projects', { action: 'create', name: 'My Project' });
    expect(spy).toHaveBeenCalledWith({ name: 'My Project', description: undefined });
  });
});

describe('environments tool handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('list action calls listProjectEnvironments', async () => {
    const spy = jest.spyOn(server.getClient(), 'listProjectEnvironments').mockResolvedValue([]);
    await callHandler(server, 'environments', { action: 'list', project_uuid: 'proj-uuid' });
    expect(spy).toHaveBeenCalledWith('proj-uuid');
  });

  it('get action requires name', async () => {
    const result = (await callHandler(server, 'environments', {
      action: 'get',
      project_uuid: 'proj-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('name required');
  });

  it('create action requires name', async () => {
    const result = (await callHandler(server, 'environments', {
      action: 'create',
      project_uuid: 'proj-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('name required');
  });

  it('delete action requires name', async () => {
    const result = (await callHandler(server, 'environments', {
      action: 'delete',
      project_uuid: 'proj-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('name required');
  });

  it('delete action calls deleteProjectEnvironment', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteProjectEnvironment')
      .mockResolvedValue({ message: 'Deleted' });
    await callHandler(server, 'environments', {
      action: 'delete',
      project_uuid: 'proj-uuid',
      name: 'staging',
    });
    expect(spy).toHaveBeenCalledWith('proj-uuid', 'staging');
  });

  it('create action calls createProjectEnvironment', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createProjectEnvironment')
      .mockResolvedValue({ uuid: 'env-uuid' });
    await callHandler(server, 'environments', {
      action: 'create',
      project_uuid: 'proj-uuid',
      name: 'staging',
    });
    expect(spy).toHaveBeenCalledWith('proj-uuid', { name: 'staging', description: undefined });
  });
});

describe('service tool handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('create action requires server_uuid and project_uuid', async () => {
    const result = (await callHandler(server, 'service', { action: 'create' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('server_uuid, project_uuid required');
  });

  it('update action requires uuid', async () => {
    const result = (await callHandler(server, 'service', { action: 'update' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('uuid required');
  });

  it('delete action requires uuid', async () => {
    const result = (await callHandler(server, 'service', { action: 'delete' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('uuid required');
  });

  it('create action calls createService', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createService')
      .mockResolvedValue({ uuid: 'svc-uuid' } as { uuid: string });
    await callHandler(server, 'service', {
      action: 'create',
      server_uuid: 'srv-uuid',
      project_uuid: 'proj-uuid',
    });
    expect(spy).toHaveBeenCalled();
  });

  it('delete action calls deleteService', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteService')
      .mockResolvedValue({ message: 'Deleted' });
    await callHandler(server, 'service', { action: 'delete', uuid: 'svc-uuid' });
    expect(spy).toHaveBeenCalledWith('svc-uuid', { deleteVolumes: undefined });
  });
});

describe('database_backups tool handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('list_schedules calls listDatabaseBackups', async () => {
    const spy = jest.spyOn(server.getClient(), 'listDatabaseBackups').mockResolvedValue([]);
    await callHandler(server, 'database_backups', {
      action: 'list_schedules',
      database_uuid: 'db-uuid',
    });
    expect(spy).toHaveBeenCalledWith('db-uuid');
  });

  it('get_schedule requires backup_uuid', async () => {
    const result = (await callHandler(server, 'database_backups', {
      action: 'get_schedule',
      database_uuid: 'db-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('backup_uuid required');
  });

  it('list_executions requires backup_uuid', async () => {
    const result = (await callHandler(server, 'database_backups', {
      action: 'list_executions',
      database_uuid: 'db-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('backup_uuid required');
  });

  it('create requires frequency', async () => {
    const result = (await callHandler(server, 'database_backups', {
      action: 'create',
      database_uuid: 'db-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('frequency required');
  });
});

describe('api_control tool handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('enable action calls enableApi', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'enableApi')
      .mockResolvedValue({ message: 'API enabled.' });
    await callHandler(server, 'api_control', { action: 'enable' });
    expect(spy).toHaveBeenCalled();
  });

  it('disable action calls disableApi', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'disableApi')
      .mockResolvedValue({ message: 'API disabled.' });
    await callHandler(server, 'api_control', { action: 'disable' });
    expect(spy).toHaveBeenCalled();
  });
});

describe('application delete_preview handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('delete_preview requires uuid', async () => {
    const result = (await callHandler(server, 'application', {
      action: 'delete_preview',
      pull_request_id: 42,
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('uuid required');
  });

  it('delete_preview requires pull_request_id', async () => {
    const result = (await callHandler(server, 'application', {
      action: 'delete_preview',
      uuid: 'app-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('pull_request_id required');
  });

  it('delete_preview calls deleteApplicationPreview', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteApplicationPreview')
      .mockResolvedValue({ message: 'Deleted' });
    await callHandler(server, 'application', {
      action: 'delete_preview',
      uuid: 'app-uuid',
      pull_request_id: 42,
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', 42);
  });
});

describe('deploy with docker_tag', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  it('should pass docker_tag to deployByTagOrUuid', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deployByTagOrUuid')
      .mockResolvedValue({ message: 'Deploying' } as MessageResponse);
    await callHandler(server, 'deploy', {
      tag_or_uuid: 'app-uuid',
      docker_tag: 'v2.0.0',
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', undefined, undefined, 'v2.0.0');
  });
});

// =============================================================================
// Coverage completion tests (improve-test-coverage-100)
// =============================================================================

describe('CoolifyMcpServer connect() method', () => {
  it('delegates to super.connect with mock transport', async () => {
    const server = new TestableMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
    const mockTransport = { start: jest.fn().mockResolvedValue(undefined) } as never;
    await server.connect(mockTransport);
    expect(mockTransport.start).toHaveBeenCalled();
  });
});

describe('database create — remaining engine types', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  const baseArgs = {
    action: 'create',
    project_uuid: 'p',
    server_uuid: 's',
    environment_name: 'production',
  };

  it('create mysql dispatches to createMysql', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createMysql')
      .mockResolvedValue({ uuid: 'db' } as UuidResponse);
    await callHandler(server, 'database', { ...baseArgs, type: 'mysql' });
    expect(spy).toHaveBeenCalled();
  });

  it('create mariadb dispatches to createMariadb', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createMariadb')
      .mockResolvedValue({ uuid: 'db' } as UuidResponse);
    await callHandler(server, 'database', { ...baseArgs, type: 'mariadb' });
    expect(spy).toHaveBeenCalled();
  });

  it('create mongodb dispatches to createMongodb', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createMongodb')
      .mockResolvedValue({ uuid: 'db' } as UuidResponse);
    await callHandler(server, 'database', { ...baseArgs, type: 'mongodb' });
    expect(spy).toHaveBeenCalled();
  });

  it('create redis dispatches to createRedis', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createRedis')
      .mockResolvedValue({ uuid: 'db' } as UuidResponse);
    await callHandler(server, 'database', { ...baseArgs, type: 'redis' });
    expect(spy).toHaveBeenCalled();
  });

  it('create keydb dispatches to createKeydb', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createKeydb')
      .mockResolvedValue({ uuid: 'db' } as UuidResponse);
    await callHandler(server, 'database', { ...baseArgs, type: 'keydb' });
    expect(spy).toHaveBeenCalled();
  });

  it('create clickhouse dispatches to createClickhouse', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createClickhouse')
      .mockResolvedValue({ uuid: 'db' } as UuidResponse);
    await callHandler(server, 'database', { ...baseArgs, type: 'clickhouse' });
    expect(spy).toHaveBeenCalled();
  });

  it('create dragonfly dispatches to createDragonfly', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createDragonfly')
      .mockResolvedValue({ uuid: 'db' } as UuidResponse);
    await callHandler(server, 'database', { ...baseArgs, type: 'dragonfly' });
    expect(spy).toHaveBeenCalled();
  });

  it('create postgresql dispatches to createPostgresql', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createPostgresql')
      .mockResolvedValue({ uuid: 'db' } as UuidResponse);
    await callHandler(server, 'database', { ...baseArgs, type: 'postgresql' });
    expect(spy).toHaveBeenCalled();
  });
});

describe('application create_public / create_github / create_key / delete', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('create_public dispatches to createApplicationPublic', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createApplicationPublic')
      .mockResolvedValue({ uuid: 'app' } as UuidResponse);
    await callHandler(server, 'application', {
      action: 'create_public',
      project_uuid: 'p',
      server_uuid: 's',
      git_repository: 'https://github.com/x/y',
      git_branch: 'main',
      build_pack: 'nixpacks',
      ports_exposes: '3000',
    });
    expect(spy).toHaveBeenCalled();
  });

  it('create_github dispatches to createApplicationPrivateGH', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createApplicationPrivateGH')
      .mockResolvedValue({ uuid: 'app' } as UuidResponse);
    await callHandler(server, 'application', {
      action: 'create_github',
      project_uuid: 'p',
      server_uuid: 's',
      github_app_uuid: 'g',
      git_repository: 'repo',
      git_branch: 'main',
    });
    expect(spy).toHaveBeenCalled();
  });

  it('create_key dispatches to createApplicationPrivateKey', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createApplicationPrivateKey')
      .mockResolvedValue({ uuid: 'app' } as UuidResponse);
    await callHandler(server, 'application', {
      action: 'create_key',
      project_uuid: 'p',
      server_uuid: 's',
      private_key_uuid: 'k',
      git_repository: 'repo',
      git_branch: 'main',
    });
    expect(spy).toHaveBeenCalled();
  });

  it('delete dispatches to deleteApplication', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteApplication')
      .mockResolvedValue({ message: 'Deleted' });
    await callHandler(server, 'application', { action: 'delete', uuid: 'app-uuid' });
    expect(spy).toHaveBeenCalledWith('app-uuid', { deleteVolumes: undefined });
  });
});

describe('service get_service and service update', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('get_service dispatches to getService', async () => {
    const spy = jest.spyOn(server.getClient(), 'getService').mockResolvedValue({} as never);
    await callHandler(server, 'get_service', { uuid: 'svc-uuid' });
    expect(spy).toHaveBeenCalledWith('svc-uuid');
  });

  it('service update dispatches to updateService', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'updateService')
      .mockResolvedValue({ message: 'Updated' });
    await callHandler(server, 'service', { action: 'update', uuid: 'svc-uuid', name: 'new-name' });
    expect(spy).toHaveBeenCalledWith('svc-uuid', expect.objectContaining({ name: 'new-name' }));
  });
});

describe('env_vars — database/service paths, application bulk_create, list_deployments HATEOAS', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('application bulk_create dispatches to bulkUpdateApplicationEnvVars', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'bulkUpdateApplicationEnvVars')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'env_vars', {
      resource: 'application',
      action: 'bulk_create',
      uuid: 'app-uuid',
      bulk_data: [{ key: 'K', value: 'V' }],
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', { data: [{ key: 'K', value: 'V' }] });
  });

  it('database create dispatches to createDatabaseEnvVar', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createDatabaseEnvVar')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'env_vars', {
      resource: 'database',
      action: 'create',
      uuid: 'db-uuid',
      key: 'K',
      value: 'V',
    });
    expect(spy).toHaveBeenCalledWith('db-uuid', expect.objectContaining({ key: 'K', value: 'V' }));
  });

  it('database update dispatches to updateDatabaseEnvVar', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'updateDatabaseEnvVar')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'env_vars', {
      resource: 'database',
      action: 'update',
      uuid: 'db-uuid',
      key: 'K',
      value: 'V2',
    });
    expect(spy).toHaveBeenCalledWith('db-uuid', expect.objectContaining({ key: 'K', value: 'V2' }));
  });

  it('service create dispatches to createServiceEnvVar', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createServiceEnvVar')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'env_vars', {
      resource: 'service',
      action: 'create',
      uuid: 'svc-uuid',
      key: 'K',
      value: 'V',
    });
    expect(spy).toHaveBeenCalledWith('svc-uuid', expect.objectContaining({ key: 'K', value: 'V' }));
  });

  it('service bulk_create dispatches to bulkUpdateServiceEnvVars', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'bulkUpdateServiceEnvVars')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'env_vars', {
      resource: 'service',
      action: 'bulk_create',
      uuid: 'svc-uuid',
      bulk_data: [{ key: 'K', value: 'V' }],
    });
    expect(spy).toHaveBeenCalledWith('svc-uuid', { data: [{ key: 'K', value: 'V' }] });
  });

  it('list_deployments response includes _pagination when on page 2+', async () => {
    jest.spyOn(server.getClient(), 'listDeployments').mockResolvedValue([]);
    const result = (await callHandler(server, 'list_deployments', { page: 2 })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('_pagination');
  });
});

describe('deployment tool — get/cancel/list_for_app', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('get without lines returns response with _actions', async () => {
    jest.spyOn(server.getClient(), 'getDeployment').mockResolvedValue({
      uuid: 'dep-uuid',
      status: 'finished',
      application_uuid: 'app-uuid',
    } as never);
    const result = (await callHandler(server, 'deployment', {
      action: 'get',
      uuid: 'dep-uuid',
    })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('_actions');
  });

  it('get with lines includes logs in response', async () => {
    jest.spyOn(server.getClient(), 'getDeployment').mockResolvedValue({
      uuid: 'dep-uuid',
      status: 'finished',
      application_uuid: 'app-uuid',
      logs: 'log line 1\nlog line 2',
    } as never);
    const result = (await callHandler(server, 'deployment', {
      action: 'get',
      uuid: 'dep-uuid',
      lines: 10,
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('dep-uuid');
  });

  it('cancel dispatches to cancelDeployment', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'cancelDeployment')
      .mockResolvedValue({ message: 'Cancelled' });
    await callHandler(server, 'deployment', { action: 'cancel', uuid: 'dep-uuid' });
    expect(spy).toHaveBeenCalledWith('dep-uuid');
  });

  it('list_for_app dispatches to listApplicationDeployments', async () => {
    const spy = jest.spyOn(server.getClient(), 'listApplicationDeployments').mockResolvedValue([]);
    await callHandler(server, 'deployment', { action: 'list_for_app', uuid: 'app-uuid' });
    expect(spy).toHaveBeenCalledWith('app-uuid');
  });
});

describe('teams get/members and private_keys create/update/delete', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('teams get without id returns error', async () => {
    const result = (await callHandler(server, 'teams', { action: 'get' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('id required');
  });

  it('teams get dispatches to getTeam', async () => {
    const spy = jest.spyOn(server.getClient(), 'getTeam').mockResolvedValue({} as never);
    await callHandler(server, 'teams', { action: 'get', id: 1 });
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('teams members without id returns error', async () => {
    const result = (await callHandler(server, 'teams', { action: 'members' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('id required');
  });

  it('teams members dispatches to getTeamMembers', async () => {
    const spy = jest.spyOn(server.getClient(), 'getTeamMembers').mockResolvedValue([]);
    await callHandler(server, 'teams', { action: 'members', id: 2 });
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('private_keys create dispatches to createPrivateKey', async () => {
    const spy = jest.spyOn(server.getClient(), 'createPrivateKey').mockResolvedValue({} as never);
    await callHandler(server, 'private_keys', { action: 'create', private_key: 'pk-content' });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ private_key: 'pk-content' }));
  });

  it('private_keys update without uuid returns error', async () => {
    const result = (await callHandler(server, 'private_keys', { action: 'update' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('uuid required');
  });

  it('private_keys update dispatches to updatePrivateKey', async () => {
    const spy = jest.spyOn(server.getClient(), 'updatePrivateKey').mockResolvedValue({} as never);
    await callHandler(server, 'private_keys', {
      action: 'update',
      uuid: 'key-uuid',
      name: 'new-name',
    });
    expect(spy).toHaveBeenCalledWith('key-uuid', expect.objectContaining({ name: 'new-name' }));
  });

  it('private_keys delete without uuid returns error', async () => {
    const result = (await callHandler(server, 'private_keys', { action: 'delete' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('uuid required');
  });

  it('private_keys delete dispatches to deletePrivateKey', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deletePrivateKey')
      .mockResolvedValue({ message: 'Deleted' });
    await callHandler(server, 'private_keys', { action: 'delete', uuid: 'key-uuid' });
    expect(spy).toHaveBeenCalledWith('key-uuid');
  });
});

describe('github_apps list/get/create', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('list dispatches to listGitHubApps', async () => {
    const spy = jest.spyOn(server.getClient(), 'listGitHubApps').mockResolvedValue([] as never);
    await callHandler(server, 'github_apps', { action: 'list' });
    expect(spy).toHaveBeenCalled();
  });

  it('get without id returns error', async () => {
    const result = (await callHandler(server, 'github_apps', { action: 'get' })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('id required');
  });

  it('get dispatches and returns matching app', async () => {
    jest
      .spyOn(server.getClient(), 'listGitHubApps')
      .mockResolvedValue([{ id: 1, name: 'MyApp' }] as never);
    const result = (await callHandler(server, 'github_apps', { action: 'get', id: 1 })) as {
      content: Array<{ text: string }>;
    };
    expect(result.content[0].text).toContain('MyApp');
  });

  it('create dispatches to createGitHubApp', async () => {
    const spy = jest.spyOn(server.getClient(), 'createGitHubApp').mockResolvedValue({} as never);
    await callHandler(server, 'github_apps', {
      action: 'create',
      name: 'my-app',
      api_url: 'https://api.github.com',
      html_url: 'https://github.com/apps/my-app',
      app_id: 12345,
      installation_id: 67890,
      client_id: 'Iv1.abc',
      client_secret: 'secret',
      private_key_uuid: 'pk-uuid',
    });
    expect(spy).toHaveBeenCalled();
  });
});

describe('database_backups — get_execution, create dispatch, update', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('get_execution dispatches to getBackupExecution', async () => {
    const spy = jest.spyOn(server.getClient(), 'getBackupExecution').mockResolvedValue({} as never);
    await callHandler(server, 'database_backups', {
      action: 'get_execution',
      database_uuid: 'd',
      backup_uuid: 'b',
      execution_uuid: 'e',
    });
    expect(spy).toHaveBeenCalledWith('d', 'b', 'e');
  });

  it('get_execution without execution_uuid returns error', async () => {
    const result = (await callHandler(server, 'database_backups', {
      action: 'get_execution',
      database_uuid: 'd',
      backup_uuid: 'b',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('required');
  });

  it('create with frequency dispatches to createDatabaseBackup', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createDatabaseBackup')
      .mockResolvedValue({} as never);
    await callHandler(server, 'database_backups', {
      action: 'create',
      database_uuid: 'db-uuid',
      frequency: '@daily',
    });
    expect(spy).toHaveBeenCalledWith('db-uuid', expect.objectContaining({ frequency: '@daily' }));
  });

  it('update without backup_uuid returns error', async () => {
    const result = (await callHandler(server, 'database_backups', {
      action: 'update',
      database_uuid: 'db-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('backup_uuid required');
  });

  it('update dispatches to updateDatabaseBackup', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'updateDatabaseBackup')
      .mockResolvedValue({} as never);
    await callHandler(server, 'database_backups', {
      action: 'update',
      database_uuid: 'db-uuid',
      backup_uuid: 'bk-uuid',
      enabled: false,
    });
    expect(spy).toHaveBeenCalledWith('db-uuid', 'bk-uuid', expect.any(Object));
  });

  it('delete_execution without execution_uuid returns error', async () => {
    const result = (await callHandler(server, 'database_backups', {
      action: 'delete_execution',
      database_uuid: 'd',
      backup_uuid: 'b',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('required');
  });

  it('delete_execution dispatches to deleteBackupExecution', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteBackupExecution')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'database_backups', {
      action: 'delete_execution',
      database_uuid: 'd',
      backup_uuid: 'b',
      execution_uuid: 'e',
    });
    expect(spy).toHaveBeenCalledWith('d', 'b', 'e', undefined);
  });
});

describe('storages tool handler dispatch', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('list application dispatches to listApplicationStorages', async () => {
    const spy = jest.spyOn(server.getClient(), 'listApplicationStorages').mockResolvedValue([]);
    await callHandler(server, 'storages', {
      action: 'list',
      resource_type: 'application',
      uuid: 'app-uuid',
    });
    expect(spy).toHaveBeenCalledWith('app-uuid');
  });

  it('list database dispatches to listDatabaseStorages', async () => {
    const spy = jest.spyOn(server.getClient(), 'listDatabaseStorages').mockResolvedValue([]);
    await callHandler(server, 'storages', {
      action: 'list',
      resource_type: 'database',
      uuid: 'db-uuid',
    });
    expect(spy).toHaveBeenCalledWith('db-uuid');
  });

  it('list service dispatches to listServiceStorages', async () => {
    const spy = jest.spyOn(server.getClient(), 'listServiceStorages').mockResolvedValue([]);
    await callHandler(server, 'storages', {
      action: 'list',
      resource_type: 'service',
      uuid: 'svc-uuid',
    });
    expect(spy).toHaveBeenCalledWith('svc-uuid');
  });

  it('create requires type', async () => {
    const result = (await callHandler(server, 'storages', {
      action: 'create',
      resource_type: 'application',
      uuid: 'app-uuid',
      mount_path: '/data',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('type required');
  });

  it('create requires mount_path', async () => {
    const result = (await callHandler(server, 'storages', {
      action: 'create',
      resource_type: 'application',
      uuid: 'app-uuid',
      type: 'persistent',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('mount_path required');
  });

  it('create service requires service_resource_uuid', async () => {
    const result = (await callHandler(server, 'storages', {
      action: 'create',
      resource_type: 'service',
      uuid: 'svc-uuid',
      type: 'persistent',
      mount_path: '/data',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('service_resource_uuid required');
  });

  it('create application with persistent type dispatches to createApplicationStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createApplicationStorage')
      .mockResolvedValue({} as never);
    await callHandler(server, 'storages', {
      action: 'create',
      resource_type: 'application',
      uuid: 'app-uuid',
      type: 'persistent',
      mount_path: '/data',
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', expect.any(Object));
  });

  it('create application with file type dispatches to createApplicationStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createApplicationStorage')
      .mockResolvedValue({} as never);
    await callHandler(server, 'storages', {
      action: 'create',
      resource_type: 'application',
      uuid: 'app-uuid',
      type: 'file',
      mount_path: '/app/.env',
      content: 'KEY=VALUE',
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', expect.any(Object));
  });

  it('create database dispatches to createDatabaseStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createDatabaseStorage')
      .mockResolvedValue({} as never);
    await callHandler(server, 'storages', {
      action: 'create',
      resource_type: 'database',
      uuid: 'db-uuid',
      type: 'persistent',
      mount_path: '/data',
    });
    expect(spy).toHaveBeenCalledWith('db-uuid', expect.any(Object));
  });

  it('create service dispatches to createServiceStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'createServiceStorage')
      .mockResolvedValue({} as never);
    await callHandler(server, 'storages', {
      action: 'create',
      resource_type: 'service',
      uuid: 'svc-uuid',
      type: 'persistent',
      mount_path: '/data',
      service_resource_uuid: 'res-uuid',
    });
    expect(spy).toHaveBeenCalledWith('svc-uuid', expect.any(Object));
  });

  it('update requires type', async () => {
    const result = (await callHandler(server, 'storages', {
      action: 'update',
      resource_type: 'application',
      uuid: 'app-uuid',
      storage_uuid: 'st-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('type required');
  });

  it('update requires storage_uuid', async () => {
    const result = (await callHandler(server, 'storages', {
      action: 'update',
      resource_type: 'application',
      uuid: 'app-uuid',
      type: 'persistent',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('storage_uuid required');
  });

  it('update application dispatches to updateApplicationStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'updateApplicationStorage')
      .mockResolvedValue({} as never);
    await callHandler(server, 'storages', {
      action: 'update',
      resource_type: 'application',
      uuid: 'app-uuid',
      type: 'persistent',
      storage_uuid: 'st-uuid',
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', expect.any(Object));
  });

  it('update database dispatches to updateDatabaseStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'updateDatabaseStorage')
      .mockResolvedValue({} as never);
    await callHandler(server, 'storages', {
      action: 'update',
      resource_type: 'database',
      uuid: 'db-uuid',
      type: 'persistent',
      storage_uuid: 'st-uuid',
    });
    expect(spy).toHaveBeenCalledWith('db-uuid', expect.any(Object));
  });

  it('update service dispatches to updateServiceStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'updateServiceStorage')
      .mockResolvedValue({} as never);
    await callHandler(server, 'storages', {
      action: 'update',
      resource_type: 'service',
      uuid: 'svc-uuid',
      type: 'persistent',
      storage_uuid: 'st-uuid',
    });
    expect(spy).toHaveBeenCalledWith('svc-uuid', expect.any(Object));
  });

  it('delete requires storage_uuid', async () => {
    const result = (await callHandler(server, 'storages', {
      action: 'delete',
      resource_type: 'application',
      uuid: 'app-uuid',
    })) as { content: Array<{ text: string }> };
    expect(result.content[0].text).toContain('storage_uuid required');
  });

  it('delete application dispatches to deleteApplicationStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteApplicationStorage')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'storages', {
      action: 'delete',
      resource_type: 'application',
      uuid: 'app-uuid',
      storage_uuid: 'st-uuid',
    });
    expect(spy).toHaveBeenCalledWith('app-uuid', 'st-uuid');
  });

  it('delete database dispatches to deleteDatabaseStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteDatabaseStorage')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'storages', {
      action: 'delete',
      resource_type: 'database',
      uuid: 'db-uuid',
      storage_uuid: 'st-uuid',
    });
    expect(spy).toHaveBeenCalledWith('db-uuid', 'st-uuid');
  });

  it('delete service dispatches to deleteServiceStorage', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'deleteServiceStorage')
      .mockResolvedValue({ message: 'ok' });
    await callHandler(server, 'storages', {
      action: 'delete',
      resource_type: 'service',
      uuid: 'svc-uuid',
      storage_uuid: 'st-uuid',
    });
    expect(spy).toHaveBeenCalledWith('svc-uuid', 'st-uuid');
  });
});

describe('batch operations — bulk_env_update / restart / stop / redeploy', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('bulk_env_update dispatches to bulkEnvUpdate', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'bulkEnvUpdate')
      .mockResolvedValue({} as BatchOperationResult);
    await callHandler(server, 'bulk_env_update', {
      app_uuids: ['a', 'b'],
      key: 'MY_KEY',
      value: 'val',
    });
    expect(spy).toHaveBeenCalledWith(['a', 'b'], 'MY_KEY', 'val', undefined);
  });

  it('restart_project_apps dispatches to restartProjectApps', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'restartProjectApps')
      .mockResolvedValue({} as BatchOperationResult);
    await callHandler(server, 'restart_project_apps', { project_uuid: 'proj-uuid' });
    expect(spy).toHaveBeenCalledWith('proj-uuid');
  });

  it('stop_all_apps dispatches to stopAllApps', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'stopAllApps')
      .mockResolvedValue({} as BatchOperationResult);
    await callHandler(server, 'stop_all_apps', { confirm_stop_all_apps: true });
    expect(spy).toHaveBeenCalled();
  });

  it('redeploy_project dispatches to redeployProjectApps', async () => {
    const spy = jest
      .spyOn(server.getClient(), 'redeployProjectApps')
      .mockResolvedValue({} as BatchOperationResult);
    await callHandler(server, 'redeploy_project', { project_uuid: 'proj-uuid' });
    expect(spy).toHaveBeenCalledWith('proj-uuid', true);
  });
});

describe('docker_network_alias tool', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('returns SSH commands with server info when getServer succeeds', async () => {
    jest.spyOn(server.getClient(), 'getServer').mockResolvedValue({
      id: 1,
      uuid: 'srv-uuid',
      name: 'my-server',
      ip: '1.2.3.4',
      user: 'root',
      port: 22,
      created_at: '',
      updated_at: '',
    } as Server);
    const result = (await callHandler(server, 'docker_network_alias', {
      server_uuid: 'srv-uuid',
      db_uuid: 'db-uuid-123',
      name: 'shared-db',
    })) as { content: Array<{ text: string }> };
    const parsed = JSON.parse(result.content[0].text) as Record<string, unknown>;
    expect(parsed).toHaveProperty('commands');
    const commands = parsed.commands as Record<string, unknown>;
    expect(commands.ssh_connect).toContain('1.2.3.4');
    expect((commands.add_alias as string[]).join('\n')).toContain('shared-db');
    expect((commands.add_alias as string[]).join('\n')).toContain('db-uuid-123');
    expect(commands.verify).toContain('shared-db');
  });

  it('uses placeholder ssh_connect and server_lookup_failed when getServer fails', async () => {
    jest.spyOn(server.getClient(), 'getServer').mockRejectedValue(new Error('not found'));
    const result = (await callHandler(server, 'docker_network_alias', {
      server_uuid: 'bad-uuid',
      db_uuid: 'db-uuid-456',
      name: 'my-db',
    })) as { content: Array<{ text: string }> };
    const parsed = JSON.parse(result.content[0].text) as Record<string, unknown>;
    expect(parsed).toHaveProperty('server_lookup_failed');
    expect(parsed).not.toHaveProperty('server');
    const commands = parsed.commands as Record<string, unknown>;
    expect(commands.ssh_connect).toContain('<server-ip>');
  });

  it('uses custom network when provided', async () => {
    jest.spyOn(server.getClient(), 'getServer').mockResolvedValue({
      id: 1,
      uuid: 'srv-uuid',
      name: 'my-server',
      ip: '5.6.7.8',
      user: 'ubuntu',
      port: 2222,
      created_at: '',
      updated_at: '',
    } as Server);
    const result = (await callHandler(server, 'docker_network_alias', {
      server_uuid: 'srv-uuid',
      db_uuid: 'db-uuid-789',
      name: 'my-db',
      network: 'custom-net',
    })) as { content: Array<{ text: string }> };
    const parsed = JSON.parse(result.content[0].text) as Record<string, unknown>;
    const commands = parsed.commands as Record<string, unknown>;
    expect((commands.add_alias as string[]).join('\n')).toContain('custom-net');
    expect(commands.ssh_connect).toContain('2222');
  });

  it('includes next_actions pointing to get_database', async () => {
    jest.spyOn(server.getClient(), 'getServer').mockRejectedValue(new Error('skip'));
    const result = (await callHandler(server, 'docker_network_alias', {
      server_uuid: 'srv',
      db_uuid: 'db-abc',
      name: 'testdb',
    })) as { content: Array<{ text: string }> };
    const parsed = JSON.parse(result.content[0].text) as Record<string, unknown>;
    const actions = parsed.next_actions as Array<Record<string, unknown>>;
    expect(actions[0].tool).toBe('get_database');
  });
});

describe('database create — alias_warning injected into JSON when name is provided', () => {
  let server: TestableMcpServer;

  beforeEach(() => {
    server = new TestableMcpServer({ baseUrl: 'http://localhost:3000', accessToken: 'test-token' });
  });

  it('injects alias_warning into valid JSON after postgresql create with name', async () => {
    jest.spyOn(server.getClient(), 'createPostgresql').mockResolvedValue({ uuid: 'new-db-uuid' });
    const result = (await callHandler(server, 'database', {
      action: 'create',
      type: 'postgresql',
      server_uuid: 'srv-uuid',
      project_uuid: 'proj-uuid',
      name: 'shared-db',
    })) as { content: Array<{ text: string }> };
    // Response must be valid JSON
    const parsed = JSON.parse(result.content[0].text) as Record<string, unknown>;
    expect(parsed.uuid).toBe('new-db-uuid');
    expect(parsed).toHaveProperty('alias_warning');
    const warn = parsed.alias_warning as Record<string, string>;
    expect(warn.bug).toContain('shared-db');
    expect(warn.fix).toContain('docker_network_alias');
    expect(warn.fix).toContain('new-db-uuid');
  });

  it('does not inject alias_warning when name is not provided', async () => {
    jest.spyOn(server.getClient(), 'createPostgresql').mockResolvedValue({ uuid: 'new-db-uuid' });
    const result = (await callHandler(server, 'database', {
      action: 'create',
      type: 'postgresql',
      server_uuid: 'srv-uuid',
      project_uuid: 'proj-uuid',
    })) as { content: Array<{ text: string }> };
    const parsed = JSON.parse(result.content[0].text) as Record<string, unknown>;
    expect(parsed).not.toHaveProperty('alias_warning');
  });
});
