## Why

`mcp-server.ts` 目前 line coverage 僅 80.05%、function coverage 55.68%，距離 100% 仍有大量 handler 分支未被測試。未覆蓋的路徑包含 database 建立（8 種引擎）、control tool、deployment tool、batch operations、scheduled tasks、database backups 等核心功能，若這些分支出現 regression 將無法被自動偵測。

## What Changes

- 補齊 `src/__tests__/mcp-server.test.ts` 中所有缺失的 handler dispatch 測試
- 覆蓋 `connect()` 方法（transport mock）
- 覆蓋所有 database 建立引擎（mysql/mariadb/mongodb/redis/keydb/dragonfly/clickhouse）
- 覆蓋 application create success paths（create_public/create_github/create_key）
- 覆蓋 service update handler
- 覆蓋 env_vars tool 的 bulk_create、database env var create/update、service env var create/bulk_create
- 覆蓋 deployment tool 所有 action（list/get/cancel/list_for_app）含 HATEOAS pagination
- 覆蓋 scheduled_tasks tool 的 create/update/delete（application + service）
- 覆蓋 database_backups tool 的 create/update/delete/get_execution/delete_execution
- 覆蓋 batch operation tool（restart_project_apps/bulk_env_update/stop_all_apps/redeploy_project）
- 覆蓋 hetzner tool 剩餘分支

## Capabilities

### New Capabilities

- `connect-method-coverage`: 測試 `CoolifyMcpServer.connect()` 透過 mock Transport 呼叫
- `database-create-coverage`: 測試 database tool 建立 8 種引擎的 dispatch
- `application-create-coverage`: 測試 application create_public/create_github/create_key success paths
- `service-update-coverage`: 測試 service tool update handler dispatch
- `env-vars-coverage`: 測試 env_vars tool 的 database/service 路徑及 bulk_create
- `deployment-coverage`: 測試 deployment tool 所有 action（含 HATEOAS）
- `scheduled-tasks-coverage`: 測試 scheduled_tasks tool create/update/delete 對 application 及 service
- `database-backup-coverage`: 測試 database_backups tool create/update/delete/execution handlers
- `batch-ops-coverage`: 測試 4 個 batch operation handlers

### Modified Capabilities

## Impact

- 僅影響 `src/__tests__/mcp-server.test.ts`（純測試新增，不改 production code）
- 不影響現有 388 tests（只增加 tests）
- 覆蓋率目標：`mcp-server.ts` line coverage 100%、function coverage 100%
