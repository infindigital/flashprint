# How the SEO workbook was applied

Source of truth: `Seo Sheet/Flash Print Plan.xlsx` (all 18 sheets read; snapshot in `src/data/workbook.json`).

## Site architecture

| Page type | Count | Source sheet |
|---|---|---|
| Home | 1 | Page & Content Plan |
| Service hubs (Printing Services, Digital, Offset, Signage, Corporate Printing) | 5 | Page & Content Plan, Keyword Map |
| Category hubs (all 26 categories, indexable, unique copy) | 26 | Category SEO Expansion |
| Product / service pages | 112 | Product SEO Expansion (every "YES" row) + 6 Page & Content Plan pages |
| Industry pages + overview | 8 | Page & Content Plan |
| Blog articles + index | 18 | Blog SEO Content (all 17 topics) |
| All-products catalog (`/printing-products-dubai/`, kept from the old site) | 1 | — |
| About, How It Works, Contact, Portfolio, Privacy, Terms | 6 | Page & Content Plan |
| **Indexable total** | **177** | + custom 404 (noindex) |

All **26 categories** and all **132 Master Catalog entries** are represented. Catalog-only items (the 19 rows marked
"Category page / catalog item") appear as cards on their category page with Enquire and WhatsApp buttons, as the workbook
recommends ("do not create thin doorway pages").

## Duplicates → one canonical page

Entries listed in two categories link to a single canonical URL (workbook: "use one canonical SEO page and link to it from multiple categories"):

| Entry | Also listed in | Canonical page |
|---|---|---|
| Door Hangers | Hospitality | `/hotel-door-hanger-printing-dubai/` |
| Tent Cards | Hospitality | `/tent-card-printing-dubai/` |
| Warning Labels | Healthcare & Medical | `/warning-labels-dubai/` |
| Magnetic Stickers | Sticker Materials | `/magnetic-stickers-dubai/` |
| Reflective Stickers | Sticker Materials | `/reflective-sticker-printing-dubai/` |
| Transparent Stickers | Sticker Materials | `/transparent-sticker-printing-dubai/` |
| **Custom T-Shirts** (Corporate Gifts) | — | `/t-shirt-printing-dubai/` * |
| Stickers (Marketing, catalog item) | — | `/sticker-label-printing-dubai/` * |

\* Judgement calls: the workbook marks *Custom T-Shirts* (`custom t-shirt printing Dubai`) and *T-Shirt Printing*
(`t shirt printing Dubai`) as two standalone pages, but they target the same search intent and would compete, so both entries
point to one page. The Sticker & Label hub carries "sticker printing Dubai" because the Master Catalog does not give generic
stickers their own page.

## Page & Content Plan pages merged into Master Catalog pages (same intent, different URL)

| Planned URL | Built as |
|---|---|
| `/invoice-ncr-book-printing-dubai/` | two pages: `/invoice-book-printing-dubai/` + `/ncr-book-printing-dubai/` (Master Catalog) |
| `/menu-printing-dubai/` | `/restaurant-menu-printing-dubai/` |
| `/backdrop-printing-dubai/` | `/event-backdrop-printing-dubai/` |
| `/label-printing-dubai/` | `/product-label-printing-dubai/` |
| `/sticker-printing-dubai/` | `/sticker-label-printing-dubai/` (category hub) |
| `/event-exhibition-printing-dubai/` | `/event-printing-dubai/` (Category SEO Expansion URL, also the existing live URL) |

Built from the Page & Content Plan because no Master Catalog row covers them: Letterheads (also a real product on the old
site), Catalogues, Invitations, Banners, Office Signage, Shop Signage.

## Keyword conflicts resolved

| Page | Workbook keyword | Used | Why |
|---|---|---|---|
| Design & Creative Services hub | graphic design services Dubai | design and creative services Dubai | Identical to the Graphic Design product page keyword |
| Construction & Site Printing hub | construction site signage Dubai | construction site printing Dubai | Identical to the Directional Site Signage product keyword |
| Fabrication & Installation hub | signage installation Dubai | fabrication and installation services Dubai | Near-identical to Sign Board Installation |

## Not built (pending business verification)

- **`/same-day-printing-dubai/`** (Page & Content Plan, P0). The workbook and the brief both say same-day claims must not be
  published unless verified. The blog article *How Long Does Printing Take in Dubai?* covers the topic without promising
  a timeline. If Flash Print Solution confirms a same-day service (which products, cut-off time), this page can be added.
- **Printing Company / Printing Press / Printing Shop in Dubai** (old standalone pages). The workbook allows them only if
  each has genuinely different content. "Press" would need verified equipment information, so the three old URLs are
  301-redirected to About (printing company), Printing Services (printing press) and Contact (print shop), matching the Keyword Map.

## Migration

All 137 URLs in the live WordPress sitemap were mapped (`REDIRECTS.csv`, `website/.htaccess`, `website/_redirects`):
174 × 301 rules (with and without trailing slashes on Netlify), 2 × 410 for WordPress demo pages. URLs that are
identical on the new site (home, `/business-stationery-printing-dubai/`, `/corporate-printing-dubai/`,
`/event-printing-dubai/`, `/large-format-printing-dubai/`, `/printing-products-dubai/`) keep their rankings with no redirect.
The build verifies every redirect target (and `#anchor`) exists.

## Technical SEO implemented

- Unique `<title>`, meta description and H1 on every page; self-referencing canonical; no `noindex` except 404.
- Open Graph + Twitter cards with a 1200×630 JPEG per page type.
- JSON-LD: Organization + LocalBusiness (real address, phone, email, hours; no invented ratings, prices or awards),
  WebSite, BreadcrumbList, Service (product, category, service and industry pages), FAQPage (only where FAQs are visible),
  BlogPosting, ItemList (category products), HowTo (process page).
  Product pages use **Service** rather than **Product** schema: Product rich results require price, review or rating data,
  which we must not invent for quote-based custom print.
- Visible breadcrumbs on every deep page; logical H1 → H2 → H3; descriptive alt text on every image.
- Internal linking: Home → categories → products; product → parent category, related products, industries, guides;
  blog → products + categories + quote; catalog page links every product; footer links key hubs.
- `sitemap.xml` (177 URLs) and `robots.txt` (allows everything, points to the sitemap).
- Responsive WebP images with width/height, lazy loading below the fold, LCP image preloaded with `fetchpriority`.
