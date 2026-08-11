# Deploying Frame Studio to Vercel

This project needs **zero configuration** to deploy — no environment
variables, no API keys, no secrets. Everything (HEIC conversion, image
export, sharing) runs client-side in the browser.

## Option A — Deploy via GitHub (recommended)

1. **Push this project to a GitHub repo.**
   ```bash
   git init
   git add .
   git commit -m "Hacker House Goa 2026 – Frame Studio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. **Import it into Vercel.**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repo
   - Vercel auto-detects **Next.js** — leave the defaults as-is
     (Build Command: `pnpm build`, Output: `.next`, Install: `pnpm install`)
   - Click **Deploy**

3. **Done.** You'll get a `*.vercel.app` URL immediately. Every future
   `git push` to `main` redeploys automatically; pushes to other branches
   get their own preview URL.

## Option B — Deploy via the Vercel CLI

```bash
npm install -g vercel   # one-time
cd your-project-folder
vercel                  # first deploy — follow the prompts
vercel --prod            # promote to your production URL
```

## Custom domain (optional)

In the Vercel dashboard → your project → **Settings → Domains** → add
`frameingoa.com` (or whatever you're using) and follow the DNS
instructions Vercel gives you (usually one `CNAME` or `A` record).

## Files added for this

- **`vercel.json`** — makes the build/install commands explicit so
  Vercel always uses `pnpm` (matches your `pnpm-lock.yaml`) instead of
  guessing. Drop it in the project root, next to `package.json`.

## Things that are already handled

- ✅ No environment variables required — `heic2any` and `html-to-image`
  run entirely in the browser; nothing calls out to a server.
- ✅ `@vercel/analytics` is already wired into `app/layout.tsx` and only
  activates in production, so once deployed you'll see traffic in the
  **Analytics** tab of your Vercel project automatically.
- ✅ `next.config.mjs` already has `images: { unoptimized: true }`, so
  there's nothing extra to configure for the `<img>` tags used here.

## After deploying — quick smoke test

- [ ] Upload a JPG/PNG — preview shows it, drag/zoom works
- [ ] Upload a HEIC photo (iPhone) — converts and shows correctly
- [ ] Try all 3 PFP frames (Landscape / Tall / Circle) — download each,
      compare against the live preview
- [ ] Try Builder Pass — fill in Name / Role / Team Name / Role, download
- [ ] Try Share on a phone — confirm the image attaches (or falls back
      to download + X intent on desktop)
