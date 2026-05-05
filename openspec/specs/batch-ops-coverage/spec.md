# batch-ops-coverage Specification

## Purpose

TBD - created by archiving change improve-test-coverage-100. Update Purpose after archive.

## Requirements

### Requirement: github_apps list dispatches to listGitHubApps

The `github_apps` tool `list` action SHALL call `client.listGitHubApps` (lines 1579-1582).

#### Scenario: github_apps list dispatches correctly

- **WHEN** `github_apps` tool is called with `{ action: 'list' }`
- **THEN** `client.listGitHubApps` is called

### Requirement: github_apps get dispatches to listGitHubApps and finds by id

The `github_apps` tool `get` action SHALL require `id`, call `client.listGitHubApps`, and return the matching app (lines 1587-1590).

#### Scenario: github_apps get without id returns validation error

- **WHEN** `github_apps` tool is called with `{ action: 'get' }` (id omitted)
- **THEN** the response content text contains `'Error: id required'`

#### Scenario: github_apps get dispatches correctly

- **WHEN** `github_apps` tool is called with `{ action: 'get', id: 1 }` and `client.listGitHubApps` returns `[{ id: 1, name: 'MyApp' }]`
- **THEN** the response text contains `'MyApp'`

### Requirement: github_apps create dispatches to createGitHubApp

The `github_apps` tool `create` action SHALL require all mandatory fields and call `client.createGitHubApp` (lines 1613-1627).

#### Scenario: github_apps create with all required fields dispatches correctly

- **WHEN** `github_apps` tool is called with all required fields for create action
- **THEN** `client.createGitHubApp` is called

### Requirement: bulk_env_update dispatches to client.bulkEnvUpdate

The `bulk_env_update` tool SHALL call `client.bulkEnvUpdate` with the given parameters (line 2188).

#### Scenario: bulk_env_update dispatches correctly

- **WHEN** `bulk_env_update` tool is called with `{ app_uuids: ['a', 'b'], key: 'MY_KEY', value: 'val' }`
- **THEN** `client.bulkEnvUpdate` is called with `['a', 'b']`, `'MY_KEY'`, `'val'`, `undefined`

### Requirement: restart_project_apps dispatches to client.restartProjectApps

The `restart_project_apps` tool SHALL call `client.restartProjectApps` with the given project_uuid.

#### Scenario: restart_project_apps dispatches correctly

- **WHEN** `restart_project_apps` tool is called with `{ project_uuid: 'proj-uuid' }`
- **THEN** `client.restartProjectApps` is called with `'proj-uuid'`

### Requirement: stop_all_apps dispatches to client.stopAllApps

The `stop_all_apps` tool SHALL call `client.stopAllApps` when `confirm_stop_all_apps=true`.

#### Scenario: stop_all_apps dispatches correctly

- **WHEN** `stop_all_apps` tool is called with `{ confirm_stop_all_apps: true }`
- **THEN** `client.stopAllApps` is called

### Requirement: redeploy_project dispatches to client.redeployProjectApps

The `redeploy_project` tool SHALL call `client.redeployProjectApps` with the given project_uuid.

#### Scenario: redeploy_project dispatches correctly

- **WHEN** `redeploy_project` tool is called with `{ project_uuid: 'proj-uuid' }`
- **THEN** `client.redeployProjectApps` is called with `'proj-uuid'`
