# $MACOIN — Liberté. Égalité. Liquidity.

An English-language parody one-pager starring Emmoonuel Macoin, président of ze Républik of Soluna. Announced launch date: **17 October 2026**. Launch time is not yet announced.

## Develop

Requires Node.js 20 or later. No installation or build step is necessary.

```sh
npm run dev
npm run check
```

Preview: `http://127.0.0.1:4173`. The server only exposes `site/`.

## Cloudflare Pages

Production domain: https://macoin.lol/

Project: `emmoonuel-macoin` — https://emmoonuel-macoin.pages.dev/

The custom apex domain `macoin.lol` points to `emmoonuel-macoin.pages.dev` through a Cloudflare-managed CNAME record.

Connected repository: `EmmoonuelMacoin/-MACOIN`, production branch `main`. Pushes to `main` automatically deploy through Cloudflare Pages.

- Framework preset: None.
- Root directory: repository root.
- Build command: leave empty (or `exit 0` if required).
- Build output directory: `site`.
- No environment variables, Worker, database or paid service required.

For manual deployment, upload the contents of `site/`. Do not upload the whole workspace.

## Launch configuration

Edit `site/config.js` to add the verified contract address and specific pump.fun, DexScreener and X links. Empty or invalid values are deliberately not actionable. The site never automatically announces a live token solely because the date has arrived. The countdown uses calendar days in Europe/Paris; the downloadable event is an all-day, tentative event, with no invented launch hour.

The date also appears in `site/index.html`, the page metadata and `site/macoin-lancement.ics`. Update all of these if the announced launch date changes.

The presidential profile image in `site/logo.png` also supplies the favicon, Apple touch icon and social preview. Run `powershell -File tools/export-brand-assets.ps1` on Windows to re-export them without changing the artwork. `site/og.png` is the full square portrait; the X summary card preserves its square composition. The canonical URL, social metadata, structured website data and sitemap use `https://macoin.lol`. Search engines choose when to refresh their cached icons and previews.

The current art direction uses cobalt, navy, ivory and restrained red, with small high-visibility yellow accents around the 17 October launch. A vest icon and roundabout copy acknowledge the call for a Gilets jaunes mobilisation on that date, with a source link and no claimed affiliation. UI symbols use the local SVG sprite `site/icons.svg`; do not add emoji to the interface.

The profile background reinterprets the official presidential portrait's office, garden and flags in cartoon style; Emmoonuel retains his original identity and sunglasses. The ordinary citizens in archives 04 and 05 have normal human faces, while government members retain the intentionally absurd caricature. `site/macoin-coin.png` is a separate front-facing cartoon token illustration with a silver ring and gold centre, available to download in the tokenomics section.

The owner's announced token plan is a total supply of 1,000,000,000 $MACOIN, 1% buy tax and 1% sell tax. These are prelaunch specifications, not claims that a contract has already been deployed or verified. Allocation, liquidity and implementation details remain unannounced; do not invent burns, locks, audits or distribution percentages. Confirm launch-platform compatibility before deploying the token.

## Contents

- `site/`: deployable HTML, CSS, vanilla JavaScript, local fonts and original supplied artwork.
- `tools/serve.mjs`: local preview server.
- `sources/`, `docs/`: original materials retained locally and excluded from Git.
- `.artifacts/`: local QA material, excluded from Git and deployment.

The gallery contains ten of the supplied memes. The two source images flagged for correction in the original brief are kept locally and excluded from publication.

This is a fictional satire project with no affiliation to Emmanuel Macron or a public institution. No financial return is promised.
