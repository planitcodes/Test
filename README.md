# Award Desk — landing page

A single self-contained `index.html` for a travel-hacking service: points &
miles, mistake fares, 1:1 consulting, a paid deal room, and done-for-you
booking. No build step, no dependencies. Open the file or drop it on any static
host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

## Before you launch — swap these

| What | Where |
| --- | --- |
| Brand name "Award Desk" / `AWD` | `<title>`, both `.brand` blocks, hero copy |
| Booking URL | `BOOKING_URL` in the script, near the bottom |
| Form endpoint | `FORM_ENDPOINT` in the script (empty = forms validate but don't send) |
| Prices — $249 / $29 / 15% | `#work` section |
| Ledger rows | `#proof` table — replace all six with your own confirmed bookings |
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

## The savings estimator

The model in the `MODEL` object holds retail fare, award taxes, and points cost
per round trip for four cabins. These are conservative long-haul international
averages — tune them to the routes you actually book so the estimate matches
what you can deliver.

## Notes

- Light and dark themes both ship; the page follows the OS setting and the
  nav's **Theme** button overrides it (persisted to `localStorage`).
- Fonts load from Google Fonts. Self-host them if you need the page to work offline.
- Animation is skipped entirely under `prefers-reduced-motion`.
