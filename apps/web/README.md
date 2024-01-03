## Getting Started

Install dependencies
```bash
npm i
```

Run the development server:

```bash
npm run dev
```

In a new terminal connect to the db:

```bash
npx supabase start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Qstash Queue

[Local Tunnel](https://upstash.com/docs/qstash/howto/local-tunnel)

In a new terminal run:

```bash
ngrok http --domain=internally-internal-walleye.ngrok-free.app 3000
```

## Tech Stack

Framework - [Nextjs](https://nextjs.org/)

Database/Auth/File Hosting - [Supabase](https://supabase.com/)

UI - [Shadcn](https://ui.shadcn.com/) and [Tailwind](https://tailwindui.com/)
