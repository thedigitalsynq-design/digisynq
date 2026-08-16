# DIGISYNQ — The Operating Network for Cinema

> A GitHub Pages–ready marketing site for **DIGISYNQ** — an open, asset-light, trusted and continuously learning operating network that coordinates verified cinema talent, studios, gear, and production capacity.

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?style=flat&logo=github)](https://pages.github.com/)
[![Zero Dependencies](https://img.shields.io/badge/Zero%20Dependencies-Vanilla%20JS-success)](#)

---

## ✨ Features

- **9-page architecture** spanning the full narrative: problem, platform, verified network, business model, production stories, infographic, about, contact, and capability registration
- **Obsidian design system** — DM Serif Display × Plus Jakarta Sans × JetBrains Mono, liquid glassmorphism, electric cyan accent
- **Interactive capability graph** hero, orchestration simulator, 10-step mechanism carousel, and Plan A/B/C resilience switcher
- **Live forms** — register/contact POST to the Node API and gracefully fall back to `localStorage` when offline
- **Verified network page** wired to `GET /api/talents` (category + search filters)
- **Zero-dependency Node server** with hardened static serving, JSON API, security headers, and a styled 404
- **A11y** — ARIA tab state, labelled canvas, noscript FOUC fallback
- **Scroll reveal** animations via IntersectionObserver, sticky nav with mobile drawer
- **GitHub Actions workflow** for automatic Pages deployment

---

## 📁 Project Structure

```
digisynq-website/
├── index.html           # Landing — problem, paradigm shift, simulator, capability specimens
├── platform.html        # Capability graph, verification stack, 10-step mechanism, Plan A/B/C
├── network.html         # Verified network registry (talent / studio browsing)
├── business.html        # Business model & monetization
├── stories.html         # Production stories & use cases
├── infographic.html     # Full visual overview
├── about.html           # Mission & philosophy
├── contact.html         # Produce a project / mandate intake (POST /api/feedback)
├── register.html        # Join the capability graph (POST /api/register)
├── 404.html             # Styled not-found page
├── server.js            # Zero-dependency Node HTTP server + REST API (port 3000)
├── assets/
│   ├── css/
│   │   └── style.css    # Master design system v11
│   └── js/
│       ├── app.js       # Navigation, reveal, tabs, simulator, parallax
│       ├── db.js        # DigisynqDB localStorage fallback (register)
│       ├── feedback.js  # Offline feedback/mandate fallback
│       └── posts.js     # Network activity feed
├── .github/
│   └── workflows/
│       └── gh-pages.yml # CI/CD for GitHub Pages
└── README.md
```

---

## 🚀 Local Development

Requires **Node.js 14+** for the API server:

```bash
npm start        # or: node server.js
# Then visit: http://localhost:3000
```

> Static-only hosting (e.g. GitHub Pages): forms gracefully fall back to `localStorage`, so the site works without the server.

---

## 🔌 API Endpoints

| Method | Endpoint          | Description                                   |
|--------|-------------------|-----------------------------------------------|
| GET    | `/api/health`     | Service health + uptime                       |
| GET    | `/api/talents`    | Verified talent registry (`?category=&q=`)    |
| GET    | `/api/studios`    | Studio / stage registry                       |
| GET    | `/api/stats`      | Network-wide operating stats                  |
| GET    | `/api/posts`      | Network activity feed                         |
| POST   | `/api/posts`      | Create a feed post                            |
| POST   | `/api/feedback`   | Mandate / feedback intake                     |
| POST   | `/api/register`   | Register capability into the graph            |
| POST   | `/api/calculate`  | Production orchestration estimate             |

All POST bodies are JSON, capped at 100 KB (`MAX_BODY_BYTES` in `server.js`). Unknown `/api/*` routes return JSON 404; malformed or oversized bodies return 400.

---

## 📦 Deploy to GitHub Pages

1. Push this folder to a new repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — DIGISYNQ website"
   git remote add origin https://github.com/<username>/<repo>.git
   git branch -M main
   git push -u origin main
   ```
2. Go to **Settings → Pages → Source: Deploy from a branch → main → / (root)**.
3. The included `.github/workflows/gh-pages.yml` also auto-deploys on every push to `main`.

---

## 🎨 Customisation

All design tokens live in the `:root` block at the top of `assets/css/style.css`:

```css
:root {
  --bg: #030305;            /* Obsidian base   */
  --cyan: #38bdf8;          /* Signal accent   */
  --font-serif: 'DM Serif Display', serif;
  --font-sans: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

Canonical component styles (`.shift-*`, `.cap-*`, `.problem-*`) are consolidated under sections §28–§29 of `style.css`.

---

## 📜 License

MIT — free to use, modify, and distribute.

---

*Built for DIGISYNQ — the network between the dots.*