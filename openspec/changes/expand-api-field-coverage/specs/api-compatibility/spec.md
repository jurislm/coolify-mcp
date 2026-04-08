## ADDED Requirements

### Requirement: CreateStorageRequest supports fs_path

The `CreateStorageRequest` type SHALL include optional field `fs_path` (string) for directory-based file storage mounts.

#### Scenario: Create directory storage with fs_path

- **WHEN** a caller creates a storage with `fs_path: "/data/uploads"` and `is_directory: true`
- **THEN** the client includes `fs_path` in the POST request body
