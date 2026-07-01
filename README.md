This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Design Review Workflow (Frontend)

Every UI component, page, layout, and feature must be reviewed inside the permanent Design Review System before API integration. This ensures responsive and visual correctness across all states.

1. **Build UI**: Develop the page or component. Utilize the `useApi()` hook from `src/lib/providers/ApiProvider.tsx` to read the active `dataState` and inject mock data accordingly.
2. **Add to Review**: Register the new page in `src/features/design-review/registry.ts`. The homepage at `/design-review` will automatically display it.
3. **Review Visually**: Access `/design-review` (Development Mode only) or click the floating **🎨 Design Review** button. Use the Developer Toolbar to toggle:
   - Viewport widths (Desktop/Tablet/Mobile)
   - Light/Dark modes (Ctrl+D)
   - RTL/LTR layouts (Ctrl+R)
   - Data States (Loading (Ctrl+L), Empty (Ctrl+E), Error (Ctrl+X), Success (Ctrl+S))
4. **Approve**: Address any UI/UX or accessibility feedback. Use the Performance HUD to verify 60fps renders.
5. **Connect APIs**: Integrate the backend only after the UI is perfectly polished and approved.

*Note: The `/design-review` route and the Global Dev Button are strictly blocked in production builds.*

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
