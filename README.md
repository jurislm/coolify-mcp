# @jurislm/coolify-mcp

MCP (Model Context Protocol) server for [Coolify](https://coolify.io) — provides 43 tools for infrastructure management (servers, applications, databases, deployments, diagnostics) via natural language.

## Tools

### Infrastructure (4 tools)

- `get_infrastructure_overview` — Get overview of all resources (servers, projects, apps, databases, services)
- `get_mcp_version` — Get coolify-mcp server version
- `get_version` — Get Coolify API version
- `health` — Check Coolify instance health

### Diagnostics (3 tools)

- `diagnose_app` — Full app diagnostic (status, logs, env vars, deployments) — accepts UUID, name, or domain
- `diagnose_server` — Server diagnostic (status, resources, domains, validation) — accepts UUID, name, or IP
- `find_issues` — Scan all infrastructure for unhealthy resources and unreachable servers

### Servers (6 tools)

- `list_servers` — List all servers (summary)
- `get_server` — Get server details
- `server` — Create, update, or delete a server (`action: create|update|delete`)
- `validate_server` — Validate server connection
- `server_resources` — List resources running on a server
- `server_domains` — List domains configured on a server

### Hetzner (1 tool)

- `hetzner` — Query datacenters, server types, images, SSH keys; create Hetzner Cloud servers

### Projects (1 tool)

- `projects` — Manage projects (`action: list|get|create|update|delete`)

### Environments (1 tool)

- `environments` — Manage environments (`action: list|get|create|delete`)

### Applications (4 tools)

- `list_applications` — List all applications (summary)
- `get_application` — Get application details
- `application` — Create, update, or delete an application (`action: create_public|create_github|create_key|create_dockerimage|create_dockerfile|update|delete`)
- `application_logs` — Get application logs

### Databases (4 tools)

- `list_databases` — List all databases (summary)
- `get_database` — Get database details
- `database` — Create, update, or delete a database (`action: create|update|delete`, supports postgresql, mysql, mariadb, mongodb, redis, keydb, clickhouse, dragonfly)
- `database_backups` — Manage backup schedules and execution history (`action: list_schedules|create|update|delete|list_executions`)

### Services (3 tools)

- `list_services` — List all services (summary)
- `get_service` — Get service details
- `service` — Create, update, or delete a service (`action: create|update|delete`)

### Control (1 tool)

- `control` — Start, stop, or restart applications, databases, or services (`resource: application|database|service, action: start|stop|restart`)

### Environment Variables (1 tool)

- `env_vars` — Manage env vars for applications, databases, or services (`resource: application|database|service, action: list|create|bulk_create|update|delete`)

### Deployments (3 tools)

- `list_deployments` — List running deployments (summary)
- `deploy` — Deploy by tag or UUID (supports PR preview)
- `deployment` — Get, cancel, or list deployments for an application (`action: get|cancel|list_for_app`)

### Private Keys (1 tool)

- `private_keys` — Manage SSH private keys (`action: list|get|create|update|delete`)

### GitHub Apps (1 tool)

- `github_apps` — Manage GitHub App integrations (`action: list|get|create|update|delete|list_repositories|list_branches`)

### Storages (1 tool)

- `storages` — Manage persistent volumes and file storage (`action: list|create|update|delete, resource_type: application|database|service`)

### Scheduled Tasks (1 tool)

- `scheduled_tasks` — Manage cron tasks and view execution history (`action: list|create|update|delete|list_executions, resource_type: application|service`)

### Cloud Tokens (1 tool)

- `cloud_tokens` — Manage cloud provider tokens for Hetzner and DigitalOcean (`action: list|get|create|update|delete|validate`)

### Teams (1 tool)

- `teams` — Query team and member information (`action: list|current|current_members|get|members`)

### Resources (1 tool)

- `list_resources` — Search all resources across types

### Batch Operations (4 tools)

- `restart_project_apps` — Restart all applications in a project
- `bulk_env_update` — Update or create env vars across multiple applications (upsert)
- `stop_all_apps` — Emergency stop all running applications (requires confirmation)
- `redeploy_project` — Force rebuild and redeploy all applications in a project

## Setup

### Environment Variables

```bash
COOLIFY_ACCESS_TOKEN=your-api-token  # Generate at Coolify Settings > API
COOLIFY_BASE_URL=https://your-coolify-instance.com  # optional, defaults to http://localhost:3000
```

### Usage with Claude Code (via npx)

Add to your MCP configuration (`.mcp.json` or `~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "coolify": {
      "command": "bunx",
      "args": ["@jurislm/coolify-mcp@latest"],
      "env": {
        "COOLIFY_ACCESS_TOKEN": "your-api-token",
        "COOLIFY_BASE_URL": "https://your-coolify-instance.com"
      }
    }
  }
}
```

### Usage with Claude Code Plugin (jurislm-tools)

If you use the [jurislm-tools](https://github.com/jurislm/jurislm-tools) Claude Code plugin, `jt:coolify` is included:

```
/plugin marketplace update jurislm-tools
```

Then set environment variables in `~/.zshenv`:

```bash
export COOLIFY_ACCESS_TOKEN=your-api-token
export COOLIFY_BASE_URL=https://your-coolify-instance.com
```

## Development

```bash
bun install
bun run build      # Compile TypeScript to dist/
bun run test       # Run tests
bun run lint       # ESLint (max-warnings=0)
```

## License

MIT
