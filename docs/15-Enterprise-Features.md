# 15. Enterprise Features

## Overview

AI QA Copilot includes enterprise-oriented capabilities for team collaboration, role control, subscriptions, usage limits, AI provider flexibility, and auditability.

> **Important**  
> Enterprise controls should be configured before onboarding multiple users. Roles, assigned projects, and AI provider settings influence what actions users can perform.

## Implemented Enterprise Capabilities

| Capability | Description |
| --- | --- |
| Workspaces | Organization/team containers. |
| Members | Workspace member list and management actions. |
| Invites | Invite, revoke, resend, accept invite. |
| Roles | Owner, Admin, QA Lead, QA Engineer, Viewer. |
| Project access | Assigned project permissions. |
| Activity logs | Tracks major workspace actions. |
| Pricing plans | Free, Pro, Enterprise plans. |
| Usage limits | Workspace, member, project, requirements, AI generation, chat, export, storage tracking. |
| Trial system | Pro trial and expiry behavior. |
| AI Providers / BYOAI | Workspace provider configuration and feature mapping. |

## Role Summary

| Role | Access Summary |
| --- | --- |
| Owner | Full workspace and settings access. |
| Admin | Manage users, projects, providers, reviews. |
| QA Lead | Review, approve, manage QA work. |
| QA Engineer | Generate, execute, submit for review. |
| Viewer | Read-only access, mainly approved assets. |

## Business Value

- Supports multi-user enterprise collaboration.
- Enables governance through role separation.
- Prepares product for SaaS packaging.
- Supports customer AI policy requirements through BYOAI.

[Insert Screenshot: Team Workspace Page]

[Insert Screenshot: Pricing Page]

[Insert Screenshot: AI Provider Feature Mapping]

## Related Documents

- [Security](./16-Security.md)
- [Deployment Guide](./18-Deployment-Guide.md)
- [AI Features](./09-AI-Features.md)

## v2 Validation Intelligence Note

AI QA Copilot v2.0 adds validation intelligence across repository workflows: GitHub Actions validation, AI failure analysis, reviewable auto-fix proposals, retry validation, validation history, and release readiness reporting. These capabilities preserve the review-first governance model while helping QA teams make faster, safer release decisions.

## Key Takeaways

### Summary

Enterprise features support multi-user collaboration, permissions, subscriptions, usage limits, and provider flexibility.

### Benefits

- Enables controlled team adoption.
- Supports SaaS packaging and trials.
- Aligns AI usage with organizational policies.

### Future Scope

Future enterprise work can include audit exports, SSO, SCIM provisioning, and advanced billing integrations.
