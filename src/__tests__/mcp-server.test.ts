/**
 * MCP Server Tests v2.0.0
 *
 * Tests for the consolidated MCP tool layer.
 * CoolifyClient methods are fully tested in coolify-client.test.ts (174 tests).
 * These tests verify MCP server instantiation and structure.
 */
import { createRequire } from 'module';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  CoolifyMcpServer,
  VERSION,
  truncateLogs,
  getApplicationActions,
  getDeploymentActions,
  getPagination,
} from '../lib/mcp-server.js';

describe('CoolifyMcpServer v2', () => {
  let server: CoolifyMcpServer;

  beforeEach(() => {
    server = new CoolifyMcpServer({
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
  server: CoolifyMcpServer,
  toolName: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registeredTool = (server as any)['_registeredTools'][toolName];
  if (!registeredTool) throw new Error(`Tool "${toolName}" not registered`);
  return registeredTool.handler(args);
}

describe('update handler allowlist — create-only fields must not be forwarded', () => {
  let server: CoolifyMcpServer;

  beforeEach(() => {
    server = new CoolifyMcpServer({
      baseUrl: 'http://localhost:3000',
      accessToken: 'test-token',
    });
  });

  describe('server update', () => {
    it('should not forward instant_validate to updateServer', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = jest.spyOn(server['client'] as any, 'updateServer').mockResolvedValue({});
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

  describe('application update', () => {
    it('should not forward project_uuid to updateApplication', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = jest.spyOn(server['client'] as any, 'updateApplication').mockResolvedValue({});
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = jest.spyOn(server['client'] as any, 'updateApplication').mockResolvedValue({});
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = jest.spyOn(server['client'] as any, 'updateDatabase').mockResolvedValue({});
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = jest.spyOn(server['client'] as any, 'updateDatabase').mockResolvedValue({});
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = jest.spyOn(server['client'] as any, 'updateGitHubApp').mockResolvedValue({});
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
  });
});
