# Flash Print Solution — static website

A pure static HTML5 / CSS3 / vanilla JavaScript website for **flashprintsolution.com**, replacing the WordPress site.
No framework, no CMS, no database, no server-side code.

> **This repository contains the deployable website (`website/`) and its documentation only.** The optional `src/` build tools,
> the SEO workbook and other planning files are kept privately and are not published here. Sections below that mention
> `src/` apply to the private working copy.

```
Flashprint Website/
├── website/                 ← THE WEBSITE. Upload the contents of this folder to your web host.
│   ├── index.html           home page
│   ├── <page-url>/index.html   every page lives in its own folder → clean URLs like /business-card-printing-dubai/
│   ├── assets/css/main.css  the whole design system (one file)
│   ├── assets/js/main.js    all behaviour (menus, enquiry modal, WhatsApp, gallery, filters) — no libraries
│   ├── assets/images/…      all images, organised by page type (see "Images")
│   ├── assets/fonts/        self-hosted Schibsted Grotesk (SIL Open Font Licence)
│   ├── assets/brand/        official logo files (trimmed of padding only) + favicons
│   ├── sitemap.xml, robots.txt, 404.html, site.webmanifest, favicon.ico
│   ├── .htaccess            Apache/cPanel: 301 redirects from the old WordPress URLs, caching, 404 page
│   └── _redirects           the same redirects in Netlify / Cloudflare Pages format
├── src/                     optional maintenance tools (NOT uploaded). Needs Node.js only if you use them.
├── REDIRECTS.csv            old WordPress URL → new URL, for your records / Search Console
├── IMAGE-MANIFEST.csv       every image slot: file name, size, ratio, alt text and the prompt for the custom photo
├── IMAGE-CREDITS.csv        sources of the temporary stock photos
├── SEO-DECISIONS.md         how the workbook was applied (canonical pages, duplicates, keyword conflicts)
└── LAUNCH-CHECKLIST.md      things only the business can confirm before going live
```

## Deploying

The `website/` folder is the complete site. Upload **its contents** to the web root (`public_html/` on cPanel).
It works on any static host: cPanel/Apache, Nginx, Netlify, Cloudflare Pages, Vercel (static), S3, etc.

- **Apache / cPanel:** `.htaccess` is included (redirects, 404 page, caching). Make sure hidden files are uploaded.
- **Netlify / Cloudflare Pages:** `_redirects` is picked up automatically.
- **Nginx:** convert `REDIRECTS.csv` to `return 301` rules; set `error_page 404 /404.html;`.

To preview locally without uploading: `cd src && npm run serve` → http://localhost:8080 (or any static server pointed at `website/`).
Opening the HTML files directly from disk will not work properly because links use clean root URLs (`/about/`).

## Before launch

Work through **LAUNCH-CHECKLIST.md** — in particular: connect the enquiry form, add social-profile URLs,
replace placeholder testimonials, and replace the temporary stock photography.

## Enquiry form & WhatsApp

- Every product page has **Enquire Now** (opens a modal with the product name pre-filled) and **WhatsApp Us**
  (opens WhatsApp with “Hello, I'm interested in <product> and would like more information.”).
  Mobile opens the WhatsApp app directly (wa.me); desktop opens WhatsApp Web directly.
- Catalog-only items on category pages have the same two buttons.
- The WhatsApp number, phone, email, address and hours live in one place: `src/data/site.js`
  (they are baked into the HTML, so edit there and rebuild — or search-and-replace in `website/` if you are not using the tools).
- **Form delivery:** a static site needs a form service to email submissions. Set `formEndpoint` (and `formAccessKey` if the
  service uses one) in `src/data/site.js`, then rebuild. Any JSON form service works, e.g. Web3Forms
  (`https://api.web3forms.com/submit` + access key) or Formspree (`https://formspree.io/f/<id>`).
  **Until an endpoint is set, the form validates and then opens the visitor's email app with the enquiry pre-written
  to sales@flashprintsolution.com**, and the success message tells them to press send.
- Google Analytics 4: set `ga4` in `src/data/site.js`. The site already sends `generate_lead`, `whatsapp_click`,
  `phone_click`, `email_click` and `enquiry_open` events.

## Images

Every image is a fixed “slot” with a fixed file name and aspect ratio, so **replacing an image never requires touching HTML**.

- Files: `website/assets/images/<folder>/<name>-<width>.webp`, two widths per image (e.g. `-640` and `-1200`).
- Product pages have four roles: `-hero`, `-detail` (material/finish), `-application` (in use), `-production`.
- `IMAGE-MANIFEST.csv` lists every slot with its folder, sizes, aspect ratio, alt text, the page(s) it appears on,
  and a ready-to-use prompt for the custom photograph (following the workbook's Image Plan: fictional/unbranded products,
  never the Flash Print Solution logo on generic products).

**Replacing with your custom photos (recommended way, needs Node.js):**
1. Put the photo at `src/images/custom/<folder>/<name>.jpg` (folder + name from IMAGE-MANIFEST.csv, any size ≥ 1600 px wide).
2. `cd src && npm install` (first time only), then `npm run images`. It crops to the right ratio and writes both WebP sizes.

**Without Node.js:** export the image yourself at the exact sizes listed in the manifest (same aspect ratio) as WebP,
and overwrite both files with the same names.

The current photos are **temporary** stock images (Unsplash licence, see IMAGE-CREDITS.csv), each hand-reviewed to show
generic, unbranded products; no photo is reused across unrelated pages. Eight product-page slots currently share their
category's photo — IMAGE-MANIFEST.csv marks them "SHARED … (replace first)". The portfolio uses stock placeholders too —
replace with real completed projects before launch.

(How the temporary set was produced, if you ever need to redo it: `scripts/stock-candidates.js` finds candidates and builds
contact sheets, reviewers record ranked picks in `src/data/stock-picks/`, `scripts/stock-resolve.js` assigns unique photos,
`scripts/stock-proof.js` makes proof sheets, `npm run images` processes them. Downloaded masters are cached in `src/images/stock/`.)

## Editing content (with the tools)

All text lives in plain JavaScript data files under `src/`:

| What | File |
|---|---|
| Business details, form endpoint, analytics | `src/data/site.js` |
| Categories & products (from the SEO workbook) | `src/data/catalog.js` ← reads `src/data/workbook.json` |
| Category + product page copy | `src/content/categories/<category>.js` |
| Service hub pages | `src/content/services.js` |
| Industry pages | `src/content/industries.js` |
| Blog articles | `src/content/blog/part1.js`, `part2.js` |
| Home, About, How it works, Contact, 404 copy | `src/pages/*.js` |
| Redirects | `src/data/redirects.js` |

Then run:

```bash
cd src
npm install            # first time only (installs the image tool + the QA browser driver; nothing is added to the website)
npm run build          # regenerates every page, sitemap.xml, redirects and manifests into ../website
npm run images         # only if you changed/added images
npm run qa             # links, SEO tags, headings, images, overflow at 7 screen widths, console errors, modal/WhatsApp behaviour
npm run qa:all         # the same browser checks on every page at every width (slow)
npm run qa:keyboard    # keyboard / focus accessibility
npm run qa:vitals      # LCP, CLS and page weight on key pages
node scripts/validate-content.js   # checks copy against the claims policy and SEO length rules
```

Every product page is generated from **one template** (`src/pages/product.js`) and every category from one template
(`src/pages/category.js`), so a design change applies everywhere at once.

## Browser support

Current Chrome, Edge, Safari (iOS 14+), Firefox and Samsung Internet. Animations respect `prefers-reduced-motion`.
