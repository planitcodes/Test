# SavvyAviator — landing page

A single self-contained `index.html` for a travel-hacking service: points &
miles, mistake fares, 1:1 consulting, a paid deal room, and done-for-you
booking. No build step, no dependencies. Open the file or drop it on any static
host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

## Before you launch — swap these

| What | Where |
| --- | --- |
| Booking URL | `BOOKING_URL` in the script, near the bottom |
| Form endpoint | `FORM_ENDPOINT` in the script (empty = forms validate but don't send) |
| Prices — $249 / $29 / 15% | `#work` section |
| Domain | `savvyaviator.com` in the teaser CTA band — confirm you own it |
| Testimonials | `#proof` — three slots marked with a dashed `PLACEHOLDER` chip |
| Affiliate disclosure | footer — edit to match your actual arrangements |

## Wiring up the forms

`FORM_ENDPOINT` takes any URL that accepts a JSON `POST`. Formspree, Netlify
Forms, Basin, or your own handler all work:

```js
var FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
```

Two payload shapes are sent:

```jsonc
{ "type": "lead",      "email": "..." }                 // step 01
{ "type": "qualifier", "data": { "name": "...", ... } } // step 02
```

Leave it empty and the forms still validate, still advance, and still build the
prefilled booking link — nothing is transmitted.

## The booking prefill

On submitting step 02, the qualifier answers are appended to `BOOKING_URL` as
`name`, `email`, and `a1` — the parameter names Calendly uses for prefill. Cal.com
uses the same convention. If your scheduler differs, edit the `url` builder in
the qualifier submit handler.

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

The QR in the call-to-action band encodes the booking URL. It's inline SVG —
no external assets, prints crisp at any size. Regenerate it whenever that URL
changes:

```sh
pip install segno
python3 tools/make-qr.py https://your-real-booking-url
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
