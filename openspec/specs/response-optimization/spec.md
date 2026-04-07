## Purpose

Define token-efficient response behavior and payload safety constraints for MCP responses.

## Requirements

### Requirement: List-style responses must prioritize token-efficient summaries

List-oriented operations MUST default to summary representations with essential identity and status fields instead of full nested resource payloads.

#### Scenario: Retrieve application list

- **WHEN** a client requests a list endpoint
- **THEN** the response returns compact summary objects suitable for discovery and navigation

#### Scenario: Retrieve single resource details

- **WHEN** a client requests a get endpoint for a specific resource
- **THEN** the response can include fuller details for troubleshooting and inspection

### Requirement: Responses may include actionable next-step hints

The server MUST attach action metadata that helps clients choose valid follow-up operations for the returned resource state.

#### Scenario: Running application response

- **WHEN** a response describes an application in a running state
- **THEN** action hints include operational follow-ups such as restart or stop and log inspection

#### Scenario: Non-running application response

- **WHEN** a response describes an application in a non-running state
- **THEN** action hints include an operation to start the application

### Requirement: Large log payloads must be truncated safely

Application log handling MUST enforce size limits to avoid unbounded payload growth while preserving useful recent output.

#### Scenario: Log content exceeds limits

- **WHEN** logs exceed configured line or character boundaries
- **THEN** output is truncated to the most recent content and clearly indicates truncation

#### Scenario: Log content within limits

- **WHEN** logs are below configured limits
- **THEN** logs are returned without truncation artifacts
