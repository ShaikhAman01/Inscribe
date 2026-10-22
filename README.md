# Inscribe

A full-stack blogging platform where people write, publish and discover stories. Built with **React**, **Hono** on **Cloudflare Workers**, and **PostgreSQL** via **Prisma**.

**[Live Demo](https://inscribe.shaikhaman.in)**

## Features

- **Public reading:** anyone can browse and read stories; an account is only needed to write, like or comment
- **Rich text editor:** write and preview posts with formatting, powered by Quill; edit or delete your own stories later
- **Tags:** tag posts and filter by topic
- **Likes and comments:** comment authors and post owners can remove comments
- **AI summaries:** one-click summaries using Cloudflare Workers AI (Mistral Small 3.1), cached for a week
- **Search and pagination:** find posts by title, content or tag, with cursor-based "load more"
- **Account deletion:** removes the account with every story, comment and like
- **Accessible, responsive UI:** keyboard navigation, WCAG AA contrast, skeleton loaders, toasts and a mobile-friendly layout

## Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | React, TypeScript, Vite, Tailwind CSS (hosted on Vercel) |
| Backend    | Hono on Cloudflare Workers                          |
| Database   | PostgreSQL with Prisma (Accelerate)                 |
| Validation | Zod (shared via [`@shaikhaman/medium-common`](https://www.npmjs.com/package/@shaikhaman/medium-common)) |
| AI         | Cloudflare Workers AI (`@cf/mistralai/mistral-small-3.1-24b-instruct`) |

## Project Structure

```
├── frontend/   # React app (Vite)
├── backend/    # Hono API on Cloudflare Workers
└── common/     # Shared Zod schemas & types (published to npm)
```

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database and a [Prisma Accelerate](https://www.prisma.io/accelerate) connection string
- A Cloudflare account (for Workers and Workers AI)

### Backend

Create `backend/.dev.vars` (gitignored) with your local secrets:

```
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
JWT_SECRET="a-long-random-string"
```

Then:

```bash
cd backend
npm install
npm run dev                 # wrangler dev on http://localhost:8787
```

Migrations need a **direct** Postgres connection string, not the `prisma://` Accelerate URL:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db" npx prisma migrate dev
```

Non-secret settings live in `backend/wrangler.toml` under `[vars]`:

- `ALLOWED_ORIGINS`: comma-separated origins allowed by CORS
- `PREVIEW_ORIGIN_PATTERN`: optional regex for preview deployments
- `[ai]` binding: enables Workers AI for post summaries

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:

```
VITE_BACKEND_URL=http://localhost:8787
```

## Deployment

- **Database:** `npx prisma migrate deploy` with the direct connection string
- **Backend:** `npx wrangler secret put DATABASE_URL` and `npx wrangler secret put JWT_SECRET` once, then `cd backend && npm run deploy`
- **Frontend:** Vercel builds `frontend/` on push; `vercel.json` rewrites every route to the SPA

## Security

- Passwords are hashed with salted PBKDF2-SHA256 (100,000 iterations); older hashes are upgraded on the next sign-in
- Sessions use JWTs that expire after 7 days
- Per-route rate limits on sign-up, sign-in, posting, comments, likes, AI summaries and account deletion
- CORS restricted to an allow-list of origins
- Story HTML is sanitized with DOMPurify before rendering
- Only owners can edit or delete their stories, and deleting an account cascades to all of its data

Found a vulnerability? Please report it privately through [GitHub security advisories](https://github.com/ShaikhAman01/Inscribe/security/advisories/new) rather than a public issue.

## Contributing

Bug reports and feature ideas are welcome through the [issue forms](https://github.com/ShaikhAman01/Inscribe/issues/new/choose).

## License

This project is licensed under the [MIT License](LICENSE).
