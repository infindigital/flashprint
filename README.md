# Flash Print Solution — static website

A pure static HTML5 / CSS3 / vanilla JavaScript website for **flashprintsolution.com**, replacing the WordPress site.
No framework, no CMS, no database, no server-side code.

> **The public GitHub repository contains the deployable website (`website/`) and its documentation only.**
> The `content/` and `tools/` folders, the SEO workbook and other planning files are kept privately on your computer.

```
Flashprint Website/
├── website/            ← THE WEBSITE (178 HTML pages + CSS, JS, images). This is what gets published.
├── content/            ← ALL EDITABLE TEXT (business details, page text, products, blog). See content/README.md
├── tools/              ← small helper that turns content/ into the HTML in website/ (needs Node.js only when you use it)
├── IMAGE-LIST.csv      ← EVERY image file: path, exact width × height, what it is, which page, brief for the new photo
├── REDIRECTS.csv       ← old WordPress URL → new URL (301)
├── SEO-DECISIONS.md    ← how the SEO workbook was applied
├── LAUNCH-CHECKLIST.md ← things only the business can confirm before going live
├── vercel.json         ← tells Vercel to serve the website/ folder (+ redirects)
└── Logo/, Seo Sheet/, Wordpress Snapshots/   ← your original project files (untouched)
```

## Publishing

- **Vercel (current):** every push to `main` on GitHub redeploys https://flashprint-five.vercel.app automatically.
  `vercel.json` serves `website/` and carries the 301 redirects.
- **Any other host:** upload the *contents* of `website/` to the web root. `.htaccess` (Apache/cPanel) and `_redirects`
  (Netlify/Cloudflare Pages) are included.

## Replacing images

Open **`IMAGE-LIST.csv`** in Excel or Google Sheets. Each row is one image file with:
the file path inside `website/`, the **exact width and height** a replacement must have, the aspect ratio, what the image is,
the page it appears on, its description (alt text) and a brief for the new photo.

1. Create your photo and crop it to the aspect ratio shown.
2. Export at exactly the width × height shown — WebP for `.webp` rows, JPG for `.jpg` rows.
3. Save with the **same file name** and overwrite the old file. Most photos have two rows (small + large size): replace both.

No HTML changes are needed. Rows marked “SHARED … (replace first)” currently borrow their category’s photo.
(Optional shortcut: put one large photo in `tools/images/custom/<folder>/<name>.jpg` and run `npm run images` in `tools/`
— it crops and exports every size for you.)

## Editing text

All text lives in `content/` — see **`content/README.md`** for which file controls which page.
After editing, run `npm run build` inside `tools/` and publish `website/`.

## Enquiry form & WhatsApp

- **Enquire Now** on every product opens a form with the product name already filled in; **WhatsApp Us** opens WhatsApp
  with “Hello, I'm interested in <product> and would like more information.” (app on phones, WhatsApp Web on desktop).
- **Email delivery of the form:** add your form service URL/key in `content/site.js` (`formEndpoint`, `formAccessKey`)
  and rebuild. Until then the form opens the visitor's email app with the enquiry pre-written to sales@flashprintsolution.com.
- Google Analytics 4: set `ga4` in `content/site.js`. Lead, WhatsApp, phone and email clicks are already tracked.

## Tools (optional, needs Node.js)

```bash
cd tools
npm install          # first time only (image tool + test browser driver)
npm run build        # regenerate every page, sitemap.xml, redirects and IMAGE-LIST.csv
npm run images       # process new photos placed in tools/images/custom/
npm run serve        # preview at http://localhost:8080
npm run validate     # check text against the writing rules
npm run qa           # links, SEO tags, images, overflow at 7 screen widths, forms, WhatsApp, menus
npm run qa:all       # the same on every page at every width
npm run qa:keyboard  # keyboard / accessibility checks
npm run qa:vitals    # LCP, CLS and page weight
```

Every product page is generated from one template, so design changes apply everywhere at once.
Fonts: Schibsted Grotesk (SIL Open Font Licence), self-hosted. Temporary photos: Unsplash licence (credits in IMAGE-LIST.csv).
