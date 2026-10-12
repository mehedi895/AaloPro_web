# AaloPro website

A responsive, editable implementation of the supplied AaloPro website design, using the approved charcoal and yellow device render and the supplied official logo artwork.

## Open the website

Extract the entire folder, then open `index.html` in a modern browser. Keep `index.html`, `styles.css`, `script.js`, and `assets` together. No installation, build command, account, internet connection, framework, or remote font service is required.

For development, a local static server is optional. From this folder, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Upload this folder's contents to the web root of your hosting service to publish it. This package has not been deployed to aalopro.com.

## Files

`index.html` contains all editable headings, descriptions, prices, navigation, product cards, and contact links. The website is real HTML, not a full page image.

`styles.css` contains the page styling and responsive layouts. The brand variables are at the top. The supplied black logo remains black, and the approved charcoal and yellow device artwork has not been recolored.

`script.js` provides the mobile navigation toggle, Escape key handling, and active section highlighting. Content and email actions remain available without JavaScript.

`assets` contains all image assets in SVG format, including the logo, device artwork, student imagery, favicon, Singapore flag, and UI icons. All resources are local.

`asset-manifest.json` records which SVG files contain vector paths and which contain embedded photographic artwork.

`quality-checks.json` records the responsive rendering and mobile menu checks performed for this delivery.

## SVG format and image quality

The supplied official logos were traced into genuine black SVG vector paths. The icons and small flag are also genuine vector artwork.

The student artwork and device renders preserve photographic detail by embedding JPEG image data inside self-contained SVG files. Their surrounding crop masks are vector paths. These assets have the `.svg` extension and need no separate PNG or JPEG files, but the photographic content is not path-only vector artwork. Converting photographic imagery into thousands of colored vector shapes would alter its appearance and produce significantly larger files.

The two-device product render is also included as `assets/device-pair.svg` for future use. The stacked official logo is included as `assets/logo-stacked.svg`.

Student images were extracted from the supplied website mockup. Their detail is limited by that source image; embedding them in SVG does not create additional photographic resolution. The device artwork uses the separately supplied, larger render. Replace student image contents with higher resolution original artwork when available, retaining the same asset filenames and viewBox proportions.

The people shown are illustrative artwork from the supplied mockup, not documentary photographs of pilot participants.

## Prices included

AaloApp Primary: US$1 per month.

AaloApp Secondary: US$2 per month.

AaloPro Primary: US$29 for the device.

AaloPro Secondary: US$49 for the device.

Device prices are presented separately from app subscriptions. The page does not claim that an app subscription is included with a device purchase.

## Buttons and functionality

Navigation and pricing buttons scroll to the corresponding sections. The mobile menu opens and closes, supports the Escape key, and closes after a section is selected.

The demo, early access, contact, and product buttons open the user's email application with an enquiry addressed to `help@aalopro.com`. The subject identifies the product or request. The button labels “Order Now” match the supplied mockup, but these are email enquiries, not a payment checkout or confirmed order flow. There is no connected payment processor, app signup service, lead database, or form backend.

The phone shown in the hero is an illustrative HTML app screen, not a working tutor interface.

No unverified social account links were invented. No analytics, advertising scripts, external dependencies, or tracking cookies are included.

## Before public launch

Confirm that `help@aalopro.com` is the correct receiving mailbox and that all commercial enquiry buttons use the workflow you intend.

Verify the early progress figures reproduced from the approved design: 200+ parents interviewed, 50+ teachers interviewed, 200 families interested in testing, and a planned 5,000 student pilot. These are supplied marketing copy, not independently verified results. The pilot is clearly marked as planned rather than completed.

Confirm current product availability, curriculum coverage, device compatibility, and the commercial relationship between device pricing and app subscriptions. Add your own terms, privacy information, checkout or signup links, and any necessary launch disclosures before accepting payments or collecting personal data.

## Accessibility and responsive behavior

The page includes semantic headings, labeled navigation, image descriptions, keyboard focus states, a skip link, reduced motion support, and responsive layouts. It does not claim a formal accessibility certification.

The layout was rendered and inspected in Chromium at viewport widths of 1440, 1024, 768, 390, and 320 pixels. All 57 image instances loaded, no JavaScript errors were reported, and no document-level horizontal overflow was detected at those widths. Mobile menu opening and closing were checked at 768, 390, and 320 pixels. These are desktop-browser responsive checks, not tests on every physical device or browser.
