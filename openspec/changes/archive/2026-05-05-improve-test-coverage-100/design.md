## Context

`mcp-server.ts` 的 handler 測試採用 `TestableMcpServer`（繼承自 `CoolifyMcpServer`）加上 `callHandler()` helper 直接呼叫已註冊的 tool handler function，並以 `jest.spyOn()` mock 底層 client method。現有測試已覆蓋部分 handler；剩餘未覆蓋的 handler 集中在：database 建立（8 種引擎）、control tool、deployment tool、scheduled tasks、database backups、batch operations。

## Goals / Non-Goals

**Goals:**

- `mcp-server.ts` line coverage 達 100%
- `mcp-server.ts` function coverage 達 100%
- 所有 handler 的 success path 和 validation error path 均有測試
- 不修改任何 production code

**Non-Goals:**

- 不增加 integration tests（排除在 `bun run test` 之外的 `src/__tests__/integration/`）
- 不修改 `coolify-client.ts`（已達 100%）
- 不改變測試框架或 mock 策略

## Decisions

**決策 1：沿用 `callHandler()` + `jest.spyOn()` 模式**
所有新增測試均採用既有 `TestableMcpServer` + `callHandler()` + `jest.spyOn()` 模式，確保風格一致。

**決策 2：connect() 使用 mock Transport**
`connect()` 方法需要 `Transport` 物件。採用 `{ start: jest.fn().mockResolvedValue(undefined) }` 最小 mock（不需要完整 Transport 實作）。

**決策 3：批次測試按工具分組**
每個未覆蓋的工具建立獨立 `describe()` block，每個 action/branch 各一個 `it()`。避免一個巨大 describe 難以維護。

**決策 4：Validation error path 覆蓋方式**
對於需要特定參數的 action，傳入缺少必要欄位的 args，驗證回傳的 error text。

**決策 5：Database 建立引擎各自獨立 it()**
8 種引擎（postgresql 已存在、mysql/mariadb/mongodb/redis/keydb/dragonfly/clickhouse）各自一個 `it()`，mock `create<Type>` client method，驗證 dispatch 正確。

## Risks / Trade-offs

- `connect()` mock Transport 可能因 MCP SDK 版本更新而需調整，但 production code 穩定故風險低
- 覆蓋率數字依賴 bun test coverage 的行計算；實際 100% 需逐行驗證
