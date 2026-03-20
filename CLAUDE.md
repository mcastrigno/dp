# Donnelly Place — Claude Instructions

## What We're Building
A website for **Donnelly Place**, a mixed-use building owned and operated by **Venture Investments, LLC**.

## Repository & Live Site
- **GitHub repo:** https://github.com/mcastrigno/dp
- **Live site:** https://mcastrigno.github.io/dp/
- **Hosting:** GitHub Pages (free, auto-deploys on push)

## File Structure
```
dp/
├── index.html                  # Main single-page website
├── dp-idea-board.jsx           # Idea board (local/Claude only for now)
├── package.json                # Node project (Sharp image pipeline)
├── scripts/
│   └── process-images.js       # Generates WebP variants; run: npm run process-images
├── src/
│   └── data/
│       └── photos.js           # Auto-generated photo data (do not edit by hand)
└── public/
    └── images/
        ├── site/               # General site images (logo, hero, etc.)
        │   ├── logo.png
        │   ├── building.jpg
        │   ├── favicon.ico
        │   └── ...
        ├── APT 2A/             # Apartment & suite photos with WebP variants
        ├── APT 2B/
        ├── APT 2C/
        ├── Suite 1A/
        ├── Suite 1B/
        └── Suite 1C/
```

## The Building
- **Name:** Donnelly Place
- **Address:** 150 West Roseberry Rd, Donnelly, Idaho 83615
- **Phone:** 208-859-4275
- **Email:** matthew@castrigno.com
- **Management:** Venture Investments, LLC
- **Type:** Mixed-use — Apartments, Flex Space/Offices, Premier Retail, Custom Tenant Improvements
- **Architecture:** Mountain-lodge style — cream siding, deep red metal roof, warm wood trim

## Brand Identity
- **Colors:** Red `#8B1A1A`, Gold `#F5C800`, Brown `#4A2E1A`, Cream `#F7F3EC`
- **Fonts:** Georgia (headings), sans-serif (body)
- **Tone:** Warm, professional, mountain-Idaho character — upscale but approachable

## Current Site Sections
1. Fixed nav with logo
2. Hero with building photo
3. Stats ribbon
4. Spaces (4 cards: Apartments, Flex Space, Premier Retail, Custom TIs)
5. Building highlights
6. Photo gallery
7. Location + contact details
8. Contact form with interest selector
9. Tenant portal links (login + service request — not yet functional)
10. Footer

## Idea Board
- **File:** `dp-idea-board.jsx` — React component
- Maintained locally and rendered in Claude for now
- Uses `window.storage` for persistence within Claude
- To be integrated into the main site once user login is built

## Planned Features (Not Yet Built)
- User login / MyDP portal
- Service request form (for tenants)
- Functional contact form (needs email backend)
- Idea board integrated behind login

## Image Pattern
Every `<img>` should use srcset + lazy loading:
```html
<img src="{original}" srcset="{400w} 400w, {800w} 800w, {1200w} 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  width="{w}" height="{h}" alt="{alt}" loading="lazy"/>
```
Run `npm run process-images` after adding new photos to regenerate WebP variants and `src/data/photos.js`.

## Workflow
Edit locally → `git push` → auto-deploys to GitHub Pages
