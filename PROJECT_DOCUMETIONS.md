# AI QA Copilot Frontend Documentation

## Project Overview

AI QA Copilot is a React + Vite frontend SPA for generating QA test plan content from user stories or acceptance criteria. The app provides a polished test-case generator UI with sections for positive cases, negative cases, edge cases, test data, acceptance criteria, and Playwright scaffold output.

The project was converted from TanStack Start to a standard Vite SPA so it can deploy cleanly on Vercel with the Vite framework preset.

## Tech Stack

- React 19
- Vite 7
- TypeScript
- Tailwind CSS
- shadcn/Radix UI components
- Lucide React icons
- Sonner toast notifications
- Supabase client package

## Current App Structure

```text
.
├── index.html
├── package.json
├── vite.config.ts
├── src
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.css
│   ├── components/ui
│   ├── hooks
│   ├── integrations/supabase
│   └── lib
└── supabase
```

## Important Files

- `index.html`: Root HTML entry used by Vite.
- `src/main.tsx`: React entrypoint. Mounts `<App />` into `#root`.
- `src/App.tsx`: Main application UI.
- `src/lib/api/testcases.ts`: Frontend mock test-plan generator and shared test plan types.
- `src/styles.css`: Tailwind styles and design tokens.
- `vite.config.ts`: Standard Vite config using React, Tailwind, and tsconfig paths plugins.
- `.env.example`: Example environment variables.

## Local Setup

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env` for local development.

```bash
cp .env.example .env
```

Client-side Supabase variables must use the `VITE_` prefix:

```text
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=
```

Do not commit `.env`. It is ignored by Git.

## Vercel Deployment

Use these Vercel settings:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

The project is a static SPA, so Vercel should serve `dist/index.html` without TanStack Start server output.

## Notes About AI Generation

The current frontend uses a mock generator in `src/lib/api/testcases.ts` so the app can deploy as a pure static Vite SPA.

Do not call Groq directly from browser code with a secret API key. To enable real AI generation safely, add a backend or serverless API endpoint and call Groq from that server-side layer.

## GitHub Repository

Repository:

```text
https://github.com/dksable/ai-qa-copilot-fe
```

## Maintenance Checklist

- Keep `.env` out of Git.
- Run `npm run build` before deployment changes.
- Keep Vercel output directory as `dist`.
- Avoid adding TanStack Start dependencies back unless the deployment target is changed to support SSR.
- If real AI generation is added, keep API keys server-side only.
