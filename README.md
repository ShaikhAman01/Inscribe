# Inscribe

A full-stack blogging platform where users can write, publish, and discover stories. Built with **React**, **Hono** on **Cloudflare Workers**, and **PostgreSQL** via **Prisma**.

**[Live Demo](https://inscribe.shaikhaman.dev)**

## Features

- **Authentication** — JWT-based signup/signin with hashed passwords
- **Rich text editor** — write and preview posts with formatting, powered by Quill
- **Tags** — tag posts and filter by topic
- **Likes & comments** — engage with stories
- **AI summaries** — one-click post summaries using Cloudflare Workers AI (Llama 3)
- **Search & pagination** — find posts by title, content, or tag
- **Responsive UI** — skeleton loaders, toasts, and a mobile-friendly layout

## Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | React, TypeScript, Vite, Tailwind CSS               |
| Backend    | Hono on Cloudflare Workers                          |
| Database   | PostgreSQL with Prisma (Accelerate)                 |
| Validation | Zod (shared via [`@shaikhaman/medium-common`](https://www.npmjs.com/package/@shaikhaman/medium-common)) |
| AI         | Cloudflare Workers AI                               |

## Project Structure

```
├── frontend/   # React app (Vite)
├── backend/    # Hono API on Cloudflare Workers
└── common/     # Shared Zod schemas & types (published to npm)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (with a [Prisma Accelerate](https://www.prisma.io/accelerate) connection string)
- A Cloudflare account (for Workers & Workers AI)

### Backend

```bash
cd backend
npm install
npx prisma migrate dev      # apply migrations
npx prisma db seed          # optional: seed sample data
npm run dev                 # start local dev server (wrangler)
```

Configure `backend/wrangler.toml`:

- `DATABASE_URL` — Prisma Accelerate connection string
- `JWT_SECRET` — secret key for signing JWTs
- `[ai]` binding — enables Workers AI for post summaries

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:

```
VITE_BACKEND_URL=http://localhost:8787   # your backend URL
```

## Deployment

- **Backend**: `cd backend && npm run deploy` (Cloudflare Workers)
- **Frontend**: `cd frontend && npm run build`, then deploy `dist/` to any static host

## License

This project is licensed under the [MIT License](LICENSE).
