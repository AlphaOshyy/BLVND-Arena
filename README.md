# BLVND Arena

Interactive booking website for BLVND Arena, Galle.

## Current build

The first build focuses on a fast mobile and desktop experience with a GTA VI inspired visual direction, real Rockstar Games artwork in the featured section, BLVND session pricing, WhatsApp booking requests, and a starter admin control room.

## Pricing

### Other games

| Session | Price |
| --- | ---: |
| 15 min | Rs. 250 |
| 30 min | Rs. 450 |
| 1 hour | Rs. 750 |

### GTA VI experience

| Package | Price |
| --- | ---: |
| 30 minutes | Rs. 350 |
| 1 hour | Rs. 650 |
| 2 hours | Rs. 1,200 |
| 3 hours | Rs. 1,800 |
| Longer sessions | Rs. 600 per hour for sessions over 1 hour |
| 30-minute combo, 1 cool drink | Rs. 450 |
| 1-hour combo, 1 cool drink | Rs. 750 |
| Crew Pack, 4 people, 1 hour, 4 cool drinks | Rs. 1,200 |
| Extra cool drink | Rs. 140 |

The site renders a responsive Three.js hero illustration behind the existing BLVND branding. The 3D scene is lazy-loaded and does not capture pointer events. It pauses rendering when offscreen, and users with reduced-motion preferences see the static hero.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Booking flow

1. Customer chooses a game and a package.
2. The form displays GTA VI pricing only for GTA VI, and existing standard rates for other games.
3. Customer picks date and time and enters their contact information.
4. The form calculates any extra GTA VI cool drinks at Rs. 140 each.
5. WhatsApp opens with the package, price, total, and requested session details.
6. BLVND staff confirms availability manually through WhatsApp.

The active entry point is `src/main.jsx`, which imports `src/BLVND.jsx`. Other legacy React components are not used by the production entry point.

## Admin starter

Open `/admin`.

Demo password: `blvndadmin`

This client side admin is for the first prototype only. Before public launch, replace it with Supabase Auth and a PostgreSQL database. Do not use the demo password in production.

## Media

The featured GTA VI artwork references official Rockstar Games media. Rockstar Games currently provides official GTA VI artwork, screenshots and videos through its media pages.

Official media: https://www.rockstargames.com/VI/media

The site positions BLVND as an independent gaming venue and does not present itself as an official Rockstar Games website.

## Next build targets

• Supabase database
• Secure admin authentication
• Real game management
• Real package management
• Real booking availability
• Staff booking status updates
• WhatsApp number configuration in admin settings
• BLVND gallery using real venue photos
• Events and offers
• Production domain and deployment
