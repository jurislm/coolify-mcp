/**
 * Integration tests for diagnostic tools.
 *
 * These tests hit the real Coolify API to verify diagnostic methods work correctly.
 * They are skipped in CI and should be run manually when testing against a real instance.
 *
 * Prerequisites:
 * - COOLIFY_URL and COOLIFY_TOKEN environment variables set (from .env)
 * - Access to a running Coolify instance
 *
 * Run with: bun run test:integration
 */

import { describe, it, expect, beforeAll } from 'bun:test';
import { config } from 'dotenv';
import { CoolifyClient } from '../../lib/coolify-client.js';

// Load environment variables from .env file
config();

const COOLIFY_URL = process.env.COOLIFY_URL;
const COOLIFY_TOKEN = process.env.COOLIFY_TOKEN;

// Skip all tests if environment variables are not set
const shouldRun = COOLIFY_URL && COOLIFY_TOKEN;

// Test data is discovered at runtime from the live Coolify instance so the
// suite works against any environment. Set the env vars below to pin a
// specific UUID; otherwise the first matching resource is used.
//   INTEGRATION_APP_UUID            — any application UUID (used for general diagnostics)
//   INTEGRATION_SERVER_UUID         — server UUID
//   INTEGRATION_APP_UUID_UNHEALTHY  — required to enable the unhealthy-app
//                                     test (no auto-discovery; the test is
//                                     `it.skipIf`'d when this is unset)
const TEST_DATA: {
  SERVER_UUID: string | null;
  APP_UUID: string | null;
} = {
  SERVER_UUID: null,
  APP_UUID: null,
};

const describeFn = shouldRun ? describe : describe.skip;

describeFn('Diagnostic Integration Tests', () => {
  let client: CoolifyClient;

  beforeAll(async () => {
    if (!COOLIFY_URL || !COOLIFY_TOKEN) {
      throw new Error('COOLIFY_URL and COOLIFY_TOKEN must be set for integration tests');
    }
    client = new CoolifyClient({
      baseUrl: COOLIFY_URL,
      accessToken: COOLIFY_TOKEN,
    });

    // Self-discover real UUIDs so tests work against any Coolify instance.
    // Use `||` (not `??`) so empty-string env vars fall through to discovery.
    const [apps, servers] = await Promise.all([client.listApplications(), client.listServers()]);

    TEST_DATA.SERVER_UUID = process.env.INTEGRATION_SERVER_UUID || servers[0]?.uuid || null;
    // General-purpose application UUID for diagnostic testing — does NOT
    // require the application to be healthy. The dependent tests assert
    // structural correctness, not specific health status.
    TEST_DATA.APP_UUID = process.env.INTEGRATION_APP_UUID || apps[0]?.uuid || null;

    // Mandatory: at least one application and one server must exist for the
    // suite to be meaningful. Failing fast here is better than each test
    // silently returning early (which would log green CI with 0 assertions).
    if (!TEST_DATA.APP_UUID) {
      throw new Error(
        'No application discoverable — set INTEGRATION_APP_UUID or ensure Coolify has at least one application',
      );
    }
    if (!TEST_DATA.SERVER_UUID) {
      throw new Error(
        'No server discoverable — set INTEGRATION_SERVER_UUID or ensure Coolify has at least one server',
      );
    }
  }, 30000);

  describe('diagnoseApplication', () => {
    it('should return structurally valid diagnostic data for a discoverable application', async () => {
      // beforeAll guarantees APP_UUID is non-null
      const result = await client.diagnoseApplication(TEST_DATA.APP_UUID!);

      // Should have application info
      expect(result.application).not.toBeNull();
      expect(result.application?.uuid).toBe(TEST_DATA.APP_UUID as string);
      expect(result.application?.name).toBeDefined();

      // Should have health assessment
      expect(result.health).toBeDefined();
      expect(['healthy', 'unhealthy', 'unknown']).toContain(result.health.status);

      // Should have environment variables (even if empty)
      expect(result.environment_variables).toBeDefined();
      expect(typeof result.environment_variables.count).toBe('number');
      expect(Array.isArray(result.environment_variables.variables)).toBe(true);

      // Values should be hidden (only key and is_build_time exposed)
      if (result.environment_variables.variables.length > 0) {
        const firstVar = result.environment_variables.variables[0];
        expect(firstVar).toHaveProperty('key');
        expect(firstVar).toHaveProperty('is_build_time');
        expect(firstVar).not.toHaveProperty('value');
      }

      // Should have recent deployments array
      expect(Array.isArray(result.recent_deployments)).toBe(true);

      // Should not have errors if all calls succeeded
      // (errors array might be present if some endpoints failed)
      console.log('Healthy app diagnostic result:', JSON.stringify(result, null, 2));
    }, 30000);

    // This test requires an unhealthy application to exercise the
    // unhealthy code path. Since auto-discovery cannot guarantee one
    // exists in a clean Coolify, the test is skipped unless the user
    // explicitly pins one via INTEGRATION_APP_UUID_UNHEALTHY. The bun
    // test runner reports this as "skipped" (not "passed"), making
    // intent obvious in the report. Run with:
    //   INTEGRATION_APP_UUID_UNHEALTHY=<uuid> bun run test:integration
    it.skipIf(!process.env.INTEGRATION_APP_UUID_UNHEALTHY)(
      'should detect issues in an unhealthy application',
      async () => {
        const result = await client.diagnoseApplication(
          process.env.INTEGRATION_APP_UUID_UNHEALTHY!,
        );

        expect(result.application).not.toBeNull();

        // Should detect unhealthy status
        if (
          result.application?.status?.includes('exited') ||
          result.application?.status?.includes('unhealthy')
        ) {
          expect(result.health.status).toBe('unhealthy');
          expect(result.health.issues.length).toBeGreaterThan(0);
        }

        console.log('Unhealthy app diagnostic result:', JSON.stringify(result, null, 2));
      },
      30000,
    );

    it('should handle non-existent application gracefully', async () => {
      const result = await client.diagnoseApplication('non-existent-uuid');

      // Should have errors but not throw
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
      expect(result.application).toBeNull();
    }, 30000);

    // Regression test for issue #24
    // (https://github.com/jurislm/coolify-mcp/issues/24): diagnose_app used
    // to crash with `deployments.slice is not a function` because Coolify
    // returns `{ count, deployments }` instead of a bare array. After the
    // fix, listApplicationDeployments normalizes the wrapper shape so the
    // diagnostic completes and no slice-related TypeError leaks into errors.
    it('does not crash on real Coolify deployments wrapper shape (issue #24)', async () => {
      // beforeAll guarantees APP_UUID is non-null
      const result = await client.diagnoseApplication(TEST_DATA.APP_UUID!);

      expect(result.application).not.toBeNull();
      expect(Array.isArray(result.recent_deployments)).toBe(true);
      const errorJoined = (result.errors ?? []).join(' ').toLowerCase();
      expect(errorJoined).not.toContain('slice');
      expect(errorJoined).not.toContain('not a function');
    }, 30000);
  });

  describe('diagnoseServer', () => {
    it('should return diagnostic data for a server', async () => {
      // beforeAll guarantees SERVER_UUID is non-null
      const result = await client.diagnoseServer(TEST_DATA.SERVER_UUID!);

      // Should have server info
      expect(result.server).not.toBeNull();
      expect(result.server?.uuid).toBe(TEST_DATA.SERVER_UUID as string);
      expect(result.server?.name).toBeDefined();
      expect(result.server?.ip).toBeDefined();

      // Should have health assessment
      expect(result.health).toBeDefined();
      expect(['healthy', 'unhealthy', 'unknown']).toContain(result.health.status);

      // Should have resources array
      expect(Array.isArray(result.resources)).toBe(true);

      // Should have domains array
      expect(Array.isArray(result.domains)).toBe(true);

      // Should have validation result
      expect(result.validation).toBeDefined();

      console.log('Server diagnostic result:', JSON.stringify(result, null, 2));
    }, 30000);

    it('should handle non-existent server gracefully', async () => {
      const result = await client.diagnoseServer('non-existent-uuid');

      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
      expect(result.server).toBeNull();
    }, 30000);
  });

  describe('findInfrastructureIssues', () => {
    it('should return infrastructure issues report', async () => {
      const result = await client.findInfrastructureIssues();

      // Should have summary
      expect(result.summary).toBeDefined();
      expect(typeof result.summary.total_issues).toBe('number');
      expect(typeof result.summary.unhealthy_applications).toBe('number');
      expect(typeof result.summary.unhealthy_databases).toBe('number');
      expect(typeof result.summary.unhealthy_services).toBe('number');
      expect(typeof result.summary.unreachable_servers).toBe('number');

      // Should have issues array
      expect(Array.isArray(result.issues)).toBe(true);

      // Each issue should have required fields
      for (const issue of result.issues) {
        expect(['application', 'database', 'service', 'server']).toContain(issue.type);
        expect(issue.uuid).toBeDefined();
        expect(issue.name).toBeDefined();
        expect(issue.issue).toBeDefined();
        expect(issue.status).toBeDefined();
      }

      // Summary counts should match issues array
      expect(result.summary.total_issues).toBe(result.issues.length);

      console.log('Infrastructure issues report:', JSON.stringify(result, null, 2));
    }, 60000);
  });
});
