# 貢獻指南

感謝你有興趣為本專案貢獻！本文件說明專案的維護機制以及如何參與。

## 專案維護

本專案設計為低維護成本，同時保持安全且持續更新。

### 自動化安全與依賴管理

**Dependabot** 每日執行，維持依賴項安全：

- **修補版/次要版本更新** → CI 通過後自動合併
- **主要版本更新** → 建立 PR 並附上審查清單，需人工核准
- **GitHub Actions** → 每週一更新

### API 相容性追蹤

本專案持續追蹤 Coolify API 的變動，以維持與最新版本的相容性。當 Coolify 新增、移除或變更端點時，請開 Issue 回報以便更新對應的工具。

### 分支保護

`main` 分支受到保護：

- 所有 CI 檢查必須通過（Node 20.x）
- 維護者可以 bypass
- 禁止 force push（維護者除外）

### CI 流程

每個 PR 會執行：

1. **格式檢查** — Prettier
2. **靜態分析** — ESLint
3. **建置** — TypeScript 編譯
4. **測試** — Jest（`bun run test`）

## 如何貢獻

### 回報問題

- **Bug** — 開一個 Issue 並附上重現步驟
- **功能需求** — 開一個 Issue 描述使用情境
- **API 差異** — 回報前請先檢查是否已有 `api-drift` 標籤的 Issue

### 提交變更

1. Fork 本儲存庫
2. 建立功能分支：`git checkout -b feature/your-feature`
3. 進行修改
4. 執行測試：`bun run test`
5. 執行靜態分析：`bun run lint`
6. 使用 Conventional Commits 格式提交：`feat:`、`fix:`、`chore:` 等
7. 對 `main` 分支建立 PR

### 新增工具

當 Coolify 新增 API 端點時：

1. 查閱 [Coolify OpenAPI 規格](https://github.com/coollabsio/coolify/blob/main/openapi.yaml)
2. 在 `src/lib/coolify-client.ts` 新增客戶端方法
3. 在 `src/lib/mcp-server.ts` 新增 MCP 工具定義
4. 在 `src/__tests__/` 新增測試
5. 更新 README.md 和 CLAUDE.md 中的工具數量
6. 新增 CHANGELOG 條目

### 程式碼規範

- TypeScript 嚴格模式
- Prettier 格式化
- ESLint 靜態分析
- Conventional Commits 提交格式

## 架構概覽

```text
src/
├── index.ts              # 進入點
├── lib/
│   ├── coolify-client.ts # Coolify API 的 HTTP 客戶端
│   └── mcp-server.ts     # MCP 伺服器與工具定義
├── types/
│   └── coolify.ts        # TypeScript 型別定義
└── __tests__/            # Jest 測試
```

### 核心設計模式

- **摘要模式**：列表操作僅回傳最少欄位以減少 Token 使用量
- **智慧查詢**：診斷工具接受名稱/網域/IP，不限 UUID
- **Context 優化**：回應精簡至必要欄位
- **批次操作**：使用 `Promise.allSettled` 處理部分失敗情境

## 發布流程

本專案使用 [Release Please](https://github.com/googleapis/release-please) 自動管理版本與發布：

1. 依循 Conventional Commits 格式提交（`feat:` → MINOR、`fix:` → PATCH、`feat!:` → MAJOR）
2. Release Please 自動建立版本 PR
3. 合併版本 PR 後，GitHub Actions 自動發布至 npm

## 問題與討論

- [GitHub Issues](https://github.com/jurislm/coolify-mcp/issues)
- [Coolify 社群](https://coolify.io/docs/contact)
