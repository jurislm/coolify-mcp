---
title: Tool Registry Specification
version: 1.0.0
date: 2026-04-07
---

## Purpose

Define the required MCP tool surface for consolidated Coolify infrastructure management. This spec describes tool existence and error-safety requirements only. Behavioral semantics for each tool family are documented in their respective feature specs:

- [hetzner-integration](../hetzner-integration/spec.md) — Hetzner Cloud provisioning
- [smart-diagnostics](../smart-diagnostics/spec.md) — diagnose_app, diagnose_server, find_issues
- [database-backups](../database-backups/spec.md) — backup schedule and execution management
- [storages](../storages/spec.md) — persistent volume mounts for apps, databases, services
- [scheduled-tasks](../scheduled-tasks/spec.md) — cron-style tasks for apps and services
- [cloud-tokens](../cloud-tokens/spec.md) — cloud provider API token CRUD and validation
- [batch-operations](../batch-operations/spec.md) — restart_project_apps, bulk_env_update, stop_all_apps, redeploy_project
- [github-apps](../github-apps/spec.md) — GitHub App CRUD and repo/branch enumeration

## Requirements

### Requirement: MCP server must expose consolidated infrastructure management tools

The server MUST register tools for infrastructure management that cover discovery, diagnostics, CRUD, runtime control, and operational workflows across servers, projects, environments, applications, databases, and services.

#### Scenario: Register baseline discovery tools

- **WHEN** the MCP server is initialized
- **THEN** it exposes read-oriented discovery tools including version and list/get style operations for major resource types

#### Scenario: Register consolidated action tools

- **WHEN** the MCP server is initialized
- **THEN** it exposes action-parameterized tools for multi-operation domains (for example create/update/delete or start/stop/restart)

### Requirement: MCP server must include operational support tools beyond CRUD

The server MUST expose tools for environment variable management, deployments, private keys, GitHub app integration, storage, scheduled tasks, cloud tokens, team operations, diagnostics, and batch operations.

#### Scenario: Register operational tool families

- **WHEN** a client inspects the available toolset
- **THEN** operational families are present for deployment orchestration, diagnostics, and maintenance workflows

#### Scenario: Register health verification tool

- **WHEN** a client needs a quick backend status check
- **THEN** a health-oriented tool is available without requiring resource UUID input

### Requirement: Tool handlers must provide consistent error-safe responses

Tool handlers MUST return structured text payloads and convert thrown runtime errors into explicit user-visible error responses.

#### Scenario: Successful tool execution

- **WHEN** a tool handler completes without error
- **THEN** the response contains serialized structured data

#### Scenario: Failed tool execution

- **WHEN** a tool handler throws an exception
- **THEN** the response contains an explicit error message instead of crashing the server
