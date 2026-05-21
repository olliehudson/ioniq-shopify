# IONIQ — Shopify Theme

A complete, modular Shopify theme matching the IONIQ brand (white/cream + green/silver palette, with purple bamboo accent).

## How to install

### Option A — Manual upload via Shopify Admin (simplest)
1. Go to **Online Store → Themes → Add theme → Upload zip**.
2. Zip the contents of this folder (everything *inside* `shopify/`, not the folder itself).
3. Upload.
4. Once uploaded, click **Customize** to open the Theme Editor.
5. Assign templates to your pages:
   - Pages → Edit each page → set Template to `faq`, `our-story`, `contact`, `editorial`, or `performance` as needed.
6. Add your product images to each section via the editor.

### Option B — Shopify CLI / GitHub
```bash
shopify theme push --store=your-store.myshopify.com
```
or commit this folder to your GitHub-connected theme branch.

## Folder structure
- `layout/theme.liquid` — base shell
- `sections/*.liquid` — every page-builder section. Each has a `{% schema %}` so Shopify's editor can drive it.
- `templates/*.json` — page templates (index, product, page.faq, page.our-story, page.contact, page.editorial, page.performance, etc.)
- `assets/theme.css` — single CSS file driving the whole design system
- `snippets/icons.liquid` — shared SVG icon symbols
- `config/settings_schema.json` — global theme settings (brand, colours, social links)
- `locales/en.default.json` — base translations

## Section catalogue (use in the Theme Editor)
**Storefront / Home**
- `home-hero` — main hero with product image + spec tiles
- `feature-strip` — sage band of icon + benefit items
- `what-is` — diagram + pills (4 supplement types)
- `flavour-lineup` — 4 flavour cards (mark "Coming soon" per card)
- `testimonials`, `marquee`, `journal-teaser`

**Product (PDP)**
- `main-product` — variant + selling plan ATC (replaces stock Dawn product)
- `sodium-math` — three big-number cards
- `bamboo-salt` — hero ingredient block with comparison table
- `benefits-list` — 5-bullet benefit list
- `athlete-benefits` — 4-card athlete grid
- `stack-compare` — image + headline
- `athlete-protocol` — 4-card timing protocol
- `reviews-grid` — sport-tagged review cards
- `guarantee` — rotating SVG seal + headline + CTA

**Our Story**
- `story-hero`, `story-chapter`, `timeline`, `values-grid`, `team-grid`, `cta-band`

**FAQ**
- `faq-hero`, `faq` (with side nav from category blocks)

**Contact**
- `contact-hero`, `contact-form`, `contact-channels`, `contact-locations`

**Editorial (long-form pages)**
- `editorial-hero`, `editorial-article` (paste rich HTML), `related-articles`

**Performance**
- `perf-hero`, `perf-problem`, `perf-protocol`, `perf-ingredients`, `perf-vs`, `perf-data`, `whole-body-benefits`, `experts`, `certifications`, `perf-faq`

## Customising the design system
Edit colour, spacing, and type tokens at the top of `assets/theme.css`:
```css
:root{
  --green: #1A8859;
  --green-deep: #0F6B40;
  --paper: #F4ECDB;
  --ink: #0E0E0E;
  --bamboo: #3B0E78;
  ...
}
```

## Next steps after upload
1. Set up your **Main menu** in Online Store → Navigation with these links: Home, Shop, FAQ, Journal, Our Story, Contact. The header reads from this menu.
2. Upload your **product images** via the Theme Editor (each section that has an `image_picker` setting).
3. In the Performance / Story templates, drag-reorder sections in the editor to taste.
4. Add **selling plans** to your IONIQ product in Admin → Products to enable the Subscribe & Save option.

## Known caveats
- The `main-product` section is intentionally minimal — it covers variant selection, selling plans, ATC and accordion blocks. If you use third-party subscription apps (Recharge, Skio, etc.), you may need to swap their ATC widget in.
- Cart drawer / quick-buy not included (template uses standard cart page).
- The dropdown "Journal" menu in the header is driven by Header section blocks — add 1-3 article previews from the editor.

— Built for IONIQ, 2026.
