# AaloPro — Brighter Futures Begin

Recovered on 16 October 2026 after the working files were accidentally deleted. The latest layout was reconstructed from this task's edit history, with the surviving original brand images, generated artwork, phone cutout, flags, and Git-backed testimonial portraits. The downloaded Nunito Sans and Kalam fonts and Singapore flag match the original file hashes.

## Open and build

Open `index.html` in a browser. Keep all extracted files and folders together, including the product and legal page folders and their stylesheets. Website artwork and fonts are local. The source-controlled Google Analytics tag loads only after analytics consent on the production domain. Hosting may inject additional scripts; see the November review below.

Run `node scripts/build.cjs` to build `dist/`. The build validates its input files before replacing that generated folder. No dependency installation is needed to use or build the website.

The GitHub repository includes the website source, assets, build and verification scripts, and the deployable `dist/` folder. ZIP downloads, local screenshots, audit reports and retained founder drafts are excluded from Git. References to `qa/` and `reports/` below describe local verification evidence; these files are available in the local project or source backup. Upload the contents of `dist/` to publish the website on your existing host.

The browser verification script requires Playwright and Chrome. Serve the website locally, then run `node scripts/verify.cjs http://127.0.0.1:8080/`. An existing Playwright installation can be selected with `AALOPRO_PLAYWRIGHT_PATH`.

## Latest requested content

- AaloApp: Primary US$1/month; Secondary US$2/month.
- AaloDot: Primary US$39; Secondary US$49.
- Product subtitle: “Customised Small LLMs. Curriculum Aligned · Voice Activated” on one line, in a consistent font size and colour.
- Impact: 2,000+ Students Activated; 500+ Teachers Onboarded; 7+ MOUs Signed with Schools; ~50,000 Questions Asked, with corresponding icons.
- Teacher testimonial: Ms. Rabeya, Teacher, Dhaka, Bangladesh.
- Parent testimonial: Mrs. Fatima, Parent, Barishal, Bangladesh.
- Supplied AaloPro header/footer logos, transparent AaloApp and AaloDot logos, and transparent AaloApp teacher splash-screen phone mockup.
- Supplied market flag files and rectangular Singapore flag.
- Bold “Built in Singapore for emerging markets.” with 24px of bottom spacing.
- Footer: AALO PRO PTE. LTD. | 10 BUKIT BATOK CRESCENT, #10-05B THE SPIRE, SINGAPORE 658079.
- Get in touch: `help@aalopro.com`. Product cards link to their detail pages.
- Premium gold and charcoal SVG icons in the Why AaloPro, AaloApp, and AaloDot sections.
- The homepage and AaloApp hero download badges link directly to AaloApp BD Primary on Google Play. Explore AaloApp links continue to open the editions page.

## Files and verification

`index.html` contains page content, semantic pricing lists, and SVG icons. `styles.css` contains responsive styling. `script.js` handles navigation and the accessible dialog. `asset-manifest.json` records active asset hashes. `quality-checks.json` records the recovery checks; `qa/` contains screenshots.

Recovery checks covered 1440, 1201, 1024, 721, 640, 480, 390, and 320px widths, image/font loading, anchors, overflow, pricing, artwork clearance, menu operation, dialog operation, and focus restoration.

The website ZIP is the ready-to-use website. The source backup ZIP additionally includes the build/check scripts, documentation, and retained source images. This recovery updates local files only; it does not publish a new hosted version.

## SEO update — 16 October 2026

The main public URL is https://aalopro.com/. The homepage uses the founder’s exact title and description, consistent sharing metadata, a canonical URL, Organization and WebSite JSON-LD, and intrinsic dimensions on all images. The build includes robots.txt and sitemap.xml. See reports/AaloPro-SEO-Audit-2026-10-16.html for live findings and deployment steps. These changes are local and are not yet published.

The founder subsequently deployed that SEO package. A follow-up live check confirmed the new metadata, canonical, structured data, robots.txt and sitemap.xml, plus a permanent HTTP-to-HTTPS redirect. The original audit is retained as a historical snapshot.

## Product detail pages — 16 October 2026

The latest package adds `aaloapp/index.html` and `aalodot/index.html`, styled by `product-pages.css`. Their canonical production URLs are https://aalopro.com/aaloapp/ and https://aalopro.com/aalodot/. Links include `index.html` so the extracted download also works when opened directly from a computer. The existing homepage, navigation, product cards and footers link to the detail pages; the pages link to each other and back to the homepage.

Founder-confirmed product facts:

- AaloApp Bangla Primary: built for the Bangladesh primary school curriculum.
- AaloApp Bangla Secondary: built for the Bangladesh secondary school curriculum.
- AaloApp SG Primary: built for Singapore primary school students, focusing on Chinese, English and maths.
- Public AaloApp store links are still coming soon. Existing primary/secondary pricing is retained.
- AaloDot is in planning, with a target to build it by early 2027. Its US$39/US$49 prices are marked as planned, with no claim that orders or demos are currently available. The homepage links to the AaloDot detail page through its “Explore AaloDot” button.
- Exact grade ranges, supported phone platforms, initial download requirements, and AaloDot's final curriculum and language coverage have not been confirmed. No additional specifications are asserted.

Each detail page includes a unique title and description, canonical and social metadata, Organization/WebSite/WebPage/BreadcrumbList JSON-LD, and a product entity (SoftwareApplication for AaloApp, Product for the planned AaloDot). Pricing remains visible HTML; there are no fabricated ratings, availability claims or purchase offers in structured data. FAQ answers are present in the delivered HTML and expand with native HTML details/summary controls. No JavaScript is required to read the product information or follow product links.

`robots.txt` continues to allow crawlers; the sitemap now lists all five canonical pages, including the legal pages added below. No training permissions or Cloudflare security settings have been changed. This improves discovery and clarity but does not guarantee indexing, inclusion in AI answers, or Google rich results.

Validation: run `node scripts/verify-product-pages.cjs http://127.0.0.1:8080/` with Playwright available. It covers all three pages at 1440, 1024, 768, 390 and 320px, metadata, image loading, overflow, anchors, product-card clearance, menus, FAQs, coming-soon dialogs and navigation with JavaScript disabled. Evidence is in `reports/product-pages-checks.json`, with local Lighthouse reports for each page.

### Uploading this version

The new detail pages are not yet published. The earlier ChatGPT Site is a separate preview with no custom domain attached; this package targets the founder's current aalopro.com hosting.

1. Upload the complete ready-to-use website ZIP to the current host, retaining the `aaloapp/`, `aalodot/`, `terms/`, `privacy/` and `assets/` directories. Keep all three stylesheets, script.js, the updated homepage, robots.txt and sitemap.xml at the website root.
2. Confirm the homepage, both product URLs, https://aalopro.com/terms/ and https://aalopro.com/privacy/ return HTTP 200, and the live sitemap lists all five URLs. Preserve the existing HTTPS and www redirects.
3. Submit the updated sitemap through Google Search Console and Bing Webmaster Tools, and inspect the new URLs' indexing status. These account actions have not been performed here.
4. Check the hosting/CDN logs for legitimate search crawlers. robots.txt permits crawling, but firewall rules can still block it; allow verified crawlers using their providers' published guidance. No firewall configuration has been changed here.

Provider references: [OpenAI crawlers](https://developers.openai.com/api/docs/bots), [Google AI search](https://developers.google.com/search/docs/appearance/ai-features), [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), and [Claude crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).

## Legal pages — 16 October 2026

`terms/index.html` and `privacy/index.html` use the founder's supplied drafts, retaining all 33 Terms sections and 24 Privacy sections. Company UEN: 202647042K. Effective and last-updated dates: 16 October 2026. Support and privacy contact: help@aalopro.com.

`legal-pages.css` provides readable desktop and mobile layouts, a collapsible table of contents, links to the student/family explanations and contact sections, and print styling. The pages work without JavaScript. All five footers link to both legal pages using paths compatible with an extracted local download. Each legal page has unique metadata, a canonical URL, Organization/WebSite/WebPage/BreadcrumbList structured data and a sitemap entry.

Editorial changes clarify AaloDot's planning stage and the conditional availability of product features. The Terms distinguish contractual acceptance from privacy consent, and the Privacy Policy describes the present information-and-enquiry website. No app consent workflow, analytics configuration or data-processing backend was changed. See `reports/Legal-Pages-Review-Notes-2026-10-16.txt` for precise changes and review points. The supplied liability cap and indemnity are retained for legal review; no compliance or enforceability certification is made.

Validation: all 249 internal references resolved, all five schemas parsed and all five sitemap entries were present. Original draft paragraphs, headings and list items were checked for preservation after formatting, except for the explicitly updated AaloDot descriptions. Browser checks covered 17 page/viewport combinations, including 320px mobile, all footer links, section navigation, image/font loading, menus, the app placeholder dialog and operation without JavaScript. Both legal pages scored 100 for local Lighthouse accessibility and SEO. Evidence: `reports/legal-pages-checks.json`, `reports/lighthouse-privacy.report.html`, `reports/lighthouse-terms.report.html` and `qa/legal-*.png`.

The legal pages are ready locally and in the download package; they have not been uploaded to aalopro.com. Review the wording against actual operating practices and obtain appropriate legal advice before publishing.

## Product-page brand yellow — 16 October 2026

The AaloApp and AaloDot detail pages now use the existing brand yellow (`#FFCA08`) in headline accents, feature-icon accents, section markers, edition badges, FAQ controls and development indicators. Previous muted gold backgrounds and borders use pale tints of the same yellow. Small text remains charcoal or neutral grey. The supplied artwork and shared homepage/legal-page styles are unchanged.

Verification covered both pages at 1440, 390 and 320px: computed brand colours, image loading, FAQ interaction and horizontal overflow. Desktop and mobile screenshots were visually reviewed. Evidence: `reports/brand-yellow-checks.json` and `qa/brand-yellow-*.png`. Earlier product-page Lighthouse scores predate this colour change. This update is local and included in the latest download package.

The Terms and Conditions and Privacy pages now use the same brand-yellow accents, pale yellow surfaces, contents controls, section-number badges and link underlines. Text remains dark for readability. Legal wording is unchanged. Both pages passed visual and navigation checks at 1440, 390 and 320px, including expanded contents menus. Evidence: `reports/legal-brand-yellow-checks.json`. Earlier legal-page Lighthouse scores predate this colour change.

The homepage also uses brand yellow (`#FFCA08`) for its hero headline, impact icons, feature and benefit badges, testimonial stars, link accents and launch placeholder. Yellow surfaces use tints of that same colour. Changes are scoped with `home-page`; supplied artwork and wording are preserved. Homepage checks passed at 1440, 768, 390 and 320px, including images, anchors, the coming-soon dialog and horizontal overflow. Evidence: `reports/home-brand-yellow-checks.json`. Earlier homepage Lighthouse scores predate this colour change.

## Homepage product-card actions — 16 October 2026

Each product card now has one full-width black button below its primary and secondary prices: Explore AaloApp or Explore AaloDot. The buttons link directly to the relevant local-compatible detail-page URL. The extra Try AaloApp, Discuss AaloDot and secondary text links were removed from the cards. Availability notes and pricing remain, and tablet/mobile card spacing is more compact. Other navigation and launch placeholders remain in their existing locations.

The build, both button destinations, action counts, placement after prices, retained prices and all internal references were checked. The existing file:// preview could not be inspected automatically because the browser URL policy blocked access; no new visual-browser verification is claimed for this edit. Evidence: `reports/product-card-actions-checks.json`.

## Product videos — 16 October 2026

Both detail pages now include a ten-second video beneath the introduction and above the feature list. The AaloApp video features Miss ALO and a phone learning preview; AaloDot is clearly labelled as a concept preview for the planned device. The supplied MP4 files are copied byte-for-byte, retaining original audio and embedded provenance. Lightweight WebP posters are extracted from the actual clips.

The native players provide playback, pause, seeking, volume and fullscreen controls where supported by the browser. Videos use `controls`, `playsinline` and `preload="none"`, with no autoplay, third-party embeds or new tracking. Both use the original 16:9 proportions on desktop and mobile, and have direct MP4 download links. No verified dialogue transcript was supplied, so captions have not been invented; the original soundtrack has not been transcribed or editorially reviewed.

The build and ready-to-upload package include all four media assets in `assets/videos/`. Upload this directory with the updated product HTML and `product-pages.css`. The server should serve MP4 as `video/mp4` and support byte-range requests for efficient seeking. No publishing action was performed.

Verification: both videos played, paused and sought successfully at 1440, 768, 390 and 320px, without horizontal overflow. Posters loaded, video transfers waited until playback, and native controls remain present without JavaScript. All 259 relative references resolved and the five page schemas parsed. Evidence: `reports/product-video-checks.json`; screenshots: `qa/video-*.png`. Run `node scripts/verify-videos.cjs http://127.0.0.1:8080/` against a local server with byte-range support, using `AALOPRO_PLAYWRIGHT_PATH` if required. The original basic Python preview server did not support seeking; final playback checks used a range-capable local server.

## Try AaloApp navigation — 16 October 2026

All seven Try AaloApp controls now use ordinary links to `aaloapp/index.html`, with relative paths adjusted for each page. Button styling is retained, and navigation works without JavaScript, from an extracted local folder and on the live host. The AaloApp FAQ reflects the new behaviour while retaining the app-store availability notice. Link destinations and the rebuilt ZIP were checked; no visual layout changed. This update has not been published.

## AaloDot main image — 16 October 2026

The AaloDot detail-page hero now uses the founder’s supplied `AaloDot.png`, copied without alteration to `assets/products/aalodot-overview.png`. The full square artwork fills its responsive frame with no cropping or cutout shadow. The product’s social metadata and structured-data image use the same asset. The homepage AaloDot artwork and product video are unchanged. The build and download package include the new image.

## AaloApp main image — 16 October 2026

The AaloApp detail-page hero now uses the founder’s supplied `AaloApp.png`, copied without alteration to `assets/products/aaloapp-overview.png`. The full square artwork replaces the cropped phone treatment and fills a responsive frame. Social metadata and the product schema use the same asset. The homepage phone artwork and product video are unchanged. The build and download package include the new image.

## Optional Google Analytics — 16 October 2026

`analytics.js` connects all five pages to the founder-provided GA4 web stream `G-YYPTQER95H`. `analytics-consent.css` styles an accessible, non-modal Accept/Reject panel and the Cookie settings controls in every footer. The complete site remains usable without analytics or JavaScript. Only HTTPS `aalopro.com` and `www.aalopro.com` can load the Google tag; local folders and localhost previews never send analytics.

The Google library is entirely blocked before acceptance and after refusal (basic consent mode). Acceptance grants only analytics storage; advertising storage, ad user data and ad personalisation stay denied, and Google Signals is disabled in the tag. The local consent preference and analytics cookie lifetime are set to 180 days. Rejecting after acceptance disables the property, removes accessible `_ga` and `_ga_YYPTQER95H` cookies and reloads the page to unload the library. Refusal propagates to other tabs. No consent choice is inferred from scrolling or using the website.

Events: one `page_view` per document; `product_click` for product CTA buttons; `contact_click` for mailto links; `video_start`, `video_progress` at 25/50/75% of played time since consent, and `video_complete` at playback end; `video_download` for the supplied MP4 download links. Email clicks are not confirmed enquiries, product clicks are not installations, and video completion does not prove that someone watched every second. Custom event parameters are fixed product/placement labels and numeric playback information, never email contents, student details or learning interactions.

Page-location overrides use the page's canonical URL, and referrer overrides retain only its origin. Before loading the tag after acceptance, the static site's URL query string and unrecognised fragments are removed with history.replaceState. Real section anchors continue to work. This prevents Google's automatic site-search event from collecting arbitrary query values, even if that account setting is enabled. UTM campaign parameters are consequently not retained by this minimal integration; source attribution uses referral origins. Google's account-controlled Enhanced measurement settings are separate from this source code; review the account settings described in `reports/GA4-Setup-2026-10-16.txt`. Backend retention, access permissions and Google product links were not modified through the public Measurement ID.

Privacy Policy section 11 now describes the provider, choices, identifiers, cookie lifetime, withdrawal, processing and limitations. Deployment remains manual: upload the full latest ZIP to the existing host. Verify live collection in the GA4 Realtime report after accepting analytics. A public Measurement ID is not an account credential, and no password or API secret is embedded.

Browser checks use local build files with an intercepted production origin. Google collection requests are fulfilled locally, so verification does not pollute the live property. Run `node scripts/verify-analytics.cjs /path/to/downloaded-gtag.js` with Playwright available. Evidence: `reports/analytics-checks.json`; browser screenshots: `qa/analytics-consent-*.png`. Receiving data in the actual Google Analytics dashboard must be checked after deployment.

## Footer social links — 17 October 2026

The copyright line has been replaced on all five pages with LinkedIn, YouTube, Facebook, Instagram and TikTok links supplied by the founder. The icons use light grey with brand-yellow hover and keyboard-focus states, accessible platform labels and 42px targets. Links open in a new tab with `noopener noreferrer`. The same profile URLs are listed under the Organization structured data. Social links do not load platform scripts or embeds. Icons are from Bootstrap Icons v1.13.1; the MIT license is included at `assets/icons/bootstrap-icons-LICENSE.txt`.

## Yellow header and supplied logo — 6 November 2026

All five page headers use brand yellow (#FFCA08), dark navigation and a black Try AaloApp button. The header uses `assets/brand/aalopro-header-transparent.png`, with a real transparent alpha channel, so no CSS filters or blend modes are needed to hide its background. CSS frames the artwork at the existing responsive sizes. Mobile menus use the same yellow. Organization metadata references the transparent logo; the homepage sharing image retains the supplied yellow-background version in `assets/brand/aalopro-header-yellow.png`. The stylesheet URL is versioned for the 10 November 2026 logo update to avoid stale cached styling.

The matching supplied golden-yellow lowercase footer logo is now used on all five pages. Its original file is retained at `assets/brand/aalopro-footer-yellow.png`; proportional CSS framing removes excess empty space while preserving the full bulb and wordmark.

## Modern Web Guidance and Foundation update — 16 November 2026

- Added `foundation/index.html`, with live Bengali text and photos displayed from the supplied Foundation reference. `foundation/foundation.css` provides desktop and mobile layouts; Bengali fonts are hosted locally with their OFL license. The page links back to the main website and uses `help@aalopro.com` for enquiries. No donation, registration-status or impact claims have been added beyond the supplied reference.
- Only the existing header “Try AaloApp” links now read “AaloPro Foundation” and link to the new page. All other existing buttons and their destinations are preserved at the founder's request.
- The homepage “Brighter Tomorrows.” remains the original brand yellow at the founder's request. Product-page heading accents use a darker tone for contrast.
- Markets heading: “Started in Bangladesh. Expanding across emerging markets in South and South East Asia.”
- Added responsive WebP images with `srcset`/`sizes`, preserving the original artwork and intrinsic dimensions. Original PNGs remain available. `scripts/optimize-images.cjs` is an optional regeneration utility requiring Sharp; normal builds remain dependency-free.
- Reserved space for the non-modal analytics panel and kept keyboard focus above it. Corrected landmark and rating labels. Primary navigation now also works on mobile with JavaScript disabled.
- `_headers` supplies basic MIME, referrer, framing and unused-permission protections. These headers were verified on the live Cloudflare Workers response after deployment.

Run `node scripts/build.cjs` to rebuild `dist/`. Upload the complete contents of `dist/`, including `foundation/`, new fonts, responsive images and `_headers`, to the current hosting. The Foundation canonical URL is `https://aalopro.com/foundation/`; it is included in the sitemap.

Validation: `node scripts/verify-modern-web.cjs http://127.0.0.1:8080/` checks six pages at 320, 390, 768, 1024 and 1440px, keyboard navigation, consent-banner focus, assets, metadata, and navigation without JavaScript. Set `AALOPRO_PLAYWRIGHT_PATH` to an existing Playwright installation and optionally `AALOPRO_AXE_PATH` to `axe.min.js`. The existing analytics test intercepts all collection requests locally. Local evidence is retained under `reports/modern-web-2026-11-16/`.

Hosting follow-up: the live audit observed Cloudflare's injected `beacon.min.js` and `/cdn-cgi/rum` performance requests before a consent choice. This is separate from the Google Analytics code in this repository. Review Web Analytics/Observatory automatic injection in the Cloudflare dashboard if all optional measurement should follow the banner choice. The local package does not change that account setting.

### Cloudflare production deployment — 16 November 2026

The update is published at `https://aalopro.com/`, with the Foundation page at `https://aalopro.com/foundation/`. The existing host is the static-assets Worker `red-snow-e6ee` in Mehedi Account, not Cloudflare Pages. `wrangler.jsonc` records the existing custom domain, workers.dev access, disabled preview URLs, HTML handling and compatibility date (`2026-11-10`). The prior deployment had no Worker code or resource bindings; this remains a static website.

To publish future prepared updates, run `node scripts/build.cjs`, then `pnpm dlx wrangler@4.162.0 deploy --keep-vars`. Authenticate through `wrangler login` if required; credentials are not stored in this repository. The production version for this release is `bc36f591-db21-4c05-adc2-a9dc4e3a343d`; the previous version was `bd61412b-1849-4fbc-a0f2-06c619433d61`.

For live verification, run the modern-web verification script against `https://aalopro.com/`. Set `AALOPRO_VERIFY_OUTPUT` to a separate directory to preserve the local verification evidence.

## Landing-page design refresh — 17 November 2026

Applied the founder-requested `landing-page-design` skill. The skill is installed at `~/.codex/skills/landing-page-design/SKILL.md`, and the preference to use it for future website/UI work is recorded in `~/.codex/AGENTS.md`.

`design-system.css` adds locally hosted Manrope, named typography tokens, consistent spacing, flatter product cards, open benefit/quote layouts, and stronger 18px navigation. The approved full-screen hero, yellow branding, supplied logos and original product facts are retained. The homepage adds a learning walkthrough, benefit statement, six concise FAQs and a closing product link. No download or purchase availability is implied: store links are still coming soon and AaloDot remains planned for early 2027.

`script.js` uses IntersectionObserver for the header state, current section, and optional one-time reveals. The mobile menu expands below the header, traps focus within the navigation while open, keeps background content inert, and supports Escape. Reduced-motion and no-JavaScript experiences keep content visible. `404.html` is a branded recovery page; Workers uses `assets.not_found_handling: "404-page"` to retain a proper HTTP 404 response, following https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/.

The scoped visual brief is in `founder/brand.md`; the Manrope font source and checksums are in `asset-manifest.json`. Original artwork and product copy remain in place. Validation evidence and desktop/mobile previews are under `reports/design-refresh-2026-11-17/` (excluded from deployment).

Published to the existing Cloudflare Worker as version `5b79153e-0fa0-4948-a3c9-c5af3a526f99` on 17 November 2026. Previous production version: `e39ca35f-3e7a-47c8-8334-367b5fb3af31`. Validation: 30 page/viewport checks across six pages; keyboard and no-JavaScript checks; dedicated menu, motion and 404 layout checks at 320, 390, 768, 1024 and 1440px.

Footer refinement, 17 November 2026: moved “Built in Singapore for emerging markets.” and its Singapore flag from the homepage hero to the footer. The sentence appears once, with the original wording. Confirmed no horizontal overflow at 320, 390 and 1440px; screenshots are in `reports/footer-origin-2026-11-17/`.

Footer placement follow-up: the Singapore flag and origin sentence now belong to the logo group, directly beneath the AaloPro logo on all homepage breakpoints. The footer columns align at the top across the shared layout. Checks and screenshots are under `reports/footer-logo-2026-11-17/`.

## Foundation colour and header update — 17 November 2026

The Foundation page now has a yellow header, mint hero, teal statement section, peach/green/lavender programme cards, warm peach story section and dark teal footer. Existing Bengali content and photographs are retained. The header email action is replaced by “Back to AaloPro Main Website”, linking to `../index.html`; the contact-section email remains available. Responsive checks at 320, 390, 768, 1024 and 1440px passed, including text contrast (minimum measured 5.11:1), font loading, anchor destinations, keyboard focus and the return link. No-JavaScript navigation and forced-colour checks also passed. Evidence is in `reports/foundation-colour-2026-11-17/`.

Both Foundation updates are published as Cloudflare version `570b7ca9-6271-4660-9a79-f42e463127f5`; the live HTML and stylesheet were verified after deployment.

Headline refinements, 17 November 2026: the AaloApp and AaloDot hero headlines now pair black text with the exact homepage yellow (`#ffca08`), replacing the darker gold accent at the founder’s explicit request. Their banner backgrounds are unchanged. The homepage markets heading uses the full content width so the sentence fits one line on large screens, retaining natural wrapping on smaller screens.

Published headline updates as Cloudflare version `4ad421b9-f798-4f10-8588-f462a11e8df9`. Verified live stylesheet bytes and page version references. Local checks covered all three pages at 320, 390, 1024, 1280 and 1440px, including exact heading colours, no overflow, and the markets sentence on one line from 1024px.

## Additional Cloudflare deployment — 23 November 2026

The full approved website is also published at https://sweet-poetry-0acd.mehedi-f58.workers.dev using the existing Worker `sweet-poetry-0acd` in Mehedi Account. Version: `885c99c5-ad70-472d-80c9-1f679be73f48`. Its separate configuration is `wrangler.sweet-poetry-0acd.jsonc`, preserving the target's compatibility date, observability settings and public workers.dev access. The `aalopro.com` domain remains attached to `red-snow-e6ee`; its deployment was not changed.

To update this additional target, run `node scripts/build.cjs`, then `pnpm dlx wrangler@4.162.0 deploy --config wrangler.sweet-poetry-0acd.jsonc --keep-vars`. Canonical URLs continue to point to `aalopro.com`.

Validation: deployment dry run passed; all 77 public page and asset files matched the local build byte for byte, including both videos. The branded missing-page response returned HTTP 404 and matched the build; configured response headers were present. Evidence: `reports/deploy-sweet-poetry-0acd-2026-11-23/live-checks.json`.

## AaloDot structured data fix — 25 November 2026

Removed the incomplete AaloDot `Product` object and its `WebPage.mainEntity` reference. AaloDot remains in planning with provisional prices and no ordering or preorder offer, so its page retains `Organization`, `WebSite`, `WebPage` and `BreadcrumbList` structured data. No prices, ratings or availability claims were added. The visible page content is unchanged.

Published to the existing `aalopro.com` Worker `red-snow-e6ee` as version `2f094e53-c1d3-4d75-88be-d624f90e59cc`. Only `/aalodot/index.html` changed in the deployment. The source and `dist/` copies match the live page byte for byte.

Validation: the static build and deployment dry run passed; the JSON-LD parses correctly and has no dangling product reference. Google's live Rich Results Test detected two valid items (Breadcrumbs and Organization) and no invalid Product item: https://search.google.com/test/rich-results/result?id=MfV7tzMwPjCgSqf39uW_Mw . Search Console's historical issue report will update after validation or recrawling. The separate `sweet-poetry-0acd` deployment was not updated by this fix.


## Google Play download badge — 25 November 2026

The homepage and AaloApp hero now feature a Google Play badge linking to [https://play.google.com/store/apps/details?id=com.aalopro.bd.aaloapp](https://play.google.com/store/apps/details?id=com.aalopro.bd.aaloapp). The released app is **AaloApp BD Primary**, identified in the accessible link text. The visible edition caption and homepage Meet AaloDot hero button were removed as requested; the Google Play badge is the sole homepage hero action. The AaloApp page keeps its vertically centered pricing link beside the badge. Internal Explore AaloApp links remain available for learning about the other editions.

Removed the stale app-store coming-soon messages and unused launch dialogs, and updated the AaloApp metadata and download FAQ. The supplied badge was edited with the built-in image tool to remove its white background and preserve the logo, wording and black badge. The transparent PNG source is `assets/brand/google-play-badge.png`; its 600 × 200 WebP delivery asset is `assets/responsive/google-play-badge-600.webp`.

Image-edit prompt: Remove the surrounding white square and excessive whitespace; preserve the Google Play triangle, black rounded rectangle, gray border and exact GET IT ON / Google Play wording; use transparent corners and a closely fitted horizontal canvas. Web delivery preserves alpha and aspect ratio.

Modern Web Guidance: native links handle navigation without JavaScript; meaningful image alt text names the app and store; explicit image dimensions reserve layout space. The badge includes hover, active and keyboard-focus states and respects reduced motion.

Validation: the 80-file static build, JavaScript syntax check and Wrangler dry run passed. JSON-LD and local asset references validated on all five updated pages. Desktop and 320/390 px mobile checks confirmed the simplified homepage hero, no horizontal overflow and 24 px clearance above the mobile hero image. The AaloApp badge and pricing link share a vertical center when side by side; they wrap at narrow widths. Keyboard focus, store navigation and mobile-menu Escape behavior were checked.

Published to `aalopro.com` via the existing `red-snow-e6ee` Worker as version `b8625849-9874-4db9-bea8-1f5c4b56f6c1`. All eight uploaded pages/assets were verified byte for byte against `dist/`, and the live homepage was checked visually.
