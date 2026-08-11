<div align="center">

# 🏝️⚡ HACKER गोवा HOUSE — Frame Studio

### The official identity generator for Hacker House Goa 2026

**Less noise. More signal.**

`#FrameInGoa` · Oct 28–31, 2026 · Goa, India

</div>

---

## 🇮🇳 About Hacker House Goa 2026

Hacker House Goa 2026 is a builder residency on the coast — four days where founders, engineers, and independent builders trade the usual conference noise for focused, in-person shipping. No stages, no swag lines: just a house full of people building in public, by the sea.

**Frame Studio** is the companion web app for the house. Every builder gets an identity to carry into the event and back out onto their timeline — a signal that says *I was in the room.*

## ✨ What this app does

Frame Studio turns any photo into two kinds of builder identity:

| Format | Purpose |
|---|---|
| 🖼️ **PFP Frame** | A framed avatar for your X (Twitter) profile photo — Landscape, Tall, or Circle |
| 🪪 **Builder Pass** | A shareable ID card with your name, role, team, and the house branding |

Drop a photo (JPG, PNG, or straight off an iPhone as HEIC/HEIC), drag to reframe, pinch or scroll to zoom, pick your format, and download or share directly to X — all wrapped in the house's signature deep-green-and-gold visual identity.

## 🔑 Key features

- **What you see is what you download.** The live preview *is* the export — no separate redraw, no drift between what's on screen and what lands in your camera roll.
- **Real photo editing.** Proper drag-to-reframe and pinch/scroll-to-zoom, not just a crop guess — built on pointer events so it works identically with mouse, trackpad, and touch.
- **HEIC/HEIF support.** iPhone photos convert to JPEG entirely client-side — nothing ever leaves your browser.
- **Three PFP shapes.** Landscape, Tall, and Circle, each with a correctly fitted, gap-free photo window.
- **Builder Pass fields.** Name, role/signal, team name, and role — all rendered straight into the card.
- **Real sharing.** Uses the Web Share API to attach the actual generated image on supported devices, falling back to a download + pre-filled X post with `#FrameInGoa` where it isn't.

## 🛠️ Tech stack

- **[Next.js](https://nextjs.org/)** (App Router) + **React** + **TypeScript**
- **[html-to-image](https://github.com/bubkoo/html-to-image)** — captures the live preview DOM node directly as the export, so preview and download are always the same artwork
- **[heic2any](https://github.com/alexcorvi/heic2any)** — client-side HEIC → JPEG conversion
- **[lucide-react](https://lucide.dev/)** — icons
- Hand-rolled CSS (no framework) to keep the house's retro-signage visual language exact

## 🚀 Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start building your frame.

To ship a production build:

```bash
pnpm build
pnpm start
```

## 📁 Project structure

```
app/
  page.tsx        # Main builder UI — mode/frame state, upload, export, share
  layout.tsx       # Root layout
  globals.css      # All styling — the house's green/gold/pink visual system
components/
  PhotoEditor.tsx  # Draggable, zoomable, pinch-friendly photo surface
  ui/button.tsx    # Shared button primitive
lib/
  export-utils.ts  # DOM → PNG capture (single source of truth for exports)
  heic-utils.ts    # HEIC/HEIF detection + client-side conversion
  share-utils.ts   # Web Share API with File fallback to X intent
types/
  heic2any.d.ts    # Ambient types for the untyped heic2any package
```

## 🎨 Design language

- **Deep Goa green** background, **yellow/gold** trim, **hot pink** accents
- Editorial serif display type for headlines, monospace-style tracked caps for meta text
- Hand-placed sparkle (✦) details and a hard drop-shadow card style
- `#FrameInGoa` is the house hashtag — it ships in every export and share caption

---

<div align="center">

Built in Goa · Ship from paradise 🌴

</div>
