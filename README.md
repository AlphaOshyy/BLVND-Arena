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
| 15 min | Rs. 300 |
| 15 min + snack or drink | Rs. 550 |
| Standard, 1 hour | Rs. 750 |
| Gamer Combo, 1 hour + snack or drink | Rs. 1,100 |
| Crew Pack, 4 players, 1 hour, snack for each, group photo | Rs. 4,200 |
| Launch Day VIP | Rs. 1,150 |

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

1. Customer chooses a game and package.
2. Customer selects a date and time.
3. Customer enters name and WhatsApp number.
4. The request is saved locally as Pending in the starter build.
5. WhatsApp opens with a prefilled booking request.
6. BLVND staff confirms or rejects the request manually.

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
