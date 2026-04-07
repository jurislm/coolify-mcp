# OpenSpec Directory

This directory stores OpenSpec artifacts used for spec-driven change workflow in this repository.

## What is here

- `config.yaml`: Shared guidance and validation defaults for OpenSpec artifacts.
- `specs/`: Stable spec documents that define expected behavior and acceptance scenarios.
- `changes/`: Per-change proposal/design/tasks artifacts and archived change records.

## How it is used

- Authors draft or update specs before implementation.
- Specs provide reviewable, testable requirements for behavior.
- Implementation and tests should align with the requirements in these specs.

## Scope

These files are workflow and documentation artifacts. Runtime code is in `src/` and tests are in `src/__tests__/`.
