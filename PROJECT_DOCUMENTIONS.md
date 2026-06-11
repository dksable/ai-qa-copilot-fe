# AI QA Copilot Project Documentation

## 1. Product Overview

AI QA Copilot is an AI-powered QA lifecycle platform that helps QA, product, and engineering teams turn requirements into structured test assets, manage QA work by project, review and approve generated test cases, execute manual test runs, analyze coverage, and prepare automation-ready Playwright skeletons.

The current POC is designed as a modern SaaS demo covering the complete QA lifecycle:

```text
Requirement -> AI Test Generation -> Review & Approval -> Manual Test Execution
-> Playwright Test Generation -> Export / Analytics / Team Collaboration
```

## 2. Target Users

- QA Engineers
- QA Leads
- Test Managers
- Engineering Managers
- Product Teams
- CTOs and enterprise stakeholders

## 3. Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/Radix UI components
- Lucide React icons
- Recharts
- Sonner toast notifications

### Backend

- Node.js
- Express
- TypeScript
- File-backed POC data store
- JWT authentication
- bcrypt password hashing
- Groq/default AI provider integration
- BYOAI provider routing support
- Excel/PDF export services

## 4. Repository Structure

```text
AI-QA-Copolot/
├── ai-qa-copilot/        # Frontend React app
└── ai-qa-backend/        # Express backend API
```

## 5. Frontend Architecture

The frontend has been refactored into a modular React structure.

```text
src/
├── App.tsx
├── main.tsx
├── pages/
├── layouts/
├── components/
│   ├── features/
│   ├── header/
│   ├── navigation/
│   └── ui/
├── services/
├── contexts/
├── hooks/
├── constants/
├── types/
├── lib/
└── styles.css
```

### Key Frontend Files

- `src/App.tsx`: Root app composition.
- `src/pages/AppShell.tsx`: Main product shell and page rendering.
- `src/layouts/DashboardLayout.tsx`: App layout with sidebar, header, and content.
- `src/components/navigation/`: Sidebar and navigation components.
- `src/components/header/`: Top header and user controls.
- `src/services/projects.ts`: API client for backend product modules.
- `src/services/testcases.ts`: Test generation service wrapper.
- `src/types/app.ts`: Shared frontend TypeScript interfaces.
- `src/styles.css`: Global design tokens, Tailwind layers, and product polish.

## 6. Backend Architecture

```text
src/
├── server.ts
├── authRoutes.ts
├── authToken.ts
├── projectRoutes.ts
├── workspaceRoutes.ts
├── reviewRoutes.ts
├── analyticsRoutes.ts
├── exportRoutes.ts
├── pricingRoutes.ts
├── testExecutionRoutes.ts
├── aiChatRoutes.ts
├── aiProviderRoutes.ts
├── aiProviderRouter.ts
├── projectStore.ts
├── projectTypes.ts
├── groq.ts
├── exportService.ts
└── permissionMiddleware.ts
```

### Key Backend Responsibilities

- Authentication and current-user APIs
- Workspace, member, invite, and permission APIs
- Project, module, requirement, and test history APIs
- AI generation, AI chat, and Playwright generation APIs
- Review and approval workflow APIs
- Manual test execution APIs
- Analytics aggregation APIs
- Pricing, trial, usage, and quota APIs
- Export APIs for PDF/Excel
- AI provider configuration and routing APIs

## 7. Completed POC Features

### 7.1 Landing Page

The product landing page positions AI QA Copilot as a B2B SaaS QA lifecycle platform.

Includes:

- Hero section with product value proposition
- Problem section for QA pain points
- Core feature cards
- AI Providers / Bring Your Own AI section
- Repository Intelligence section
- Repository Sync Beta section
- How it works workflow
- Enterprise integrations section
- Business value section
- Pricing preview
- FAQ
- Final CTA

Highlighted capabilities:

- AI test generation
- Manual test execution
- Review workflow
- Analytics
- Team collaboration
- AI provider flexibility
- GitHub automation repository integration
- Smart repository analysis
- AI repository sync beta
- GitHub/Bitbucket repository integration as an enterprise automation capability

### 7.2 Authentication

Implemented authentication flow:

- Login
- Signup
- Forgot password
- Reset password
- Current user endpoint
- Profile update
- Change password
- Logout
- Demo user support

Security behavior:

- Passwords are hashed with bcrypt.
- JWT is used for authenticated API access.
- Backend routes can be protected with auth middleware.
- Password hashes are not returned to the frontend.

Google login was removed per product direction.

### 7.3 Dashboard

The dashboard provides management-ready QA summaries.

Shows:

- Total projects
- Active projects
- Total modules
- Total requirements
- Total generated test cases
- Average coverage score
- Pending reviews
- Approved items
- Changes requested
- Rejected items
- AI usage summary
- Recent activity

### 7.4 Project Management

Users can manage QA work by project.

Features:

- Create project
- View all projects
- Project detail view
- Edit project
- Archive project
- Delete project
- Project health/status indicators
- Project statistics
- Empty/loading/error states

Project fields:

- Project name
- Description
- Domain/category
- Status
- Created date
- Updated date
- Total modules
- Total requirements
- Total test cases

### 7.5 Module Management

Inside each project, users can manage modules.

Features:

- Add module
- Edit module
- Delete module
- View module list

Module fields:

- Module name
- Description
- Priority
- Status

Supported priorities:

- Low
- Medium
- High
- Critical

### 7.6 Requirement Management

Inside each module, users can manage requirements.

Features:

- Add requirement
- Edit requirement
- Delete requirement
- View requirement

Requirement fields:

- Title
- Description
- Acceptance criteria
- Priority
- Status
- Created date
- Updated date

### 7.7 AI Test Case Generation

The existing AI generation flow is connected with project/module/requirement context.

Generated output includes:

- Positive test cases
- Negative test cases
- Edge cases
- Test data suggestions
- Acceptance criteria
- Playwright test skeleton
- Test coverage score

UX improvements:

- Project/module selectors
- Requirement input
- Loading states
- Result grouping
- Copy actions
- Save version action
- Export action
- Collapsible/structured result sections

### 7.8 Test Coverage Score

The app calculates and displays a coverage score for generated outputs.

Used in:

- Generation result
- Test history
- Review queue
- Analytics dashboard
- Project health
- Export reports

### 7.9 Test Case History

Every generated output can be saved as versioned history.

Features:

- Test Case History page
- History detail page
- Version timeline
- Compare versions
- Search and filters
- Status management
- Delete history record
- Export selected history

History fields:

- Project name
- Module name
- Requirement title
- Version number
- Coverage score
- Generated by
- AI model used
- Generated date
- Status
- Full generated output

Versioning behavior:

- Existing generated history is never overwritten.
- Regenerating the same requirement creates a new version.

### 7.10 Review & Approval Workflow

Generated test case versions can move through a QA review process.

Statuses:

- Draft
- Submitted for Review
- Changes Requested
- Approved
- Rejected

Features:

- Submit for review
- Review queue
- Reviewer detail page
- Approve
- Request changes
- Reject
- Comments section
- Audit trail
- Read-only approved/rejected versions
- Export restrictions based on status

Role support:

- Owner
- Admin
- QA Lead
- QA Engineer
- Viewer

### 7.11 AI Chat With Requirement

Users can chat with AI using selected project, module, requirement, and optional test history context.

Features:

- ChatGPT-style UI
- Project/module/requirement selector
- Optional history version context
- Suggested prompt buttons
- Markdown response rendering
- Code block support
- Copy response/code actions
- Save as new version
- Chat history
- Continue previous chats
- Delete chats

Example prompts:

- What test cases are missing?
- Improve coverage score
- Generate security test cases
- Generate API test cases
- Suggest edge cases
- Create regression test cases
- Explain this requirement
- Generate Playwright tests

### 7.12 Requirement Change Impact Analysis

The app supports analyzing requirement changes and identifying QA impact.

Capabilities:

- Detect changed requirement areas
- Suggest impacted test cases
- Recommend regression test scope
- Help QA teams understand coverage risk after requirement updates

### 7.13 Export Excel/PDF

Users can export generated test cases and history records.

Export formats:

- Excel
- PDF

Supported scopes:

- Current generated result
- Specific history version
- Multiple selected versions
- Entire requirement
- Entire project
- Execution report
- Analytics report

Excel content:

- Summary
- Positive test cases
- Negative test cases
- Edge cases
- Test data suggestions
- Acceptance criteria
- Playwright skeleton

PDF content:

- Cover page
- Executive summary
- Requirement details
- Acceptance criteria
- Positive cases
- Negative cases
- Edge cases
- Test data
- Playwright skeleton
- Generation metadata

Export tracking:

- User
- Export type
- Export format
- Date
- Total records exported

### 7.14 Manual Test Execution Management

Manual execution lets QA teams create test runs from approved test cases and track execution outcomes.

Sidebar section:

- Test Runs
- Execution Dashboard
- Execution History

Test run fields:

- Test run name
- Project
- Module
- Requirement
- Environment
- Build version
- Assigned tester
- Start date
- End date
- Description

Execution statuses:

- Not Executed
- Passed
- Failed
- Blocked
- Skipped

Features:

- Create test run
- Select approved test cases
- View test run list
- Start execution
- Update execution status
- Add actual result
- Add comments
- Add bug ID
- Track executed by/executed at
- View execution history
- Dashboard cards and charts
- Export execution report

Validation:

- Failed status requires actual result and comments.

### 7.15 Team Workspace + Roles & Permissions

The product supports team-based workspace collaboration.

Workspace features:

- Create workspace
- Edit workspace
- Archive workspace
- Delete workspace by owner/admin
- Workspace overview
- Members
- Invites
- Roles and permissions
- Activity logs

Roles:

- Owner
- Admin
- QA Lead
- QA Engineer
- Viewer

Member features:

- Invite by email
- Assign role
- Assign projects
- Change role
- Remove member
- Deactivate member

Project-level access:

- Full Access
- Edit Access
- Review Access
- View Only

### 7.16 Activity Logs

Workspace activity tracking includes:

- Workspace created
- Member invited
- Member joined
- Role changed
- Project assigned
- Member removed
- Test case submitted
- Test case approved
- Test case exported

### 7.17 Analytics Dashboard

Analytics gives management and QA leads visibility into QA productivity and quality.

Filters:

- Workspace
- Project
- Module
- Date range
- User
- Status

Summary KPIs:

- Total projects
- Total modules
- Total requirements
- Total test cases generated
- Average coverage score
- Approved test cases
- Pending reviews
- Changes requested
- Rejected test cases
- Total exports
- AI chat interactions

Analytics sections:

- Test coverage analytics
- Generation analytics
- Review and approval analytics
- Project health dashboard
- User productivity analytics
- AI usage analytics
- Export analytics

Charts:

- Coverage trend
- Generated test cases by project
- Review status distribution
- User productivity
- AI usage over time
- Low coverage requirements table

### 7.18 Pricing Plans

The app includes SaaS pricing plan management.

Plans:

- Free
- Pro
- Enterprise

Free plan:

- 1 workspace
- 2 team members
- 2 projects
- 20 requirements/month
- 50 AI generations/month
- 50 AI chat messages/month
- PDF export only
- 14-day trial

Pro plan:

- 1 workspace
- 10 team members
- Unlimited projects
- Unlimited requirements
- 1000 AI generations/month
- 2000 AI chat messages/month
- Excel + PDF export
- Analytics dashboard
- Review workflow

Enterprise plan:

- Unlimited workspaces
- Unlimited team members
- Unlimited projects
- Unlimited AI usage
- Jira integration
- Advanced analytics
- Priority support
- Custom limits

Pricing UI:

- Pricing cards
- Monthly/yearly toggle
- Feature comparison table
- Current plan indicator
- Upgrade/downgrade buttons
- Recommended plan badge

### 7.19 Workspace Limits

Workspace limits are enforced based on plan.

Examples:

- Members: `2 / 2 Used`
- Projects: `2 / 2 Used`
- Requirements: `20 / 20 Used`

Behavior:

- Validate limits during creation.
- Show usage indicators.
- Show upgrade prompt when limits are exceeded.
- Provide workspace usage dashboard.

### 7.20 Usage Quotas

Usage is tracked for SaaS metering.

Tracked usage:

- AI test case generations
- AI chat messages
- Exports
- Active users
- Storage usage

Quota behavior:

- Real-time usage tracking
- Monthly reset
- Usage dashboard
- Warning notifications

### 7.21 Trial Account System

New users receive a Pro trial.

Trial behavior:

- 14-day Pro trial
- Trial start date
- Trial end date
- Days remaining
- Trial banner
- Upgrade CTA
- Downgrade/prompt behavior after expiry

### 7.22 AI Providers / Bring Your Own AI

Workspace admins can configure which AI provider is used by AI QA Copilot.

Default behavior:

- If no custom provider is configured, AI QA Copilot uses the default AI provider.
- Existing AI features continue working.

Supported provider options:

- AI QA Copilot Default AI
- OpenAI
- Anthropic Claude
- Google Gemini
- Groq
- Azure OpenAI
- OpenRouter
- Custom OpenAI-compatible API

Provider configuration:

- Provider name
- Provider type
- API key
- Model name
- Base URL
- Temperature
- Max tokens
- Active/inactive status
- Fallback to default

Azure-specific fields:

- Endpoint URL
- Deployment name
- API version

Security:

- API keys are encrypted before saving.
- Full API keys are never returned to the frontend.
- Masked keys are shown in UI.
- Owner/Admin can manage providers.
- QA Lead can view provider info.
- QA Engineer/Viewer do not manage provider settings.

Feature-level mapping:

- Test generation
- AI chat
- Playwright generation
- Requirement impact analysis
- Coverage score
- Acceptance criteria
- Test data suggestions

Provider usage logging:

- Workspace
- Provider type
- Model
- Feature name
- Status
- Error message
- Created by
- Created date

### 7.23 GitHub Automation Repository Integration

AI QA Copilot can connect to a GitHub automation repository and push generated Playwright tests through a safe pull request workflow.

Capabilities:

- Configure GitHub repository owner, repo name, default branch, and test folder path.
- Store GitHub token securely in the backend.
- Mask the token in the UI.
- Test the GitHub connection.
- Push generated Playwright code to a new feature branch.
- Create a pull request for review.
- Prevent direct pushes to the default branch.
- Prevent silent overwrite if a test file already exists.

Pull request behavior:

- Branch naming uses `aiqa/{requirement-slug}-{timestamp}`.
- Generated file path uses the configured or detected test folder.
- PR description includes project, module, requirement, coverage score, generated by, version, and repository analysis summary.

Security:

- GitHub tokens are never stored in the frontend.
- GitHub tokens are encrypted in the backend.
- Only Owner/Admin can configure the integration.
- QA Lead/QA Engineer can push generated test files when permitted.

### 7.24 Smart Repository Analysis

Smart Repository Analysis scans a connected GitHub repository to understand the existing automation setup before generated Playwright files are pushed.

Repository scan checks:

- `package.json`
- `playwright.config.ts`
- `playwright.config.js`
- `tsconfig.json`
- `pom.xml`
- `build.gradle`
- `README.md`
- Common automation folders such as `tests/`, `e2e/`, `specs/`, `src/test/`, `src/test/java/`, `playwright/`, and `automation/`

Detected setup:

- Framework
- Language
- Build tool
- Test folder path
- Page object folder path
- Page Object Model usage
- Fixture usage
- Naming convention
- Import style
- Confidence score
- Scanned files

Supported detection:

- TypeScript Playwright
- JavaScript Playwright
- Java Playwright Maven/Gradle
- Playwright Test Runner
- Custom Playwright setups

UI features:

- Analyze Repository button
- Repository setup summary card
- Confidence score badge
- Low-confidence warning
- Manual override modal
- Scanned files display

### 7.25 AI Repository Sync Beta

AI Repository Sync Beta helps automation teams keep Playwright test suites aligned with application repository changes.

Workflow:

```text
Connected GitHub Repository -> Sync Repository -> Detect Changed Files
-> Identify Impacted Tests -> Generate AI Suggestions -> Create Update PR
```

Capabilities:

- Fetch latest commit from the configured branch.
- Compare with the previous sync commit.
- Detect changed files.
- Classify change type as Added, Modified, or Deleted.
- Identify related module names.
- Assign risk levels: Low, Medium, High.
- Detect potentially impacted Playwright tests.
- Generate AI-style maintenance suggestions.
- Create a pull request with a repository sync report.

Changed file output:

- File path
- Change type
- Related module
- Risk level
- Possible test impact

Impacted test output:

- Test file
- Related changed file
- Impact reason
- Suggested action
- Confidence score

AI recommendation output:

- Summary
- Impacted tests
- Suggested updates
- Risk level
- Recommended PR action

Rules:

- Beta feature for GitHub only.
- No direct push to the default branch.
- No auto-merge.
- No file update without user confirmation.
- Requires Smart Repository Analysis first.
- Falls back to review/report style output for the POC.

### 7.26 Email Sending

The backend supports email delivery through a Resend-compatible sender API.

Email use cases:

- Forgot password reset email
- Workspace invite email
- Workspace invite resend email

Behavior:

- Email sending is server-side only.
- Sender API key is read from environment variables.
- If email sending fails, API responses still return demo-safe links where applicable.
- Secrets are not committed to Git.

### 7.27 UI/UX Polish

The app has been polished for a professional SaaS demo.

Polish areas:

- Global spacing and 8px rhythm
- Consistent cards
- Better tables
- Better forms
- Improved dashboard spacing
- Improved typography
- Responsive layouts
- Empty states
- Loading states
- Toast notifications
- Confirmation dialogs
- AI chat layout fixes
- Playwright code readability fixes
- Landing page card sizing and workflow polish
- Compact Core Features matrix on landing page
- Repository intelligence and sync beta landing sections

### 7.28 Demo Data Handling

Mock/demo records were removed where requested so fresh demo data can be entered.

The app supports:

- Demo user login
- Fresh project setup
- Fresh requirement/test generation data
- Manual demo workflow creation

## 8. Backend API Groups

### Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `PATCH /api/auth/profile`
- `PATCH /api/auth/change-password`

### Projects, Modules, Requirements, History

- Project CRUD
- Module CRUD
- Requirement CRUD
- Save generated test case history
- Get test case history
- Compare versions
- Update history status

### Review Workflow

- `POST /api/review/submit/:historyId`
- `GET /api/review/queue`
- `GET /api/review/:historyId`
- `POST /api/review/approve/:historyId`
- `POST /api/review/request-changes/:historyId`
- `POST /api/review/reject/:historyId`
- `POST /api/review/comment/:historyId`
- `GET /api/review/comments/:historyId`

### AI Chat

- `POST /api/ai-chat/message`
- `GET /api/ai-chat/history`
- `GET /api/ai-chat/:chatId`
- `DELETE /api/ai-chat/:chatId`

### Export

- `POST /api/export/excel`
- `POST /api/export/pdf`
- `GET /api/export/history`
- `POST /api/export/project`
- `POST /api/export/requirement`
- `POST /api/export/version`

### Workspace and Team

- Workspace CRUD
- Member management
- Invite management
- Permission endpoints
- Activity log endpoints
- Invite email delivery through backend email service

### Pricing, Trial, Limits, Usage

- Plan APIs
- Current subscription APIs
- Workspace usage APIs
- Usage quota APIs
- Trial APIs

### Analytics

- `GET /api/analytics/summary`
- `GET /api/analytics/coverage`
- `GET /api/analytics/generation`
- `GET /api/analytics/review`
- `GET /api/analytics/projects-health`
- `GET /api/analytics/users-productivity`
- `GET /api/analytics/ai-usage`
- `GET /api/analytics/exports`

### Manual Test Execution

- `POST /api/test-runs`
- `GET /api/test-runs`
- `GET /api/test-runs/:id`
- `PUT /api/test-runs/:id`
- `DELETE /api/test-runs/:id`
- `GET /api/test-runs/:id/executions`
- `PATCH /api/test-executions/:id/status`
- `PATCH /api/test-executions/:id/details`
- `GET /api/test-executions/:id/history`
- `GET /api/test-execution/dashboard`
- `GET /api/test-execution/reports`

### AI Providers

- `GET /api/ai-providers`
- `POST /api/ai-providers`
- `GET /api/ai-providers/:id`
- `PUT /api/ai-providers/:id`
- `DELETE /api/ai-providers/:id`
- `POST /api/ai-providers/:id/test`
- `PATCH /api/ai-providers/:id/activate`
- `PATCH /api/ai-providers/:id/deactivate`
- `GET /api/ai-providers/usage`
- `PUT /api/ai-providers/feature-mapping`

### GitHub Automation Repository Integration

- `POST /api/integrations/github/connect`
- `GET /api/integrations/github/config`
- `POST /api/integrations/github/test-connection`
- `POST /api/integrations/github/push-playwright-test`

### Smart Repository Analysis

- `POST /api/integrations/github/analyze-repository`
- `GET /api/integrations/github/analysis`
- `PUT /api/integrations/github/analysis/override`

### AI Repository Sync Beta

- `POST /api/integrations/github/sync`
- `GET /api/integrations/github/sync-history`
- `GET /api/integrations/github/sync/:syncId`
- `POST /api/integrations/github/sync/:syncId/generate-suggestions`
- `POST /api/integrations/github/sync/:syncId/create-pr`

## 9. Data Models

The POC includes or simulates these main data models:

- User
- Workspace
- WorkspaceMember
- WorkspaceInvite
- Permission
- Project
- Module
- Requirement
- TestCaseHistory
- ReviewComment
- ActivityLog
- AIChat
- ExportHistory
- Plan
- Subscription
- UsageQuota
- Trial
- TestRun
- TestExecution
- TestExecutionHistory
- AIProviderConfig
- AIProviderFeatureMapping
- AIProviderUsageLog
- AutomationRepositoryConfig
- RepositoryAnalysis
- RepositorySync
- RepositoryChangedFile
- RepositoryImpactedTest
- RepositoryAISuggestion

## 10. Environment Variables

Frontend:

```text
VITE_API_BASE_URL=http://localhost:4000
```

Backend:

```text
PORT=4000
JWT_SECRET=your-jwt-secret
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile
AI_PROVIDER_ENCRYPTION_KEY=your-encryption-key
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=AI QA Copilot <onboarding@resend.dev>
FRONTEND_APP_URL=http://localhost:5173
```

Important:

- Do not put AI provider secrets in frontend environment files.
- Do not commit `.env` files.
- Custom provider API keys must be encrypted server-side.
- GitHub automation repository tokens must be stored only through backend integration APIs.
- Email sender keys must stay in backend environment variables only.

## 11. Local Setup

### Frontend

```bash
cd ai-qa-copilot
npm install
npm run dev
```

### Backend

```bash
cd ai-qa-backend
npm install
npm run dev
```

### Production Build

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build
```

## 12. Deployment Notes

### Frontend

Recommended Vercel settings:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend

Recommended Render settings:

- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Configure backend environment variables in Render dashboard.

Frontend production API URL example:

```text
VITE_API_BASE_URL=https://ai-qa-backend.onrender.com
```

## 13. Demo Readiness Checklist

- Start backend and confirm health/API availability.
- Start frontend and confirm dashboard loads.
- Login with demo user.
- Create workspace/project/module/requirement if fresh data is needed.
- Generate AI test cases.
- Save generated result as history.
- Submit version for review.
- Approve or request changes.
- Create manual test run from approved cases.
- Execute pass/fail/blocked/skipped statuses.
- Export PDF/Excel reports.
- Review analytics dashboard.
- Open Settings -> AI Providers to show BYOAI capability.
- Open Settings -> Integrations to configure GitHub automation repository.
- Run Smart Repository Analysis and review detected framework/language/pattern.
- Use Push to GitHub from generated Playwright output to create a pull request.
- Run Repository Sync Beta to detect changed files, impacted tests, AI suggestions, and create an update PR.
- Trigger forgot password or workspace invite to verify email delivery when `RESEND_API_KEY` is configured.

## 14. Important Product Rules

- Do not expose API keys in frontend or logs.
- Do not overwrite approved test history versions.
- Always create a new version for regenerated requirement output.
- Approved versions are locked/read-only.
- Rejected versions are not exportable.
- Viewer users must not create, edit, approve, or delete records.
- Manual test runs should use approved test cases.
- AI chat suggestions do not auto-overwrite existing test cases.
- Default AI provider must continue working if no BYOAI provider is configured.
- GitHub integration must always create a feature branch and pull request.
- GitHub integration must never push directly to the default branch.
- Repository Sync Beta must not auto-merge pull requests.
- Repository Sync Beta should require Smart Repository Analysis before sync.

## 15. GitHub Repositories

Frontend:

```text
https://github.com/dksable/ai-qa-copilot-fe
```

Backend:

```text
https://github.com/dksable/ai-qa-copilot-be
```

## 16. Maintenance Checklist

- Run frontend build before UI/deployment changes.
- Run backend build before API/deployment changes.
- Keep `.env` files out of Git.
- Keep API keys server-side only.
- Keep route and service types synchronized.
- Preserve existing business logic when polishing UI.
- Keep generated demo data separate from product source code.
- Update this document whenever a new POC feature is added.
