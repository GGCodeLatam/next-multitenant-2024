# Next Multitenant 2024 🚀

&#x20;    &#x20;

> **TL;DR**\
> Minimal boilerplate to launch a **multi‑tenant SaaS** with **Next.js 14 (App Router)**, unlimited sub‑domains, and instant deploy on **Vercel**. Fork it, add business logic, ship.

## Why this repo?

In **May 2024** I published a detailed walkthrough on Medium — ["How to create a multi‑tenant app with Next 13‑14 App Router"](https://medium.com/@gg.code.latam/how-create-a-multi-tenant-app-with-next-js-13-14-app-router-7a30fb5f8454). Readers asked for a complete, ready‑to‑fork code base; this repository is that companion.

### Key features

- **Wildcard sub‑domains** (`tenant.your‑domain.com`) handled in `middleware.ts`
- Lean file structure that scales to auth, billing, analytics, etc.
- Example integrations: **Supabase** (Postgres + Auth) and **Cloudflare** (DNS management)
- Developer happiness: strict TypeScript, ESLint, Prettier, **Tailwind CSS + shadcn/ui** components

## Quick start

```bash
git clone https://github.com/GGCodeLatam/next-multitenant-2024.git
cd next-multitenant-2024
cp .env.example .env   # add your Supabase keys
pnpm install           # or yarn / npm / bun
pnpm dev
```

Visit [http://tenant.localhost:3000](http://tenant.localhost:3000). The middleware rewrites the path to `/tenant`. Add extra tenants in `subdomains.json`.

## Folder layout

```
.
├── app/
│   ├── [subdomain]/
│   │   └── page.tsx        <- tenant‑specific UI
│   ├── layout.tsx          <- global layout
│   └── page.tsx            <- public landing page
├── lib/
│   ├── supabase/           <- SSR client + helpers
│   └── utils/
├── prisma/                 <- optional multi‑tenant schema
├── middleware.ts           <- sub‑domain routing logic
└── …
```

## How it works

1. **Edge Middleware** intercepts every request.
2. It extracts the host header and checks for an allowed sub‑domain.
3. When matched, it rewrites to `/${subdomain}${pathname}`; otherwise, the request continues.
4. The folder `` renders the tenant experience.

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import subdomains from './subdomains.json';

export const config = {
  matcher: [
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default function middleware(req) {
  const { hostname } = req.nextUrl;
  const sub = hostname.split('.')[0];
  if (subdomains.some((t) => t.subdomain === sub)) {
    return NextResponse.rewrite(
      new URL(`/${sub}${req.nextUrl.pathname}`, req.url),
    );
  }
  return NextResponse.next();
}
```

> **Note:** The middleware runs in the *Edge Runtime*. Access tenant data through internal APIs (`/api/...`) or a lightweight cache.

## Environment variables

Rename `.env.example` to `.env` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=   # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Public anon key
SUPABASE_SERVICE_ROLE_KEY=   # Optional, for seed / admin scripts
```

## Useful scripts

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `pnpm dev`            | Development server with hot reload |
| `pnpm build`          | Production build                   |
| `pnpm start`          | Serve the build with Node          |
| `pnpm lint`           | Run ESLint + TypeScript checks     |
| `pnpm prisma db push` | Sync the Prisma schema             |

## Deploy to Vercel

1. Import this repository into Vercel.
2. Add your domain and enable the `*.` **Wildcard Domain**.
3. Set the environment variables shown above.
4. Done — each tenant resolves at `sub.your‑domain.com`.

Deploying elsewhere? Map the wildcard DNS (Cloudflare works great) and ensure your platform supports wildcard hosts.

## Roadmap

-

## Contributing

Issues and pull requests are welcome.

1. **Fork** the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: add something cool"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

## License

[MIT](LICENSE)

---

If this project helps you, feel free to star the repository and share it.

