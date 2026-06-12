# AI QA Copilot Agent Guide

## Project Overview

AI QA Copilot is an AI-powered Quality Engineering Platform. The workspace contains a React frontend and an Express/TypeScript backend for project management, AI test generation, review workflows, manual test execution, analytics, AI providers, GitHub automation repository integration, Smart Repository Analysis, and AI Repository Sync Beta.

## Folder Structure

```text
AI-QA-Copolot/
├── ai-qa-copilot/   # React, TypeScript, Vite, Tailwind frontend
├── ai-qa-backend/   # Express, TypeScript backend API
└── docs/            # Enterprise documentation portal
```

## Development Commands

Frontend:

```bash
cd ai-qa-copilot
npm install
npm run dev
npm run build
```

Backend:

```bash
cd ai-qa-backend
npm install
npm run dev
npm run build
```

## Coding Standards

- Use TypeScript types already defined in `src/services`, `src/types`, and backend `projectTypes.ts`.
- Keep business logic in backend stores/services and UI state in React components/hooks.
- Preserve existing API contracts unless the user explicitly asks for a breaking change.
- Use Tailwind/shadcn-style UI patterns already present in the frontend.
- Keep secrets in `.env`; never commit API keys, tokens, MongoDB URIs, or provider keys.

## Documentation Style

- Use enterprise-ready Markdown suitable for GitHub Pages, PDF, or Word export.
- Use clear headings, tables, callouts, Mermaid diagrams, and screenshot placeholders.
- Mark incomplete items as **Planned** or **Future Roadmap**.
- Do not invent implemented features; verify from source code first.

## Naming Conventions

- Feature docs use numbered chapter files in `/docs`.
- API names use HTTP method + endpoint, for example `POST /api/projects`.
- Screenshot placeholders use: `[Insert Screenshot: Page or Component Name]`.
- Mermaid diagrams must be fenced with ` ```mermaid `.

## Documentation Rules

- Cross-reference related chapters.
- Keep examples generic and do not expose secrets.
- Prefer concise business language with technical notes in separate sections.
- Include authentication notes for protected APIs.

## Screenshot Placeholder Rules

- Use placeholders only; do not add generated screenshots unless requested.
- Place placeholders near the relevant workflow step or UI description.

## Mermaid Diagram Rules

- Keep diagrams readable in GitHub Markdown.
- Use simple `flowchart`, `sequenceDiagram`, and `graph` diagrams.
- Avoid overly dense diagrams; split when needed.

## Do's

- Run builds after code changes.
- Read existing files before editing.
- Keep docs synchronized with implemented routes and UI modules.
- Use MongoDB configuration through environment variables.

## Don'ts

- Do not modify application code when the request is documentation-only.
- Do not commit `.env` files.
- Do not document Bitbucket, Jira, Xray, Azure DevOps, or CI/CD as implemented unless code support exists.
- Do not claim production-grade file upload storage where the POC stores evidence links/metadata.
