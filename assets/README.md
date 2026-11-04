# Final Gate brand kit

Open [`brand-kit.html`](brand-kit.html) in a browser to see every asset on one sheet.

All text in the SVGs is converted to outlines, so no font has to load. The wordmark is drawn from Grenze Gotisch Black and the tagline, buttons and labels from Chakra Petch Bold. Both are SIL Open Font License fonts; the licenses are in this folder.

## Logos

| File | Use |
|---|---|
| `svg/logo-horizontal.svg`, `png/logo-horizontal(@2x).png` | Main logo: gate, wordmark and "Boss Rush ◆ One Life" tagline, 960×480 |
| `svg/logo-stacked.svg`, `png/logo-stacked(@2x).png` | Stacked logo, 560×640 |
| `svg/logo-mark.svg` | FG shield mark |
| `svg/logo-mark-simple.svg` | Flat gate mark for very small sizes |
| `svg/game-tile.svg`, `png/game-tile(@2x).png` | Store or launcher banner, 960×240 |

## App icons and favicons

| File | Use |
|---|---|
| `png/app-icon-{1024,512,192,180}.png` | Rounded-square icon (180 = iOS home screen, 192/512 = Android) |
| `png/app-icon-round-{1024,512,180}.png` | Circle icon |
| `png/app-icon-maskable-512.png` | Full-bleed Android maskable icon |
| `png/favicon-{512…16}.png`, `favicon.ico` | Favicons. The `.ico` holds 16, 32, 48 and 64 |

## Icons

| File | Use |
|---|---|
| `svg/icons/*.svg`, `png/icons/*(@2x).png` | 43 UI icons on 96 px gold tiles: navigation, actions, system, status, stats, currency, skill and combat |
| `svg/classes/*.svg`, `png/classes/*(@2x).png` | Hex badges for swordsman, shaman, archer, gunner and brawler |
| `svg/ui/*.svg`, `png/ui/*@2x.png` | START GAME, SETTINGS and BACK buttons, and heart, gem and coin pills |

Icon names: achievements, agi, aoe, attack, coins, cooldown, defeat, defend, dodge, exit, fullscreen, gems, gift, guide, heal, heroes, home, info, int, key, leaderboard, locked, mute, new, pause, play, potion, ranged, retry, reward, settings, skill, skip, sound, spi, stamina, start, stats, str, unlock, victory, vit, window.

## Colors

- Gold: `#fff4bd → #ffca4f → #f29a1d → #b25d0b`
- Gate stone: `#5a50a0 → #352c6a → #1d1739`
- Background: `#14111f`

In the game, `index.html` holds the same artwork inline (shared gradients in a hidden `<svg>` with `fg-` ids), so it has no image requests.
