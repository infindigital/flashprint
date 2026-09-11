# Launch checklist

Items the website cannot know on its own. Nothing below was invented; each is either a placeholder or a statement to confirm.

## Must do before launch

- [ ] **Connect the enquiry form** — set `formEndpoint` (+ `formAccessKey`) in `src/data/site.js` and rebuild
      (see README → Enquiry form). Until then, submissions open the visitor's email app instead of sending directly.
- [ ] **Confirm WhatsApp number** — the site uses +971 58 891 7109 (the phone number on the current website) for WhatsApp.
- [ ] **Social profile URLs** — the current site shows Facebook, Instagram, YouTube and LinkedIn icons but the URLs are not
      in the project files. Add them to `social` in `src/data/site.js`; empty ones are hidden. (WhatsApp, email and phone icons are always shown.)
- [ ] **Testimonials** — the homepage shows three clearly marked placeholder cards. Replace with verified client quotes
      (`src/pages/home.js`, search for PLACEHOLDER) or remove the section. Do not publish invented reviews.
- [ ] **Portfolio** — all 16 portfolio items use temporary stock photos. Replace with real completed projects
      (IMAGE-MANIFEST.csv → folder `portfolio`), and adjust titles/captions in `src/data/static-images.js`.
- [ ] **Replace temporary product photography** with the custom image library (IMAGE-MANIFEST.csv has every slot and prompt).
- [ ] **Legal pages** — Privacy Policy and Terms are sensible templates for a UAE printing business; have them reviewed
      and aligned with the terms on your quotations.
- [ ] **Analytics** — add the GA4 ID (`ga4` in `src/data/site.js`), verify the domain in Google Search Console and submit
      `https://flashprintsolution.com/sitemap.xml`.
- [ ] **Redirects live** — after switching hosting, spot-check a few old URLs from `REDIRECTS.csv` (e.g.
      `/product/kraft-bags-printing-dubai/` → `/kraft-bag-printing-dubai/`). Cloudflare can keep managing HTTPS/www.

## Statements to confirm with the business

These are worded as options or process steps (never as guarantees), but please confirm they are offered:

- Every order gets an artwork check and a proof for approval before production (used site-wide; from the workbook's process).
- Delivery, collection and installation arranged per quote; installation at client premises in Dubai.
- Site surveys for signage / facility signage schedules; press or hard proofs "on request"; packaging samples or mock-ups.
- Approved specifications / files kept on record for reorders; quotes that reference purchase-order numbers.
- Chef jackets & aprons (uniforms), USB-C drives, spare door inserts / counter-number sets "on request"; periodic sign checks.
- Digital **and** offset printing are both offered (the workbook plans pages for both).
- Glass neon vs LED neon flex — the neon page is written around LED neon flex.
- Specification values on product pages are industry-standard options (sizes, gsm, materials). Each page states that final
  specifications are confirmed in the quote; adjust any option you do not stock.

## Pages intentionally not built (see SEO-DECISIONS.md)

- `/same-day-printing-dubai/` — only publish if a same-day service can be verified (products, cut-off time, conditions).
- Standalone "printing company / press / shop in Dubai" pages — redirected to About / Printing Services / Contact.

## Nice to have after launch (workbook "Build Phases" 6–7)

- Real facility, team and machinery photography on About and Contact (placeholders are marked in the page source).
- Business-verified facts for About (year established, team, equipment) — add only when verified.
- Publish further guides based on Search Console queries; improve pages ranking in positions 4–20.
