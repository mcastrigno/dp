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
├── donnellyplace.html      # Main single-page website
├── dp-idea-board.jsx       # Idea board (local/Claude only for now)
├── images/
│   ├── logo.png
│   ├── building.jpg
│   ├── entry.jpg
│   ├── office.jpg
│   ├── hallway.jpg
│   └── keycode.jpg
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

## Workflow
1. Make changes in Claude
2. Download updated file
3. Save to local `dp/` folder
4. Commit and push to GitHub → auto-deploys to GitHub Pages
