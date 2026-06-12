# 17. API Documentation

## Overview

The backend exposes REST APIs under `/api`. Authentication APIs are public where appropriate; most product APIs require a JWT bearer token.

> **Note**  
> API examples are intentionally generic. Do not place real tokens, API keys, MongoDB URIs, or customer data in documentation examples.

Base URL examples:

- Local: `http://localhost:4000`
- Render: configured by deployment URL

Authentication header:

```http
Authorization: Bearer <accessToken>
```

## Health

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Backend health check. | No |
| POST | `/api/generate-testcases` | Generate test plan and optionally save output. | Yes |

Example generate request:

```json
{
  "requirement": "User can login with valid credentials",
  "testType": "functional",
  "projectId": "project_id",
  "moduleId": "module_id",
  "requirementId": "requirement_id"
}
```

## Auth APIs

| Method | Endpoint | Description | Request |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Create user and default workspace. | `fullName`, `email`, `password`, `workspaceName` |
| POST | `/api/auth/login` | Login and return auth context. | `email`, `password` |
| POST | `/api/auth/logout` | Logout response. | None |
| GET | `/api/auth/me` | Current authenticated user. | None |
| POST | `/api/auth/forgot-password` | Send reset email if configured. | `email` |
| POST | `/api/auth/reset-password` | Reset password. | `token`, `password` |
| PATCH | `/api/auth/profile` | Update profile. | `fullName`, `avatar` |
| PATCH | `/api/auth/change-password` | Change password. | `currentPassword`, `newPassword` |

## Project APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/dashboard` | Workspace dashboard stats. |
| GET | `/api/projects` | List projects. |
| POST | `/api/projects` | Create project. |
| GET | `/api/projects/:projectId` | Project detail with modules, requirements, histories. |
| PATCH | `/api/projects/:projectId` | Update project. |
| PATCH | `/api/projects/:projectId/archive` | Archive project. |
| DELETE | `/api/projects/:projectId` | Delete project. |
| GET | `/api/projects/:projectId/modules` | List project modules. |
| POST | `/api/modules` | Create module. |
| PATCH | `/api/modules/:moduleId` | Update module. |
| DELETE | `/api/modules/:moduleId` | Delete module. |
| GET | `/api/modules/:moduleId/requirements` | List requirements. |
| POST | `/api/requirements` | Create requirement. |
| PATCH | `/api/requirements/:requirementId` | Update requirement. |
| DELETE | `/api/requirements/:requirementId` | Delete requirement. |

Project create example:

```json
{
  "name": "Customer Portal",
  "description": "QA coverage for customer portal",
  "domain": "SaaS",
  "status": "Active"
}
```

## Test Case History APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/test-case-history` | Save generated output as history. |
| GET | `/api/test-case-history` | List history with filters. |
| GET | `/api/test-case-history/compare` | Compare two versions. |
| GET | `/api/test-case-history/:historyId` | Get history detail. |
| PATCH | `/api/test-case-history/:historyId/status` | Update Draft/Reviewed/Approved status. |
| DELETE | `/api/test-case-history/:historyId` | Delete history record. |
| GET | `/api/test-case-history/:historyId/export` | Export history. |
| GET | `/api/requirements/:requirementId/history` | Requirement version history. |

## Review APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/review/submit/:historyId` | Submit version for review. |
| GET | `/api/review/queue` | Review queue. |
| GET | `/api/review/:historyId` | Review detail. |
| POST | `/api/review/approve/:historyId` | Approve version. |
| POST | `/api/review/request-changes/:historyId` | Request changes. |
| POST | `/api/review/reject/:historyId` | Reject version. |
| POST | `/api/review/comment/:historyId` | Add review comment. |
| GET | `/api/review/comments/:historyId` | List review comments. |

## Manual Test Execution APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/approved-test-case-versions` | Approved versions available for runs. |
| POST | `/api/test-runs` | Create test run. |
| GET | `/api/test-runs` | List test runs. |
| GET | `/api/test-runs/:id` | Test run detail. |
| PUT | `/api/test-runs/:id` | Update test run. |
| DELETE | `/api/test-runs/:id` | Delete test run. |
| GET | `/api/test-runs/:id/executions` | Execution rows for run. |
| GET | `/api/test-runs/:id/export` | Export execution report. |
| PATCH | `/api/test-executions/:id/status` | Update execution status and evidence. |
| PATCH | `/api/test-executions/:id/details` | Update execution details. |
| POST | `/api/test-executions/:id/attachments` | Save evidence attachment metadata. |
| DELETE | `/api/test-executions/:id/attachments/:attachmentId` | Remove attachment reference. |
| GET | `/api/test-executions/:id/history` | Execution history. |
| GET | `/api/test-execution/dashboard` | Execution analytics. |
| GET | `/api/test-execution/reports` | Execution report summaries. |

Execution status request:

```json
{
  "status": "Failed",
  "actualResult": "Login failed with 500 error",
  "comments": "Failure observed on QA build",
  "screenshotUrl": "https://example.com/screenshot.png",
  "jiraBugId": "QA-123",
  "browser": "Chrome",
  "operatingSystem": "macOS",
  "buildNumber": "1.0.4",
  "environment": "QA"
}
```

## AI Chat APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/ai-chat/message` | Send message with selected context. |
| GET | `/api/ai-chat/history` | List chat summaries. |
| GET | `/api/ai-chat/:chatId` | Get chat detail. |
| DELETE | `/api/ai-chat/:chatId` | Delete chat. |
| POST | `/api/ai-chat/:chatId/save-as-version` | Save AI chat output as history version. |

## AI Provider APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/ai-providers` | List provider settings and mappings. |
| POST | `/api/ai-providers` | Create provider. |
| GET | `/api/ai-providers/usage` | Provider usage logs. |
| PUT | `/api/ai-providers/feature-mapping` | Update feature-level model mapping. |
| GET | `/api/ai-providers/:id` | Provider detail. |
| PUT | `/api/ai-providers/:id` | Update provider. |
| DELETE | `/api/ai-providers/:id` | Delete provider. |
| POST | `/api/ai-providers/:id/test` | Test connection. |
| PATCH | `/api/ai-providers/:id/activate` | Activate provider. |
| PATCH | `/api/ai-providers/:id/deactivate` | Deactivate provider. |

## GitHub Integration APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/integrations/github/connect` | Save GitHub config. |
| GET | `/api/integrations/github/config` | Get masked config. |
| POST | `/api/integrations/github/test-connection` | Test GitHub connection. |
| POST | `/api/integrations/github/analyze-repository` | Analyze repository. |
| GET | `/api/integrations/github/analysis` | Get analysis. |
| PUT | `/api/integrations/github/analysis/override` | Override analysis fields. |
| POST | `/api/integrations/github/push-playwright-test` | Create branch, file, and PR for generated Playwright code. |

## Repository Sync APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/integrations/github/sync` | Sync repository changes. |
| GET | `/api/integrations/github/sync-history` | List sync records. |
| GET | `/api/integrations/github/sync/:syncId` | Get sync detail. |
| POST | `/api/integrations/github/sync/:syncId/generate-suggestions` | Generate impact suggestions. |
| POST | `/api/integrations/github/sync/:syncId/generate-updates` | Generate Playwright update preview. |
| GET | `/api/integrations/github/sync/:syncId/pr-preview` | Get PR preview. |
| POST | `/api/integrations/github/sync/:syncId/create-update-pr` | Create update PR from preview. |
| POST | `/api/integrations/github/sync/:syncId/create-pr` | Create report-style sync PR. |

## Analytics APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/analytics/summary` | Summary KPIs. |
| GET | `/api/analytics/coverage` | Coverage analytics. |
| GET | `/api/analytics/generation` | Generation analytics. |
| GET | `/api/analytics/review` | Review analytics. |
| GET | `/api/analytics/projects-health` | Project health. |
| GET | `/api/analytics/users-productivity` | User productivity. |
| GET | `/api/analytics/ai-usage` | AI usage. |
| GET | `/api/analytics/exports` | Export analytics. |

## Export APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/export/history` | Export action history. |
| POST | `/api/export/excel` | Export selected records as Excel. |
| POST | `/api/export/pdf` | Export selected records as PDF. |
| POST | `/api/export/project` | Export project scope. |
| POST | `/api/export/requirement` | Export requirement scope. |
| POST | `/api/export/version` | Export version scope. |

## Pricing, Trial, and Usage APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/plans` | Pricing plans. |
| GET | `/api/subscription/current` | Current subscription. |
| PATCH | `/api/subscription/current` | Change subscription plan. |
| GET | `/api/subscription/usage` | Workspace usage and quotas. |
| GET | `/api/trial/current` | Trial summary. |
| POST | `/api/trial/expire` | Expire due trials. |

## Workspace APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/workspaces` | Create workspace. |
| GET | `/api/workspaces` | List workspaces. |
| GET | `/api/workspaces/:id` | Workspace detail. |
| PUT | `/api/workspaces/:id` | Update workspace. |
| DELETE | `/api/workspaces/:id` | Delete workspace. |
| PATCH | `/api/workspaces/:id/archive` | Archive workspace. |
| GET | `/api/workspaces/:id/members` | Members. |
| PATCH | `/api/workspaces/:id/members/:memberId/role` | Change role. |
| PATCH | `/api/workspaces/:id/members/:memberId/projects` | Assign projects. |
| DELETE | `/api/workspaces/:id/members/:memberId` | Remove member. |
| PATCH | `/api/workspaces/:id/members/:memberId/deactivate` | Deactivate member. |
| POST | `/api/workspaces/:id/invites` | Invite member. |
| GET | `/api/workspaces/:id/invites` | List invites. |
| POST | `/api/workspaces/invites/accept` | Accept invite. |
| PATCH | `/api/workspaces/:id/invites/:inviteId/revoke` | Revoke invite. |
| POST | `/api/workspaces/:id/invites/:inviteId/resend` | Resend invite. |
| GET | `/api/workspaces/:id/permissions/me` | Current permissions. |
| GET | `/api/workspaces/:id/roles` | Role permissions. |
| PATCH | `/api/workspaces/:id/roles/:roleId` | Update role permissions. |

## Common Error Responses

| Status | Meaning | Example |
| --- | --- | --- |
| 400 | Invalid request or validation failure. | Required field missing. |
| 401 | Authentication required or invalid token. | Missing bearer token. |
| 403 | User lacks permission. | Role cannot perform action. |
| 404 | Resource not found. | Project or history id not found. |
| 500 | Server error. | Unexpected backend failure. |

## Related Documents

- [System Architecture](./06-System-Architecture.md)
- [Security](./16-Security.md)
- [Deployment Guide](./18-Deployment-Guide.md)

## Key Takeaways

### Summary

The API surface covers authentication, projects, history, review, execution, AI chat, AI providers, GitHub integrations, analytics, exports, billing, and workspaces.

### Benefits

- Gives frontend and integration teams a clear contract.
- Helps QA teams understand backend capabilities.
- Supports future API testing and Postman collection generation.

### Future Scope

Future documentation can add OpenAPI schemas, generated SDKs, and full request/response examples for every endpoint.
