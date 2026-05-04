#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CoolifyMcpServer } from './lib/mcp-server.js';
import type { CoolifyConfig } from './types/coolify.js';

async function main(): Promise<void> {
  // Primary names: COOLIFY_URL, COOLIFY_TOKEN.
  // Legacy names COOLIFY_BASE_URL / COOLIFY_ACCESS_TOKEN are accepted for
  // backward compatibility and may be removed in a future major version.
  const config: CoolifyConfig = {
    baseUrl: process.env.COOLIFY_URL || process.env.COOLIFY_BASE_URL || 'http://localhost:3000',
    accessToken: process.env.COOLIFY_TOKEN || process.env.COOLIFY_ACCESS_TOKEN || '',
  };

  if (!config.accessToken) {
    throw new Error(
      'COOLIFY_TOKEN environment variable is required (legacy COOLIFY_ACCESS_TOKEN also accepted)',
    );
  }

  const server = new CoolifyMcpServer(config);
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
