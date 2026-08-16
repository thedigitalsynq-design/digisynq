# DIGISYNQ — Digital Ecosystem Website

> A premium, GitHub Pages–ready static website for **DIGISYNQ** — a digital ecosystem where brands, creators, businesses, influencers, studios, and professionals connect, collaborate, promote, and grow.

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?style=flat&logo=github)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🌐 Live Site

After deployment: `https://<your-username>.github.io/<repo-name>/`

---

## ✨ Features

- **Dark-mode first** design with vibrant purple-blue gradients
- **Glassmorphism** service cards with hover animations
- **Fully responsive** — mobile, tablet, and desktop layouts
- **16 service cards** with icons, descriptions, and category tags
- **Animated hero** with floating background orbs and grid lines
- **Ecosystem nodes** section with DIGISYNQ positioning statement
- **Contact page** with form validation + Formspree / mailto fallback
- **Scroll reveal animations** powered by IntersectionObserver
- **Sticky navigation** with mobile hamburger menu
- **SEO-ready** — title tags, meta descriptions, semantic HTML5, Open Graph
- **Zero dependencies** — pure HTML, CSS, and vanilla JavaScript

---

## 📁 Project Structure

```
digisynq-website/
├── index.html              # Landing page (Hero, About, Services, Ecosystem, CTA)
├── contact.html            # Contact page with form
├── assets/
│   ├── css/
│   │   └── style.css       # Complete design system
│   └── js/
│       └── app.js          # Navigation, animations, form logic
├── .github/
│   └── workflows/
│       └── gh-pages.yml    # CI/CD for GitHub Pages
└── README.md               # This file
```

---

## 🚀 Local Development

No build tools required — just open the HTML file!

**Option 1: Open directly**
```bash
start index.html   # Windows
open index.html    # macOS
```

**Option 2: Serve locally (recommended)**
```bash
# Using npx
npx serve .

# Using Python
python -m http.server 8080
# Then visit: http://localhost:8080
```

---

## 📦 Deploy to GitHub Pages

### Method 1: Manual (Simple)

1. Create a new GitHub repository  
   ```
   https://github.com/new
   ```
2. Initialize Git in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — DIGISYNQ website"
   ```
3. Add your remote and push:
   ```bash
   git remote add origin https://github.com/<username>/<repo>.git
   git branch -M main
   git push -u origin main
   ```
4. Go to **Settings → Pages** in your repository  
5. Set **Source** to `Deploy from a branch → main → / (root)`  
6. Click **Save** — your site will be live in ~60 seconds!

---

### Method 2: GitHub Actions (Automatic CI/CD)

The `.github/workflows/gh-pages.yml` workflow is included and will **automatically deploy** every time you push to `main`. No extra setup needed.

---

## 📬 Contact Form Setup (Formspree)

1. Sign up free at [formspree.io](https://formspree.io)
2. Create a new form and copy your **Form ID**
3. Open `contact.html` and replace `YOUR_FORM_ID`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" ...>
   ```
4. Commit and push — the form is now live!

> If Formspree is not configured, the form falls back to opening the user's email client.

---

## 🎨 Customisation

All design tokens live in the `:root` block in `assets/css/style.css`:

```css
:root {
  --clr-primary:  hsl(270, 80%, 65%);  /* Purple  — change to your brand colour */
  --clr-primary-2: hsl(210, 90%, 60%); /* Blue    — change to your brand accent */
  --clr-accent:   hsl(35, 95%, 60%);   /* Amber   — used for highlights         */
  ...
}
```

---

## 📄 Services Covered

| Service | Category |
|---|---|
| Content Strategy | Strategy |
| Content Creation | Creative |
| Video Editing | Creative |
| Graphic Design | Design |
| Influencer Marketing | Marketing |
| Campaign Management | Marketing |
| Brand Identity | Branding |
| Digital PR & Promotion | PR |
| Lead Generation | Growth |
| Community Management | Engagement |
| Creator & Talent Management | Talent |
| Collaboration Management | Network |
| Event & Launch Promotion | Events |
| Social Media Optimization | Optimization |
| Analytics & Growth Tracking | Analytics |
| Digital Consultancy | Consulting |

---

## 📜 License

MIT — free to use, modify, and distribute.

---

*Built with ❤️ for DIGISYNQ — where brands and creators sync, grow, and thrive.*
