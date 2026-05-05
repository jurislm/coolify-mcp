# deployment-coverage Specification

## Purpose

TBD - created by archiving change improve-test-coverage-100. Update Purpose after archive.

## Requirements

### Requirement: deployment get without logs returns deployment with HATEOAS actions

The `deployment` tool `get` action without `lines` param SHALL call `wrapWithActions` and return a deployment object with `_actions` (lines 1448-1451).

#### Scenario: deployment get without lines returns HATEOAS actions

- **WHEN** `deployment` tool is called with `{ action: 'get', uuid: 'dep-uuid' }`
- **THEN** `client.getDeployment` is called and the response text contains `_actions`

### Requirement: deployment get with lines includes truncated logs

The `deployment` tool `get` action with `lines` param SHALL fetch deployment with logs and truncate them (lines 1434-1445).

#### Scenario: deployment get with lines parameter includes logs

- **WHEN** `deployment` tool is called with `{ action: 'get', uuid: 'dep-uuid', lines: 100 }`
- **THEN** `client.getDeployment` is called with `{ includeLogs: true }` and the response includes the deployment data

### Requirement: deployment cancel dispatches to cancelDeployment

The `deployment` tool `cancel` action SHALL call `client.cancelDeployment` (line 1453).

#### Scenario: deployment cancel dispatches correctly

- **WHEN** `deployment` tool is called with `{ action: 'cancel', uuid: 'dep-uuid' }`
- **THEN** `client.cancelDeployment` is called with `'dep-uuid'`

### Requirement: deployment list_for_app dispatches to listApplicationDeployments

The `deployment` tool `list_for_app` action SHALL call `client.listApplicationDeployments` (lines 1454-1455).

#### Scenario: deployment list_for_app dispatches correctly

- **WHEN** `deployment` tool is called with `{ action: 'list_for_app', uuid: 'app-uuid' }`
- **THEN** `client.listApplicationDeployments` is called with `'app-uuid'`
