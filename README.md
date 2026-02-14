# Scrammio

## Dev

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Products (JSON)

Edit **`data/products.json`** to add, remove, or update products. Cards and game pages are driven by this file.

- **games** — `id`, `title`, `tagline`, `shortDesc`, `image`, `heroImage`, `about`, `gameplay`, `gameplayBullets` (array), `gallery` (array), `shopUrl`. Card links use `game.html?id=<id>`.
- **badges** — `id`, `title`, `shortDesc`, `image`, `shopUrl`.
- **custom** — `id`, `title`, `shortDesc`, `image`, `linkUrl` (e.g. `custom.html`).
- **prints** — `id`, `title`, `shortDesc`, `image`, `shopUrl`.

Use image paths like `images/name.webp` or placeholder URLs. Refresh after editing; no HTML changes needed.
