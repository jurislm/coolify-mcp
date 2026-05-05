## ADDED Requirements

### Requirement: application create_public dispatches to createApplicationPublic

The `application` tool `create_public` action SHALL call `client.createApplicationPublic` with all required fields (lines 588-600).

#### Scenario: create_public with all required fields dispatches correctly

- **WHEN** `application` tool is called with `{ action: 'create_public', project_uuid: 'p', server_uuid: 's', git_repository: 'https://github.com/x/y', git_branch: 'main', build_pack: 'nixpacks', ports_exposes: '3000' }`
- **THEN** `client.createApplicationPublic` is called with those fields

### Requirement: application create_github dispatches to createApplicationPrivateGH

The `application` tool `create_github` action SHALL call `client.createApplicationPrivateGH` with all required fields (lines 620-633).

#### Scenario: create_github with required fields dispatches correctly

- **WHEN** `application` tool is called with `{ action: 'create_github', project_uuid: 'p', server_uuid: 's', github_app_uuid: 'g', git_repository: 'repo', git_branch: 'main' }`
- **THEN** `client.createApplicationPrivateGH` is called with those fields

### Requirement: application create_key dispatches to createApplicationPrivateKey

The `application` tool `create_key` action SHALL call `client.createApplicationPrivateKey` with all required fields (lines 653-666).

#### Scenario: create_key with required fields dispatches correctly

- **WHEN** `application` tool is called with `{ action: 'create_key', project_uuid: 'p', server_uuid: 's', private_key_uuid: 'k', git_repository: 'repo', git_branch: 'main' }`
- **THEN** `client.createApplicationPrivateKey` is called with those fields

### Requirement: application delete dispatches to deleteApplication

The `application` tool `delete` action SHALL call `client.deleteApplication` (line 775).

#### Scenario: delete with uuid dispatches to deleteApplication

- **WHEN** `application` tool is called with `{ action: 'delete', uuid: 'app-uuid' }`
- **THEN** `client.deleteApplication` is called with `'app-uuid'`
