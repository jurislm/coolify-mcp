## 1. 確認真實 API 回傳形狀（先做，避免盲修）

- [x] 1.1 在 `.worktrees/develop` 確認當前位置：`git worktree list && pwd && git branch --show-current`
- [x] 1.2 檢查 `.env` 是否有 `COOLIFY_BASE_URL` 與 `COOLIFY_ACCESS_TOKEN`（從 `~/.zshenv` 載入）；不夠則告知使用者並暫停
- [x] 1.3 寫一支臨時 probe（`bun -e` inline）打 `GET /deployments/applications/{uuid}` 對 issue 列出的三個 app，印出 `typeof response`、`Array.isArray`、top-level keys
- [x] 1.4 把 raw shape 摘要寫入 `openspec/changes/fix-diagnose-app-deployments-shape/verification-logs/2026-05-05-deployments-shape-probe.md`（不存 raw response，只記 keys 與型別）
- [x] 1.5 探查完刪除臨時 probe script（用 inline `bun -e`，無實體檔案需刪）
- [x] 1.6 統一環境變數短名 `COOLIFY_URL` / `COOLIFY_TOKEN`：
  - `src/__tests__/integration/*.test.ts` 維持原本短名（reverted my earlier edit）
  - `src/index.ts` 改為主讀短名、fallback 長名（backward compat）
  - `README.md`、`CLAUDE.md` 範例改為短名，附 deprecation note
  - 短名是 canonical，長名 deprecated 於下個 major
  - 提醒使用者更新 `~/.zshenv`：`COOLIFY_BASE_URL` → `COOLIFY_URL`、`COOLIFY_ACCESS_TOKEN` → `COOLIFY_TOKEN`

## 2. 實作 client 層 normalization

- [x] 2.1 在 `src/lib/coolify-client.ts` 內新增 module-private `normalizeDeploymentsResponse(raw: unknown): Deployment[]` helper，依 design.md Decision 2 的順序：`Array.isArray` → `data` 鍵 → `deployments` 鍵 → fallback `[]`
- [x] 2.2 fallback 命中時 `console.warn` 印出 `typeof raw` + 若為 object 則印 `Object.keys(raw)`，不印 raw value（避免洩漏內容）
- [x] 2.3 修改 `listApplicationDeployments`：把 `request<Deployment[]>` 改為 `request<unknown>`，呼叫 `normalizeDeploymentsResponse` 後回傳，保持 `Promise<Deployment[]>` 簽章不變
- [x] 2.4 確認 `diagnoseApplication` 內 `deployments.slice(0, 5).filter(...)` 不需修改（因為 `deployments` 現在保證為 array 或 null — null 已被 line 1749 `if (deployments)` guard 處理）

## 3. Unit tests（required for codecov）

- [x] 3.1 在 `src/__tests__/coolify-client.test.ts` 的 `listApplicationDeployments` describe 區塊新增 5 個 case：bare array / `data` wrapper / `{ count, deployments }` wrapper（實機 shape）/ unrecognized object / `null`
- [x] 3.2 新增 2 個 `diagnoseApplication` mock test：`{ count, deployments }` wrapper（實機）+ unrecognized shape；皆斷言 `errors` 不含 `slice`
- [x] 3.3 跑 `bun run test` 全綠（383 pass / 0 fail）

## 4. Integration smoke test

- [x] 4.1 在 `src/__tests__/integration/diagnostics.integration.test.ts` 新增 self-discovery 的 issue #24 regression test（runtime 從 `listApplications` 找真實 app UUID，避免 hardcode 環境特定值；可選 `INTEGRATION_APP_UUID` 覆寫）
- [x] 4.2 跑 `bun run test:integration` 確認 regression test 通過（3 個既有失敗為 stale TEST_DATA，不在本 change 範圍）
- [x] 4.3 把 integration 結果寫入 verification log

## 5. 品質檢核（commit 前必須全綠）

- [x] 5.1 `bun run build` 全綠（修正 root cause：`bun install` 同步 lockfile + `tsconfig.json` exclude `__tests__`，避免 prepublishOnly 失敗阻擋 npm publish）
- [x] 5.2 `bun run test` 全綠（383 pass / 0 fail unit；10 pass / 0 fail integration — 修好 3 個既有 stale TEST_DATA 測試，改為 self-discovery）
- [x] 5.3 `bun run lint` 0 errors / 0 warnings
- [x] 5.4 `bun run format:check` 全部通過

## 6. 文件更新

- [x] 6.1 ~~`CHANGELOG.md` 手改~~ — Release Please 從 `fix:` commit 自動產生 entry，不手動編輯（沿襲 v3.3.1 等既有作法）
- [x] 6.2 `CLAUDE.md` 的 Coolify API Gotchas 段加一條：「`/deployments/applications/{uuid}` 回傳 `{ count, deployments: [...] }` wrapper（非 array），client 已自動歸一化」
- [x] 6.3 `README.md` env vars 段已在 task 1.6 同步更新（短名 + deprecation note）

## 7. Commit & PR

- [x] 7.1 `git status` 確認所有改動位於 develop worktree 範圍
- [x] 7.2 拆兩個 commit：`fix:` (dae1439) + `chore:` (5437729)
- [x] 7.3 推 develop 分支
- [x] 7.4 PR #25 建立：https://github.com/jurislm/coolify-mcp/pull/25
- [x] 7.5 設 label `bug` + assignee `terry90918`（REST API）

## 8. Post-merge

- [ ] 8.1 等 Release Please 開 release PR，merge 後從 main `npm publish --access public`
- [ ] 8.2 在 issue #24 留言確認 fix 已 release，附 npm 版本號
- [ ] 8.3 archive 此 change：`openspec archive fix-diagnose-app-deployments-shape` 並把 `verification-logs/` 一併保留
