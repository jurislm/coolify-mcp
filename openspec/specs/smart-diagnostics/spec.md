---
title: Smart Diagnostics Specification
version: 1.0.0
date: 2026-05-02
---

## Purpose

Define the behavior of the three diagnostic functions (`diagnoseApplication`, `diagnoseServer`, `findInfrastructureIssues`) that aggregate multiple Coolify API calls into a single structured health report.

## Requirements

### Requirement: diagnoseApplication must resolve a fuzzy query to a UUID before fetching diagnostic data

The `diagnose_app` MCP tool accepts a human-readable query string (UUID, name substring, or FQDN). The client calls `resolveApplicationUuid` to resolve it to a canonical UUID. If resolution fails the function returns an `ApplicationDiagnostic` with `application: null` and the resolution error in the `errors` array without making further API calls.

#### Scenario: Successful application diagnosis

- **WHEN** the query resolves to a valid application UUID
- **THEN** the client calls four APIs in parallel (`getApplication`, `getApplicationLogs` with 50 lines, `listApplicationEnvVars`, `listApplicationDeployments`) using `Promise.allSettled`
- **THEN** individual API failures are collected into the `errors` array and do not abort the overall response
- **THEN** the response contains: `application` (uuid, name, status, fqdn, git_repository, git_branch), `health` (status, issues), `logs`, `environment_variables` (count + key+is_build_time list), `recent_deployments` (last 5)

#### Scenario: Health status derivation for applications

- **WHEN** the application status contains both "running" and "healthy"
- **THEN** `health.status` is `"healthy"`
- **WHEN** the application status contains "exited", "unhealthy", or "error"
- **THEN** `health.status` is `"unhealthy"` and the raw status string is pushed into `health.issues`
- **WHEN** the last 5 deployments contain at least one with `status: "failed"`
- **THEN** `health.issues` records the failed count and `health.status` is forced to `"unhealthy"` even if container status is healthy

#### Scenario: Application resolution failure

- **WHEN** `resolveApplicationUuid` throws for the given query
- **THEN** the response is `{ application: null, health: { status: "unknown", issues: [] }, logs: null, environment_variables: { count: 0, variables: [] }, recent_deployments: [], errors: [<message>] }`

### Requirement: diagnoseServer must aggregate server details, resources, domains, and validation in parallel

The `diagnose_server` MCP tool resolves the query via `resolveServerUuid` then calls four APIs in parallel: `getServer`, `getServerResources`, `getServerDomains`, `validateServer`.

#### Scenario: Successful server diagnosis

- **WHEN** the query resolves to a valid server UUID
- **THEN** the response contains: `server` (uuid, name, ip, status, is_reachable), `health` (status, issues), `resources` (uuid, name, type, status), `domains` (ip, domains), `validation` (message, optional validation_logs)

#### Scenario: Health status derivation for servers

- **WHEN** `server.is_reachable` is `true`
- **THEN** `health.status` is `"healthy"`
- **WHEN** `server.is_reachable` is `false`
- **THEN** `health.status` is `"unhealthy"` and "Server is not reachable" is added to `health.issues`
- **WHEN** `server.is_usable` is `false`
- **THEN** "Server is not usable" is added to `health.issues` and status becomes `"unhealthy"`
- **WHEN** any resource has status containing "exited", "unhealthy", or "error"
- **THEN** the unhealthy resource count is added to `health.issues`

### Requirement: findInfrastructureIssues must scan all resource types and return a typed issues list

The `find_issues` MCP tool calls `listServers`, `listApplications`, `listDatabases`, `listServices` in parallel and classifies each resource as an issue when its status matches the unhealthy pattern.

#### Scenario: Infrastructure scan with issues found

- **WHEN** any server has `is_reachable: false`
- **THEN** an issue of `type: "server"` is appended with `issue: "Server is not reachable"`
- **WHEN** any application, database, or service has status containing "exited", "unhealthy", "error", or equals "stopped"
- **THEN** a typed issue is appended with the resource's uuid, name, type, and status string

#### Scenario: Clean infrastructure scan

- **WHEN** all resources are reachable and have healthy statuses
- **THEN** `issues` is an empty array and `summary.total_issues` is 0

#### Scenario: Response structure

- **THEN** the response always contains `summary` (total_issues, unhealthy_applications, unhealthy_databases, unhealthy_services, unreachable_servers) and `issues` array; `errors` is present only when one or more API calls failed
