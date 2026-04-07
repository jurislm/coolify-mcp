## Purpose

Define client-side compatibility and payload normalization rules for Coolify API integration.

## Requirements

### Requirement: API client must normalize known Coolify field-compatibility differences

The client MUST transform caller-facing inputs into the field names and payload formats expected by Coolify API variants where known compatibility gaps exist.

#### Scenario: Domain field compatibility

- **WHEN** a caller provides application domain data using fqdn
- **THEN** the client maps input to Coolify-compatible domains payload fields before sending the request

#### Scenario: Docker compose payload compatibility

- **WHEN** a caller provides docker_compose_raw as plain text content
- **THEN** the client encodes content to base64 prior to API submission

### Requirement: Request payloads must drop undefined fields while preserving explicit false

The client MUST remove undefined values from outgoing payloads and MUST preserve explicit false boolean values.

#### Scenario: Optional fields omitted by caller

- **WHEN** a request object contains undefined optional fields
- **THEN** those fields are excluded from the final API payload

#### Scenario: Explicitly disabling boolean options

- **WHEN** a request object sets a boolean field to false
- **THEN** the false value remains in the outgoing payload

### Requirement: Resource identifier encoding must follow path type conventions

The client MUST URL-encode UUID-like path parameters and MUST stringify numeric identifiers according to endpoint conventions.

#### Scenario: UUID path parameter usage

- **WHEN** a request is made with UUID-like path parameters
- **THEN** the path value is encoded to avoid malformed URL or reserved character issues

#### Scenario: Numeric identifier usage

- **WHEN** a request is made with numeric identifiers (such as team IDs)
- **THEN** identifiers are stringified without additional URL encoding when endpoint semantics require raw numeric segments
