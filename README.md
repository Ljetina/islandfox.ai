## IslandFox.ai

This is the open source front-end of the IslandFox.ai chat service. It includes the main website, previously hosted at islandfox.ai, but currently no longer hosted. More importantly it includes the chat interface.

This front-end is a pure Single Page App (SPA) using Next.js, so it doesn't have any back-end components in this repo. It does require a back-end to function. This back-end is also open-source and can be found [here](https://github.com/Ljetina/blur); If you want to use the UI locally, you have to run both this front-end and the back-end. Commands for running are included in both repo's. For hosting, you can use Vercel or any file host really for the front-end and any kind of VPS host for the back-end.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
