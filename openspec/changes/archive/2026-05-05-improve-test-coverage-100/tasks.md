## 1. connect() method coverage

- [x] 1.1 Add `describe('CoolifyMcpServer connect()')` block with a test that calls `server.connect()` using `{ start: jest.fn().mockResolvedValue(undefined) }` and verifies it resolves (lines 173-176)

## 2. database create — remaining 7 engine types

- [x] 2.1 Add `it('create mysql')` — spy `client.createMysql`, call `database` tool with `type:'mysql'`, assert spy called (lines 979-986)
- [x] 2.2 Add `it('create mariadb')` — spy `client.createMariadb` (lines 990-997)
- [x] 2.3 Add `it('create mongodb')` — spy `client.createMongodb` (lines 1001-1007)
- [x] 2.4 Add `it('create redis')` — spy `client.createRedis` (lines 1011-1015)
- [x] 2.5 Add `it('create keydb')` — spy `client.createKeydb` (line 1019)
- [x] 2.6 Add `it('create clickhouse')` — spy `client.createClickhouse` (lines 1023-1027)
- [x] 2.7 Add `it('create dragonfly')` — spy `client.createDragonfly` (lines 1031-1034)

## 3. application create_public / create_github / create_key / delete

- [x] 3.1 Add `it('create_public dispatches')` — spy `client.createApplicationPublic`, call with all required fields (lines 588-600)
- [x] 3.2 Add `it('create_github dispatches')` — spy `client.createApplicationPrivateGH` (lines 620-633)
- [x] 3.3 Add `it('create_key dispatches')` — spy `client.createApplicationPrivateKey` (lines 653-666)
- [x] 3.4 Add `it('delete dispatches')` — spy `client.deleteApplication`, call with uuid (line 775)

## 4. service get_service + service update

- [x] 4.1 Add `it('get_service dispatches')` — spy `client.getService`, call `get_service` tool with uuid (line 1058)
- [x] 4.2 Add `it('service update dispatches')` — spy `client.updateService`, call `service` tool with `action:'update'`, uuid, and name (lines 1128-1136)
- [x] 4.3 Add `it('service update without uuid returns error')` — call with action:'update' and no uuid (lines 1126-1127)

## 5. env_vars — database paths, service paths, application bulk_create, list_deployments HATEOAS

- [x] 5.1 Add `it('application bulk_create dispatches')` — spy `client.bulkUpdateApplicationEnvVars`, call env_vars tool with `resource:'application', action:'bulk_create', bulk_data:[...]` (line 1300)
- [x] 5.2 Add `it('database create dispatches')` — spy `client.createDatabaseEnvVar` (lines 1311-1317)
- [x] 5.3 Add `it('database update dispatches')` — spy `client.updateDatabaseEnvVar` (lines 1323-1329)
- [x] 5.4 Add `it('service create dispatches')` — spy `client.createServiceEnvVar` (lines 1350-1356)
- [x] 5.5 Add `it('service bulk_create dispatches')` — spy `client.bulkUpdateServiceEnvVars` (lines ~1370-1374)
- [x] 5.6 Add `it('list_deployments includes _pagination')` — spy `client.listDeployments`, call `list_deployments`, assert response text contains `_pagination` (lines 1390-1394)

## 6. deployment tool — get with/without logs, cancel, list_for_app

- [x] 6.1 Add `it('deployment get without lines returns HATEOAS')` — spy `client.getDeployment`, call with `action:'get'`, assert `_actions` in response text (lines 1448-1451)
- [x] 6.2 Add `it('deployment get with lines includes logs')` — spy `client.getDeployment` returning `{ uuid: 'x', logs: '...' }`, call with `action:'get', lines:10`, assert response (lines 1434-1445)
- [x] 6.3 Add `it('deployment cancel dispatches')` — spy `client.cancelDeployment` (line 1453)
- [x] 6.4 Add `it('deployment list_for_app dispatches')` — spy `client.listApplicationDeployments` (lines 1454-1455)

## 7. teams get/members + private_keys create/update/delete

- [x] 7.1 Add `it('teams get without id returns error')` (lines 1478-1479)
- [x] 7.2 Add `it('teams get dispatches to getTeam')` — spy `client.getTeam`, call with id:1 (line 1480)
- [x] 7.3 Add `it('teams members without id returns error')` (lines 1481-1482)
- [x] 7.4 Add `it('teams members dispatches to getTeamMembers')` — spy `client.getTeamMembers` (line 1483)
- [x] 7.5 Add `it('private_keys create dispatches')` — spy `client.createPrivateKey`, call with private_key (lines 1511-1519)
- [x] 7.6 Add `it('private_keys update without uuid returns error')` (lines 1521-1522)
- [x] 7.7 Add `it('private_keys update dispatches')` — spy `client.updatePrivateKey`, call with uuid (lines 1523-1525)
- [x] 7.8 Add `it('private_keys delete without uuid returns error')` (lines 1527-1528)
- [x] 7.9 Add `it('private_keys delete dispatches')` — spy `client.deletePrivateKey`, call with uuid (line 1529)

## 8. github_apps list/get/create + database_backups get_execution/create/update + storages

- [x] 8.1 Add `it('github_apps list dispatches')` — spy `client.listGitHubApps` (lines 1579-1582)
- [x] 8.2 Add `it('github_apps get without id returns error')` (lines 1586-1586)
- [x] 8.3 Add `it('github_apps get dispatches')` — mock `listGitHubApps` returning `[{id:1}]`, call with id:1 (lines 1587-1590)
- [x] 8.4 Add `it('github_apps create dispatches')` — spy `client.createGitHubApp`, call with all required fields (lines 1613-1627)
- [x] 8.5 Add `it('database_backups get_execution dispatches')` — spy `client.getBackupExecution` (line 1735)
- [x] 8.6 Add `it('database_backups create without frequency returns error')` (lines 1754-1755)
- [x] 8.7 Add `it('database_backups create dispatches')` — spy `client.createDatabaseBackup` (lines 1756-1790)
- [x] 8.8 Add `it('database_backups update without backup_uuid returns error')` (lines 1794-1795)
- [x] 8.9 Add `it('database_backups update dispatches')` — spy `client.updateDatabaseBackup` (lines 1796-1830)
- [x] 8.10 Add `it('storages list application dispatches')` — spy `client.listApplicationStorages` (line 1899)
- [x] 8.11 Add `it('storages list database dispatches')` — spy `client.listDatabaseStorages` (line 1900)
- [x] 8.12 Add `it('storages list service dispatches')` — spy `client.listServiceStorages` (line 1902)
- [x] 8.13 Add `it('storages create application dispatches')` — spy `client.createApplicationStorage` (lines ~1948-1949)
- [x] 8.14 Add `it('storages update application dispatches')` — spy `client.updateApplicationStorage` (lines ~1975-1976)
- [x] 8.15 Add `it('storages delete application dispatches')` — spy `client.deleteApplicationStorage` (lines ~1989-1990)

## 9. batch operations — bulk_env_update + restart/stop/redeploy

- [x] 9.1 Add `it('bulk_env_update dispatches')` — spy `client.bulkEnvUpdate`, call with app_uuids/key/value (line 2188)
- [x] 9.2 Add `it('restart_project_apps dispatches')` — spy `client.restartProjectApps`
- [x] 9.3 Add `it('stop_all_apps dispatches')` — spy `client.stopAllApps`, call with `confirm_stop_all_apps:true`
- [x] 9.4 Add `it('redeploy_project dispatches')` — spy `client.redeployProjectApps`
