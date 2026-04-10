# Coolify MCP Server

[![npm version](https://img.shields.io/npm/v/@jurislm/coolify-mcp.svg)](https://www.npmjs.com/package/@jurislm/coolify-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@jurislm/coolify-mcp.svg)](https://www.npmjs.com/package/@jurislm/coolify-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@jurislm/coolify-mcp.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/jurislm/coolify-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/jurislm/coolify-mcp/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jurislm/coolify-mcp/branch/main/graph/badge.svg)](https://codecov.io/gh/jurislm/coolify-mcp)

> **最完整的 Coolify MCP 伺服器** — 43 個 Token 優化工具、智慧診斷與批次操作，透過 AI 助理管理你的自架 PaaS 平台。

[Coolify](https://coolify.io/) 的 Model Context Protocol (MCP) 伺服器，讓 AI 助理能以自然語言管理和除錯 Coolify 實例。

## 功能特色

本 MCP 伺服器提供 **43 個 Token 優化工具**，涵蓋**除錯、管理與部署**：

| 分類            | 工具                                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| **基礎設施**    | `get_infrastructure_overview`, `get_mcp_version`, `get_version`, `health`                                        |
| **智慧診斷**    | `diagnose_app`, `diagnose_server`, `find_issues`                                                                 |
| **批次操作**    | `restart_project_apps`, `bulk_env_update`, `stop_all_apps`, `redeploy_project`                                   |
| **伺服器**      | `list_servers`, `get_server`, `server` (建立/更新/刪除), `validate_server`, `server_resources`, `server_domains` |
| **Hetzner**     | `hetzner` (查詢機房/規格/映像/SSH 金鑰，建立 Hetzner 雲端伺服器)                                                 |
| **專案**        | `projects` (列表/取得/建立/更新/刪除)                                                                            |
| **環境**        | `environments` (列表/取得/建立/刪除)                                                                             |
| **應用程式**    | `list_applications`, `get_application`, `application` (5 種建立方式/更新/刪除), `application_logs`               |
| **資料庫**      | `list_databases`, `get_database`, `database` (8 種類型建立/更新/刪除), `database_backups` (排程 CRUD/執行記錄)   |
| **服務**        | `list_services`, `get_service`, `service` (建立/更新/刪除)                                                       |
| **控制**        | `control` (啟動/停止/重啟應用程式、資料庫、服務)                                                                 |
| **環境變數**    | `env_vars` (應用程式/服務/資料庫的 CRUD 及批量更新)                                                              |
| **部署**        | `list_deployments`, `deploy` (含 PR preview 支援), `deployment` (取得/取消/列出應用部署)                         |
| **私鑰**        | `private_keys` (列表/取得/建立/更新/刪除)                                                                        |
| **GitHub Apps** | `github_apps` (列表/取得/建立/更新/刪除/列出儲存庫/列出分支)                                                     |
| **儲存空間**    | `storages` (應用程式/資料庫/服務的持久化磁碟區與檔案儲存)                                                        |
| **排程任務**    | `scheduled_tasks` (應用程式/服務的 cron 任務管理)                                                                |
| **雲端 Token**  | `cloud_tokens` (Hetzner/DigitalOcean 供應商 Token 管理)                                                          |
| **團隊**        | `teams` (列表/目前團隊/成員查詢)                                                                                 |
| **資源**        | `list_resources` (跨類型搜尋所有資源)                                                                            |

### Token 優化設計

透過將相關操作整合為帶有 action 參數的單一工具，Token 使用量比原始實作**減少 85%**（從約 43,000 降至約 6,600 Token），有效防止 AI 助理的 Context Window 耗盡。

## 安裝

### 前置需求

- Node.js >= 18
- 運作中的 Coolify 實例（已測試 v4.0.0-beta.471）
- Coolify API Token（於 Coolify 設定 > API 中產生）

### Claude Code（via npx）

新增至 MCP 設定檔（`.mcp.json` 或 `~/.claude/settings.json`）：

```json
{
  "mcpServers": {
    "coolify": {
      "command": "npx",
      "args": ["-y", "@jurislm/coolify-mcp@latest"],
      "env": {
        "COOLIFY_ACCESS_TOKEN": "your-api-token",
        "COOLIFY_BASE_URL": "https://your-coolify-instance.com"
      }
    }
  }
}
```

### Claude Code Plugin（jurislm-tools）

如果你使用 [jurislm-tools](https://github.com/jurislm/jurislm-tools) Claude Code plugin，`jt:coolify` 已包含在內：

```
/plugin marketplace update jurislm-tools
```

在 `~/.zshenv` 設定環境變數：

```bash
export COOLIFY_ACCESS_TOKEN=your-api-token
export COOLIFY_BASE_URL=https://your-coolify-instance.com
```

### Claude Desktop

新增至 Claude Desktop 設定檔（macOS：`~/Library/Application Support/Claude/claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "coolify": {
      "command": "npx",
      "args": ["-y", "@jurislm/coolify-mcp@latest"],
      "env": {
        "COOLIFY_ACCESS_TOKEN": "your-api-token",
        "COOLIFY_BASE_URL": "https://your-coolify-instance.com"
      }
    }
  }
}
```

## Context 優化回應

### 為什麼這很重要

Coolify API 回傳的資料極為冗長——單一應用程式可能包含 91 個欄位，內嵌 3KB 的伺服器物件和 47KB 的 docker-compose 檔案。列出 20 個以上的應用程式時，回應可能超過 200KB，會迅速耗盡 AI 助理的 Context Window。

**本 MCP 伺服器預設回傳優化摘要來解決此問題。**

### 運作方式

| 工具類型                      | 回傳內容                     | 使用情境                   |
| ----------------------------- | ---------------------------- | -------------------------- |
| `list_*`                      | 僅摘要（uuid、名稱、狀態等） | 探索、尋找資源             |
| `get_*`                       | 單一資源的完整詳情           | 深入檢查、除錯             |
| `get_infrastructure_overview` | 所有資源的一次性摘要         | 從這裡開始了解你的基礎設施 |

### 回應大小比較

| 端點                  | 完整回應 | 摘要回應   | 縮減幅度 |
| --------------------- | -------- | ---------- | -------- |
| list_applications     | ~170KB   | ~4.4KB     | **97%**  |
| list_services         | ~367KB   | ~1.2KB     | **99%**  |
| list_servers          | ~4KB     | ~0.4KB     | **90%**  |
| list_application_envs | ~3KB/var | ~0.1KB/var | **97%**  |
| deployment get        | ~13KB    | ~1KB       | **92%**  |

### HATEOAS 風格的回應動作

回應中包含建議下一步操作的 `_actions`：

```json
{
  "data": { "uuid": "abc123", "status": "running" },
  "_actions": [
    { "tool": "application_logs", "args": { "uuid": "abc123" }, "hint": "查看日誌" },
    {
      "tool": "control",
      "args": { "resource": "application", "action": "restart", "uuid": "abc123" },
      "hint": "重新啟動"
    }
  ],
  "_pagination": { "next": { "tool": "list_applications", "args": { "page": 2 } } }
}
```

這有助於 AI 助理理解邏輯上的下一步操作，而不消耗額外 Token。

### 建議工作流程

1. **從總覽開始**：`get_infrastructure_overview` — 一次查看所有資源
2. **尋找目標**：`list_applications` — 取得所需資源的 UUID
3. **深入了解**：`get_application(uuid)` — 單一資源的完整詳情
4. **執行操作**：`control(resource: 'application', action: 'restart')`、`application_logs(uuid)` 等

### 分頁

所有列表端點支援可選的分頁功能，適用於大型部署環境：

```bash
# 取得第 2 頁，每頁 10 筆
list_applications(page=2, per_page=10)
```

## 使用範例

### 入門

```text
顯示我的基礎設施總覽
列出所有應用程式
我的伺服器上有什麼在運行？
```

### 除錯與監控

```text
診斷 my-app 應用程式
檢查伺服器 192.168.1.100 的狀態
掃描基礎設施中的問題
取得應用程式 {uuid} 的日誌
顯示應用程式 {uuid} 的環境變數
顯示應用程式 {uuid} 的最近部署記錄
伺服器 {uuid} 上運行了哪些資源？
```

### 應用程式管理

```text
重啟應用程式 {uuid}
停止資料庫 {uuid}
啟動服務 {uuid}
強制重建並部署應用程式 {uuid}
更新應用程式 {uuid} 的 DATABASE_URL 環境變數
```

### 專案設定

```text
建立一個名為「my-app」的新專案
在專案 {uuid} 中建立 staging 環境
從私有 GitHub 儲存庫 org/repo 的 main 分支部署應用程式
部署 Docker Hub 上的 nginx:latest
從公開儲存庫 https://github.com/org/repo 部署
```

## 環境變數

| 變數                   | 必填 | 預設值                  | 說明               |
| ---------------------- | ---- | ----------------------- | ------------------ |
| `COOLIFY_ACCESS_TOKEN` | 是   | -                       | Coolify API Token  |
| `COOLIFY_BASE_URL`     | 否   | `http://localhost:3000` | Coolify 實例的網址 |

## 開發

```bash
# 複製與安裝
git clone https://github.com/jurislm/coolify-mcp.git
cd coolify-mcp
bun install

# 建置
bun run build

# 測試
bun run test

# 本機執行
COOLIFY_BASE_URL="https://your-coolify.com" \
COOLIFY_ACCESS_TOKEN="your-token" \
node dist/index.js
```

## 可用工具

### 基礎設施

- `get_version` — 取得 Coolify API 版本
- `get_mcp_version` — 取得 coolify-mcp 伺服器版本（用於確認安裝版本）
- `get_infrastructure_overview` — 取得所有基礎設施的概覽（伺服器、專案、應用程式、資料庫、服務）

### 智慧診斷

這些工具接受人類友善的識別碼，而不僅限 UUID：

- `diagnose_app` — 取得應用程式的全面診斷（狀態、日誌、環境變數、部署記錄）。接受 UUID、名稱或網域（例如 `my-app.example.com` 或 `my-app`）
- `diagnose_server` — 取得伺服器診斷（狀態、資源、網域、驗證結果）。接受 UUID、名稱或 IP 位址（例如 `coolify-apps` 或 `192.168.1.100`）
- `find_issues` — 掃描整個基礎設施，找出不健康的應用程式、資料庫、服務和無法連線的伺服器

### 伺服器

- `list_servers` — 列出所有伺服器（回傳摘要）
- `get_server` — 取得伺服器詳情
- `server` — 建立、更新或刪除伺服器（`action: create|update|delete`）
- `server_resources` — 取得伺服器上運行的資源
- `server_domains` — 取得伺服器設定的網域
- `validate_server` — 驗證伺服器連線

### 專案

- `projects` — 管理專案（`action: list|get|create|update|delete`）

### 環境

- `environments` — 管理環境（`action: list|get|create|delete`）

### 應用程式

- `list_applications` — 列出所有應用程式（回傳摘要）
- `get_application` — 取得應用程式詳情
- `application_logs` — 取得應用程式日誌
- `application` — 建立、更新或刪除應用程式（`action: create_public|create_github|create_key|create_dockerimage|create_dockerfile|update|delete`）
  - 支援從公開儲存庫、私有 GitHub、SSH 金鑰、Docker 映像或 Dockerfile 部署
  - 可設定健康檢查（路徑、間隔、重試次數等）
- `env_vars` — 管理環境變數（`resource: application, action: list|create|bulk_create|update|delete`）
- `control` — 啟動/停止/重啟（`resource: application, action: start|stop|restart`）

### 資料庫

- `list_databases` — 列出所有資料庫（回傳摘要）
- `get_database` — 取得資料庫詳情
- `database` — 建立、更新或刪除資料庫（`action: create|update|delete, type: postgresql|mysql|mariadb|mongodb|redis|keydb|clickhouse|dragonfly`）
- `database_backups` — 管理備份排程（`action: list_schedules|get_schedule|create|update|delete|list_executions|get_execution|delete_execution`）
  - 可設定備份頻率、保留策略、S3 儲存
  - 可啟用/停用排程而不刪除
  - 查看備份執行歷史記錄
- `env_vars` — 管理環境變數（`resource: database, action: list|create|bulk_create|update|delete`）
- `control` — 啟動/停止/重啟（`resource: database, action: start|stop|restart`）

### 服務

- `list_services` — 列出所有服務（回傳摘要）
- `get_service` — 取得服務詳情
- `service` — 建立、更新或刪除服務（`action: create|update|delete`）
- `env_vars` — 管理環境變數（`resource: service, action: list|create|delete`）
- `control` — 啟動/停止/重啟（`resource: service, action: start|stop|restart`）

### 儲存空間

- `storages` — 管理持久化磁碟區與檔案儲存（`action: list|create|update|delete, resource_type: application|database|service`）
  - 持久化磁碟區：具名 Docker volume，可選主機路徑
  - 檔案儲存：掛載的設定檔或目錄，可選內容
  - 服務儲存需要 `service_resource_uuid` 來指定子資源

### 部署

- `list_deployments` — 列出執行中的部署（回傳摘要）
- `deploy` — 依標籤或 UUID 部署
- `deployment` — 管理部署（`action: get|cancel|list_for_app`，支援 `lines` 參數限制日誌輸出量）

### 私鑰

- `private_keys` — 管理 SSH 金鑰（`action: list|get|create|update|delete`）

### GitHub Apps

- `github_apps` — 管理 GitHub App 整合（`action: list|get|create|update|delete|list_repositories|list_branches`）

### 排程任務

- `scheduled_tasks` — 管理 cron 任務（`action: list|create|update|delete|list_executions, resource_type: application|service`）
  - 可設定 cron 排程、指令、容器及啟用狀態
  - 查看執行歷史記錄以協助除錯

### 雲端 Token

- `cloud_tokens` — 管理雲端供應商 Token（`action: list|get|create|update|delete|validate`）
  - 支援 Hetzner 和 DigitalOcean 供應商 Token

### 團隊

- `teams` — 查詢團隊成員資訊（`action: list|current|current_members|get|members`）

### 批次操作

進階工具，可一次操作多個資源：

- `restart_project_apps` — 重啟專案中的所有應用程式
- `bulk_env_update` — 跨多個應用程式更新或建立環境變數（upsert 行為）
- `stop_all_apps` — 緊急停止所有運行中的應用程式（需確認）
- `redeploy_project` — 強制重建並重新部署專案中的所有應用程式

## 為什麼選擇 Coolify MCP？

- **Context 優化**：回應比原始 API 小 90-99%，防止 Context Window 耗盡
- **智慧查詢**：可用網域、IP 尋找資源，不限 UUID
- **批次操作**：重啟整個專案、批次更新環境變數、緊急停止所有應用程式
- **正式環境就緒**：完整的自動化測試、TypeScript 嚴格模式、完整的錯誤處理
- **持續同步**：持續追蹤 Coolify API 變更，協助維持相容性

## 相關連結

- [Coolify](https://coolify.io/) — 開源自架的 Heroku/Netlify/Vercel 替代方案
- [Model Context Protocol](https://modelcontextprotocol.io/) — 驅動 AI 工具整合的協定
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers) — 官方 MCP 伺服器目錄

## 貢獻

歡迎貢獻！請參閱 [CONTRIBUTING.md](CONTRIBUTING.md) 了解詳細指南。

## 授權

MIT 授權 — 詳見 [LICENSE](LICENSE)。

## 支援

- [GitHub Issues](https://github.com/jurislm/coolify-mcp/issues)
- [Coolify 社群](https://coolify.io/docs/contact)

---

<p align="center">
  <strong>如果覺得好用，請給專案一顆星星！</strong>
</p>
