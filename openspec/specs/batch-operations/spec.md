---
title: Batch Operations Specification
version: 1.0.0
date: 2026-05-02
---

## Purpose

Define the behavior of the four batch operation tools (`restart_project_apps`, `bulk_env_update`, `stop_all_apps`, `redeploy_project`) that fan out across multiple resources and return aggregated `BatchOperationResult` responses.

## Requirements

### Requirement: All batch operations must return a BatchOperationResult with summary, succeeded, and failed arrays

Every batch tool response contains:

- `summary`: `{ total, succeeded, failed }` integer counts
- `succeeded`: array of `{ uuid, name }` for each resource that completed without error
- `failed`: array of `{ uuid, name, error }` for each resource that threw an exception

When the filtered resource set is empty, the response is `{ summary: { total: 0, succeeded: 0, failed: 0 }, succeeded: [], failed: [] }` without making any API calls.

#### Scenario: Mixed success and failure

- **WHEN** some resources succeed and others throw errors during `Promise.allSettled`
- **THEN** successful resources appear in `succeeded` and failing resources appear in `failed` with the error message; the operation does not abort on first failure

### Requirement: restart_project_apps must restart all applications belonging to a project

#### Scenario: Restart project apps

- **WHEN** a caller provides a `project_uuid`
- **THEN** the client calls `listApplications()`, filters by `app.project_uuid === project_uuid`, then calls `restartApplication(uuid)` for each match in parallel

### Requirement: bulk_env_update must apply an environment variable to a caller-supplied list of application UUIDs

#### Scenario: Bulk environment variable update

- **WHEN** a caller provides `app_uuids`, `key`, `value`, and optional `is_build_time` (default: false)
- **THEN** the client fetches app names via `listApplications()` for richer response labels, then calls `updateApplicationEnvVar(uuid, { key, value, is_build_time })` for each UUID in parallel

### Requirement: stop_all_apps must require explicit confirmation and only stop running applications

The `stop_all_apps` tool uses a `confirm_stop_all_apps: true` literal parameter as a double confirmation guard. The MCP schema enforces `z.literal(true)` and the handler also checks at runtime.

#### Scenario: Emergency stop all running apps

- **WHEN** `confirm_stop_all_apps` is `true`
- **THEN** the client calls `listApplications()`, filters to apps whose status contains "running" or "healthy", then calls `stopApplication(uuid)` for each in parallel
- **WHEN** `confirm_stop_all_apps` is not `true`
- **THEN** the handler returns `"Error: confirm_stop_all_apps=true required"` without any API calls

### Requirement: redeploy_project must redeploy all applications in a project via force-deploy

#### Scenario: Redeploy project apps

- **WHEN** a caller provides `project_uuid` and optional `force` (default: `true`)
- **THEN** the client calls `listApplications()`, filters by `project_uuid`, then calls `deployByTagOrUuid(app.uuid, force)` for each app in parallel
