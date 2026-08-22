# SavvyAviator — landing page

A single self-contained `index.html` for a travel-hacking service: points &
miles, mistake fares, 1:1 consulting, a paid deal room, and done-for-you
booking. No build step, no dependencies. Open the file or drop it on any static
host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

## Before you launch — swap these

| What | Where |
| --- | --- |
| Playbook form | `PLAYBOOK_FORM` in the script (a Google Form asking only for an email) |
| Questionnaire form | `QUALIFIER_FORM` in the script (the six-question Google Form) |
| Booking link | `BOOKING_URL` in the script (your Cal.com link) |
| Prices — $249 / $29 / 15% | `#work` section |
| Domain | `savvyaviator.com` in the teaser CTA band — confirm you own it |
| Testimonials | `#proof` — three slots marked with a dashed `PLACEHOLDER` chip |
| Affiliate disclosure | footer — edit to match your actual arrangements |

## Wiring up the three steps

The booking section is three link-outs, configured at the top of the script:

```js
var PLAYBOOK_FORM  = "https://forms.gle/...";                    // step 01
var QUALIFIER_FORM = "https://docs.google.com/forms/d/e/.../viewform";  // step 02
var BOOKING_URL    = "https://cal.com/your-handle/flight-plan";  // step 03
```

Any left empty renders its button visibly disabled, so nobody is ever sent to a
dead link. Fill them in and the buttons activate on their own.

Why link out rather than post from the page: Google Forms sends no CORS headers,
so an in-page submission fails silently — you would never know a lead vanished.
A new tab always works.

### Carrying the estimator into the questionnaire

Optionally, the estimator's answers can prefill the Google Form so people don't
retype them. In your form, open the three-dot menu → **Get pre-filled link**,
fill in dummy answers, click **Get link**, and read the `entry.NNNNN` ids out of
the URL it produces:

```js
var PREFILL = {
  airport: "entry.1234567890",
  cabin:   "entry.0987654321",
  trips:   "entry.1122334455"
};
```

Leave them empty and the form just opens blank. The questionnaire link rebuilds
itself whenever someone moves an estimator control.

## The ledger

The four rows in `#proof` are real confirmed redemptions:

| Route | Program | Retail | Points | Paid | Value/pt |
| --- | --- | --- | --- | --- | --- |
| JFK → BCN | Alaska → AA | $8,844 | 55,000 | $50.00 | 15.99¢ |
| GVA → JFK | Aeroplan → Swiss | $6,244 | 60,000 | $5.00 | 10.40¢ |
| HND → SFO | AAdvantage → JAL | $4,800 | 60,000 | $45.00 | 7.92¢ |
| DOH → SFO | Qatar Avios → QR | $4,113 | 53,846 | $93.41 | 7.46¢ |

Value per point is `(retail − fees) ÷ points`. The Qatar fee was quoted as
340 QAR and converted at the 3.64 peg; if it was actually 340 USD, that row
becomes `$340.00 paid / $3,773 saved / 7.01¢` and the totals shift with it.

Keep evidence for every retail figure — a screenshot of the cash fare at the
time of booking. The whole page rests on that column.

## The savings estimator

The model in the `MODEL` object holds retail fare, award taxes, and points cost
per round trip for four cabins. It is deliberately more conservative than the
ledger: the ledger shows what a good redemption looks like, the estimator shows
what a client should expect. Raising it to match the ledger would overpromise.

## Notes

- Light and dark themes both ship; the page follows the OS setting and the
  nav's **Theme** button overrides it (persisted to `localStorage`).
- Fonts load from Google Fonts. Self-host them if you need the page to work offline.
- Animation is skipped entirely under `prefers-reduced-motion`.

---

# Teaser one-pager

`teaser.html` is a single-page leave-behind for prospective clients — same
visual identity, condensed to one A4 sheet. `savvyaviator-teaser.pdf` is the
rendered output, ready to attach to an email.

Send it two ways: attach the PDF, or link the page and let them hit
**Save as PDF** themselves.

## Regenerating the PDF

Open `teaser.html` in a browser and use the **Save as PDF** button (bottom
right — screen only, never printed). Set margins to *None*; the page carries
its own. Or headlessly, with Chrome:

```sh
chrome --headless --print-to-pdf=savvyaviator-teaser.pdf \
       --no-pdf-header-footer teaser.html
```

## The QR code

The QR in the call-to-action band encodes your site URL, so a scan lands on
the full page and the reader picks a step from there. It's inline SVG —
no external assets, prints crisp at any size. Regenerate it whenever that URL
changes:

```sh
pip install segno
python3 tools/make-qr.py https://your-real-site-url
```

The script rewrites whatever sits between the `<!--QR-->` markers in
`teaser.html`. Re-export the PDF afterwards.

## Swap before sending

Same list as the landing page — prices and the booking URL — plus the
`savvyaviator.com` display URL in the CTA band. The teaser deliberately carries
**no testimonials**: it goes out before you have any. Add a fourth column of
quotes once the slots on the landing page are filled.

## Design note

The teaser commits to the light ticket-stock palette in both themes, on
purpose — it is a printed object, and a dark-mode variant would waste toner and
look wrong on paper. Only the backdrop behind the sheet follows the viewer's
theme.

---

# The playbook

`playbook.html` is the lead magnet delivered at step 01 — a 16-page field guide
taking a reader from zero points to a first business-class redemption, written
for a US audience. Two exports are built from it:

- `savvyaviator-playbook.pdf` — 16 pages, US Letter, the file you send.
- `savvyaviator-playbook.docx` — upload to Google Drive and it opens as a fully
  editable Google Doc.

## Before you send it

**Read `PLAYBOOK-VERIFY.md` first.** It lists every factual claim the draft makes,
in priority order, with the answer the draft assumes. Card application rules,
transfer ratios and award pricing change constantly — this is material readers
act on with their credit, so none of it should go out unverified.

Then delete the dashed **"Draft"** panel from the cover (search `draft-note` in
`playbook.html`, and near the top of the `.docx`) and re-export.

## Re-exporting the PDF

Open `playbook.html` in a browser and print to PDF with margins set to **None** —
the page carries its own. It is sized in millimetres against a fixed
216 × 279.4mm sheet, so what you see is what prints, and each of the 16 sections
occupies exactly one page.

If you edit the content, check nothing overflows its page: each section's
`.pbody` must not scroll. Content that overruns is silently clipped in print.

## The two documents diverge on purpose

The PDF is the designed artefact — fixed pages, running headers, the ticket-stock
identity. The `.docx` is the *editable* one: semantic headings (so the Google Docs
outline pane works), real tables, real bullet lists, and fonts that exist
everywhere (Arial body, Archivo headings, Courier New for data). It is built for
editing, not for pixel-matching the PDF.

Edit whichever suits the task, but keep them in sync — `PLAYBOOK-VERIFY.md`
assumes changes land in both.
