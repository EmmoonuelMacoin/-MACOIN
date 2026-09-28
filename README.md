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

Project: `emmoonuel-macoin` — https://emmoonuel-macoin.pages.dev/

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

The original social preview is preserved in `site/og.png`. Metadata currently uses the Pages origin. Update the canonical URL and both social image URLs if adding a custom domain.

The current art direction uses cobalt, navy, ivory and a restrained red accent. The profile background is tricolour; Emmoonuel retains his original identity and sunglasses. The ordinary citizens in archives 04 and 05 have normal human faces, while government members retain the intentionally absurd caricature.

## Contents

- `site/`: deployable HTML, CSS, vanilla JavaScript, local fonts and original supplied artwork.
- `tools/serve.mjs`: local preview server.
- `sources/`, `docs/`: original materials retained locally and excluded from Git.
- `.artifacts/`: local QA material, excluded from Git and deployment.

The gallery contains ten of the supplied memes. The two source images flagged for correction in the original brief are kept locally and excluded from publication.

This is a fictional satire project with no affiliation to Emmanuel Macron or a public institution. No financial return is promised.
