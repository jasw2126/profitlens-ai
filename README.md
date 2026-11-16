# ProfitLens AI

A sleek, dark-mode SaaS landing page built with **Next.js 15 (App Router)** + **TypeScript** + **Tailwind CSS** + **shadcn/ui** design patterns.

## ✨ Features

- **Hero Section** — Bold headline with animated gradient text, CSV drop preview card, live stat metrics
- **Bento Grid** — 3 feature cards: Instant Profit Charts, AI Money-Leak Alerts, 3-Step Growth Plan
- **Pricing Section** — Free plan (1 CSV scan) vs Pro plan (₹2,999/mo · Unlimited + PDF Export)
- **Footer** — Links, socials, system status
- **Dashboard** — Stub `/dashboard` page with CSV drop zone

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (dark mode)
│   ├── page.tsx            # Landing page (composes all sections)
│   ├── globals.css         # Tailwind + custom CSS
│   └── dashboard/
│       └── page.tsx        # Dashboard stub page
├── components/
│   ├── Navbar.tsx          # Sticky nav with mobile menu
│   ├── HeroSection.tsx     # Hero with CSV preview card
│   ├── BentoSection.tsx    # 3-card bento feature grid
│   ├── PricingSection.tsx  # Free + Pro pricing cards + FAQ
│   ├── Footer.tsx          # Footer with links + socials
│   └── ui/
│       ├── button.tsx      # CVA-powered Button
│       ├── badge.tsx       # Badge variants
│       └── card.tsx        # Card primitives
└── lib/
    └── utils.ts            # cn() helper (clsx + tailwind-merge)
```

## 🛠 Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui patterns |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
