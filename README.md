# SavvyAviator

A points-and-miles consulting business in a repo: the site, the collateral, the
client documents, and the process to run it.

**New here? Read [`RUNBOOK.md`](RUNBOOK.md).** It has the launch checklist, the
client journey, and the operating rhythm. This file is the technical reference
for the files themselves.

## What's in here

| File | What it is |
| --- | --- |
| `index.html` | The full landing page — estimator, ledger, tiers, three-step booking |
| `early.html` | The early-access page — one promise, one email capture |
| `teaser.html` → `savvyaviator-teaser.pdf` / `.png` | One-page leave-behind to send or print |
| `playbook.html` → `savvyaviator-playbook.pdf` / `.docx` | The 16-page lead magnet |
| `flight-plan-template.html` → `.pdf` / `.docx` | What you fill in on a call and hand over |
| `emails.html` | Eight client emails with copy buttons. Internal |
| `privacy.html`, `terms.html` | Legal pages. Drafts until the brackets are filled |
| `404.html`, `robots.txt`, `sitemap.xml`, `og-image.png` | Site furniture |
| `PLAYBOOK-VERIFY.md` | 19 claims to check before the playbook goes out |
| `RUNBOOK.md` | How to launch and operate |
| `tools/`, `scripts/` | QR generator, OG image source |

Everything is static HTML. No build step, no dependencies — open any `.html`
directly in a browser.


A single self-contained `index.html` for a travel-hacking service: points &
miles, mistake fares, 1:1 consulting, a paid deal room, and done-for-you
booking. No build step, no dependencies. Open the file or drop it on any static
host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

## The landing page

### Before you launch — swap these

| What | Where |
| --- | --- |
| Playbook form | `PLAYBOOK_FORM` in the script (a Google Form asking only for an email) |
| Questionnaire form | `QUALIFIER_FORM` in the script (the six-question Google Form) |
| Booking link | `BOOKING_URL` in the script (your Cal.com link) |
| Prices — $249 / $29 / 15% | `#work` section |
| Domain | `savvyaviator.com` — in the teaser CTA band, and in the four absolute URLs in `index.html`'s social tags |
| Legal pages | `privacy.html` and `terms.html` — fill the remaining bracketed fields, delete both draft boxes |
| Affiliate disclosure | footer — edit to match your actual arrangements |

### Wiring up the three steps

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

### The ledger

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

### The savings estimator

The model in the `MODEL` object holds retail fare, award taxes, and points cost
per round trip for four cabins. It is deliberately more conservative than the
ledger: the ledger shows what a good redemption looks like, the estimator shows
what a client should expect. Raising it to match the ledger would overpromise.

### Notes

- Light and dark themes both ship; the page follows the OS setting and the
  nav's **Theme** button overrides it (persisted to `localStorage`).
- Fonts load from Google Fonts. Self-host them if you need the page to work offline.
- Animation is skipped entirely under `prefers-reduced-motion`.

## Teaser one-pager

`teaser.html` is a single-page leave-behind for prospective clients — same
visual identity, condensed to one A4 sheet. `savvyaviator-teaser.pdf` is the
rendered output, ready to attach to an email.

Send it two ways: attach the PDF, or link the page and let them hit
**Save as PDF** themselves.

### Regenerating the PDF

Open `teaser.html` in a browser and use the **Save as PDF** button (bottom
right — screen only, never printed). Set margins to *None*; the page carries
its own. Or headlessly, with Chrome:

```sh
chrome --headless --print-to-pdf=savvyaviator-teaser.pdf \
       --no-pdf-header-footer teaser.html
```

### The QR code

The QR in the call-to-action band encodes `/#book`, so a scan lands directly
on the three steps rather than the top of the page — the caption says "scan to
book", and it should be true. The reader can still scroll up for the proof and
the FAQ. It's inline SVG —
no external assets, prints crisp at any size. Regenerate it whenever that URL
changes:

```sh
pip install segno
python3 tools/make-qr.py https://your-real-site-url
```

The script rewrites whatever sits between the `<!--QR-->` markers in
`teaser.html`. Re-export the PDF afterwards.

### Swap before sending

Same list as the landing page — prices and the booking URL — plus the
`savvyaviator.com` display URL in the CTA band. The teaser deliberately carries
**no testimonials**: it goes out before you have any. Add a fourth column of
quotes once the slots on the landing page are filled.

### Design note

The teaser commits to the light ticket-stock palette in both themes, on
purpose — it is a printed object, and a dark-mode variant would waste toner and
look wrong on paper. Only the backdrop behind the sheet follows the viewer's
theme.

## The playbook

`playbook.html` is the lead magnet delivered at step 01 — a 16-page field guide
taking a reader from zero points to a first business-class redemption, written
for a US audience. Two exports are built from it:

- `savvyaviator-playbook.pdf` — 16 pages, US Letter, the file you send.
- `savvyaviator-playbook.docx` — upload to Google Drive and it opens as a fully
  editable Google Doc.

### Before you send it

**Read `PLAYBOOK-VERIFY.md` first.** It lists every factual claim the draft makes,
in priority order, with the answer the draft assumes. Card application rules,
transfer ratios and award pricing change constantly — this is material readers
act on with their credit, so none of it should go out unverified.

Then delete the dashed **"Draft"** panel from the cover (search `draft-note` in
`playbook.html`, and near the top of the `.docx`) and re-export.

### Re-exporting the PDF

Open `playbook.html` in a browser and print to PDF with margins set to **None** —
the page carries its own. It is sized in millimetres against a fixed
216 × 279.4mm sheet, so what you see is what prints, and each of the 16 sections
occupies exactly one page.

If you edit the content, check nothing overflows its page: each section's
`.pbody` must not scroll. Content that overruns is silently clipped in print.

### The two documents diverge on purpose

The PDF is the designed artefact — fixed pages, running headers, the ticket-stock
identity. The `.docx` is the *editable* one: semantic headings (so the Google Docs
outline pane works), real tables, real bullet lists, and fonts that exist
everywhere (Arial body, Archivo headings, Courier New for data). It is built for
editing, not for pixel-matching the PDF.

Edit whichever suits the task, but keep them in sync — `PLAYBOOK-VERIFY.md`
assumes changes land in both.


## Deploying

`.github/workflows/pages.yml` publishes to GitHub Pages on every push to `main`.
Enable it once: **Settings → Pages → Source → "GitHub Actions"**.

It does not publish the whole repo. Only these go public:

```
index.html  teaser.html  privacy.html  terms.html
og-image.png  savvyaviator-teaser.pdf
d/savvyaviator-playbook.pdf
```

Everything else — `playbook.html`, the `.docx`, this README, the verification
checklist — stays private in the repo.

The playbook PDF is served from `/d/` rather than linked from the site, so you can
point your Google Form's confirmation message at
`https://yourdomain/d/savvyaviator-playbook.pdf`. That is light gating: anyone with
the link can read it, but nobody finds it by browsing. Good enough for a lead
magnet; if you want it properly gated, deliver it from your email platform instead
and drop that line from the workflow.

### A custom domain

Add a `CNAME` file at the repo root containing just the domain, point the DNS at
GitHub, and set it under Settings → Pages. Without one you get
`<username>.github.io/<repo>` — which is why the repo name matters.

### Social previews

`og-image.png` is 1200×630 and regenerates from `scripts/og.html` if you want to
change it. The Open Graph tags in `index.html` use **absolute** URLs because most
scrapers will not resolve relative ones — if your domain is not
`savvyaviator.com`, change it in all four places or shares show no image.

After deploying, test a share with Facebook's Sharing Debugger or
`opengraph.xyz`; both force a re-scrape, which matters because the big platforms
cache the first result they see.

`savvyaviator-teaser.png` is the teaser as an image, for pasting into a message,
a slide or a social post where a PDF will not embed. Regenerate it by
screenshotting the `.sheet` element at `deviceScaleFactor: 2`.


## The Flight Plan template

What you fill in during or right after a Tier 01 call, and hand to the client.
It is the thing that makes the fee feel fair — without it the call is a nice
chat they forget in a week.

- `flight-plan-template.docx` — the working copy. Upload to Drive, then
  **make a copy per client** and type into it. Tab moves between fields.
- `flight-plan-template.pdf` — 5 pages, US Letter, for printing and filling by
  hand, or for seeing the designed version.
- `flight-plan-template.html` — source of the PDF.

### Nine sections

`01` the trip · `★` the short version · `02` balances · `03` cards and credit ·
`04` target redemption · `05` application order · `06` minimum spend ·
`07` finding the seat · `08` risks · `09` next three actions

Two things in there are load-bearing. **The short version** on page 1 is an
executive summary you fill in last — most clients read that box and skim the
rest, so it should be the answer rather than a list of headings. And **section
09 caps at three actions**: more than three and none of them happen.

The italic prompts under each heading are notes to you, not the client. Delete
them as you fill, along with the dashed box on page 1.

### Keeping it in sync

The `.docx` and the `.html` are built separately — change one and you must
change the other. The docx is generated by a script kept out of the repo; if you
restructure the template, the `.html` is the easier one to edit by hand.


## Testimonials

There is no testimonial section, on purpose. A block of empty placeholder cards
advertises that you have no clients; the ledger is stronger proof than three
dashed outlines. It comes back when you have real quotes — the markup is in git
history if you want it back verbatim:

```sh
git show 079e18c:index.html | grep -A 20 'class="quotes"'
```

Two or three real ones is the threshold worth republishing for. Ask when the
trip is **booked**, not when they pay — that is when the number feels real and
the words come out unprompted. Specific questions produce usable quotes:
*what did you think this would cost before we spoke?* and *what had you been
getting wrong?* Asking "how was it?" produces "great service, highly
recommend", which persuades nobody.

**Never write these yourself.** Beyond being dishonest, fabricated reviews carry
FTC civil penalties per violation, and this site's whole claim rests on a ledger
someone could verify. Invented quotes next to verifiable numbers poisons the
numbers.


## Contact address

`savvyaviator.travels@gmail.com` appears in the landing page footer, both legal
pages, the playbook's closing section, and the Flight Plan template footer. To
change it, search for it across `*.html` — and remember the two `.docx` files
carry their own copy, so they need rebuilding or patching separately.

If you later own the domain, point `hello@savvyaviator.com` at this inbox as a
forwarder and set Gmail to **send as** that address. Free, nothing to migrate,
and it looks like a business.


## The email kit

`emails.html` holds the eight client emails — delivery, nudge, booking
confirmation, plan delivery, check-in, testimonial request, the Booked For You
scope agreement, and turning someone away. Each has a copy button and a note on
why it is worded that way.

It is `noindex` and excluded from the deploy. Open it locally when you need to
send something.

Two of them are load-bearing rather than convenient. **07** is the written
agreement `terms.html` requires, and it fixes the benchmark fare *before* any
searching starts — afterwards every client remembers a lower number. **08** is
what makes the FAQ's promise true: the page says you will tell people not to buy,
so there has to be something to send when that is the honest answer.


## Checking your work

`scripts/check.js` runs the whole suite: every page in both themes at desktop and
phone width looking for horizontal overflow and JavaScript errors, every print
document for page count and clipped content, the booking buttons' disabled state,
the estimator, and the presence of every built asset.

```sh
npm i playwright-core
node scripts/check.js
```

Run it after any edit. The failures it catches are the ones that are invisible
until someone opens the page on a phone — a long unbreakable string pushing the
layout sideways, or a document quietly clipping its last paragraph in print. Both
have happened in this repo.


## The early-access page

`early.html` is a shorter front door for before you can take money: hero, the
GVA–JFK coupon, a four-number proof strip, three steps, one closing capture.
No pricing, no tiers, no FAQ, no booking flow — it has exactly one job, which is
getting an email address.

Structurally it mirrors a Framer early-access page the owner liked (hero with a
single CTA, a visual anchor, three numbered steps, a closing CTA) while keeping
this project's own identity rather than that page's monochrome Inter.

### Wiring it

One constant at the top of its script:

```js
var EARLY_ACCESS_FORM = "https://forms.gle/...";   // a Google Form asking for an email, nothing else
```

Empty, both buttons render visibly disabled — so the page is safe to share before
the form exists. This can be the same form as `PLAYBOOK_FORM` on the main page;
the copy promises the playbook in return either way.

### Making it the homepage

Uncomment the marked line in `.github/workflows/pages.yml`. The early-access page
is then served at `/` and the full page stays reachable at `/index-full.html`.
Reverse it on launch day by re-commenting that line.

Both pages carry the same Open Graph tags and point at the same `og-image.png`,
so a shared link previews identically whichever is live.
