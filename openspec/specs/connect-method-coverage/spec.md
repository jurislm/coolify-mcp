# connect-method-coverage Specification

## Purpose

TBD - created by archiving change improve-test-coverage-100. Update Purpose after archive.

## Requirements

### Requirement: connect() method is covered by test

`CoolifyMcpServer.connect()` SHALL be exercised in the test suite so that lines 173-176 are covered.

#### Scenario: connect() delegates to super.connect with mock transport

- **WHEN** a `TestableMcpServer` is constructed and `connect()` is called with a minimal mock Transport `{ start: jest.fn().mockResolvedValue(undefined) }`
- **THEN** the call resolves without error and the mock transport's `start` has been invoked
