# Playbook — verification checklist

Work through this before the playbook goes out under your name. Every item is a
claim the draft makes that a reader could act on with their credit or their
money. I have written each one as a question with the answer the draft assumes,
so you only need to confirm or correct.

Anything you change here, change in **both** `playbook.html` (source of the PDF)
and `savvyaviator-playbook.docx`.

---

## Priority one — a wrong answer here misleads someone expensively

| # | Claim as drafted | Check |
|---|---|---|
| 1 | **Alaska Mileage Plan can be redeemed on American Airlines flights.** Used in the ledger (JFK→BCN) and in section 06. | This partnership has changed repeatedly. Confirm redemptions on AA metal are still bookable with Mileage Plan today. **If it has ended, the ledger row is still true history — but say "booked in [year]" so nobody tries to replicate it.** |
| 2 | **Chase 5/24**: five or more personal cards in 24 months generally means decline. | Confirm still operative and that the threshold is unchanged. |
| 3 | **Business cards from most issuers do not count toward 5/24, but authorised-user cards do.** | Both halves need checking; the AU treatment in particular has nuance. |
| 4 | **Amex pays a given card's welcome bonus once per lifetime, per person.** | Confirm current language and whether the practical rule still bites the same way. |
| 5 | **US DOT 24-hour free cancellation** applies to most itineraries originating in the US. | Confirm scope — which bookings qualify, and the carrier exemptions. Section 09 rule one depends entirely on this. |
| 6 | **Aeroplan does not pass fuel surcharges on most partners.** This is the explanation for the $5 Geneva–New York fare. | Confirm still true, and for which partners specifically. |

## Priority two — dated or drifting

| # | Claim as drafted | Check |
|---|---|---|
| 7 | The four transferable currencies are **Amex MR, Chase UR, Citi ThankYou, Capital One**. | Confirm all four still run transfer programmes and none has been added or dropped. |
| 8 | **Avios is shared across British Airways, Iberia, Qatar and Aer Lingus**, and can be moved between them. | Confirm combining still works and on what terms. |
| 9 | **Flying Blue runs monthly promotional awards.** | Confirm still running. |
| 10 | Alliance membership lists in section 02 (Star / oneworld / SkyTeam). | Spot-check each carrier is still a member. |
| 11 | **Award inventory opens ~330–360 days out**, and there is a **late release inside the final two weeks**. | Both vary by airline. Consider softening to "typically" if your experience differs. |
| 12 | **Portal redemptions run about 1–1.5¢ per point.** | Confirm current rates for the cards you would actually recommend. |

## Priority three — your own numbers

| # | Item | Check |
|---|---|---|
| 13 | **The Qatar fee.** The draft uses **$93.41**, converting 340 QAR at the 3.64 peg. | If it was actually 340 **USD**, that row becomes $340.00 paid / $3,773 saved / 7.01¢, and the totals change to $23,661 saved. Fix in the ledger, the totals line, and section 06 of the playbook. |
| 14 | **Every retail price in the ledger** — $8,844, $6,244, $4,800, $4,113. | Do you hold evidence of each? A screenshot of the cash fare at the time of booking. The 15.99¢ JFK→BCN row is the one a sceptic will attack first. |
| 15 | **"Two people can earn 228,846 points from three or four welcome bonuses in a year."** | Sanity-check against current bonus sizes. |

## Priority four — tone and liability

| # | Item | Check |
|---|---|---|
| 16 | The **"stop reading if you carry a balance"** framing appears twice. | Keep it. It costs a few sales and buys the credibility that sells the rest. But confirm you are comfortable with the directness. |
| 17 | **Mortgage warning** in section 04. | Confirm you want to keep advising people to pause — it is the right advice and it will occasionally cost you a client. |
| 18 | **The closing disclaimer** on the last page. | Have someone qualified read it if you are collecting fees. It is not a substitute for terms of service. |
| 19 | **Downgrading a card preserves account age and points; closing does not.** | Confirm this holds for the issuers you would recommend. |

---

## After you have verified

1. Delete the dashed **"Draft — delete this box"** panel from the cover — it is in
   `playbook.html` (search `draft-note`) and near the top of the `.docx`.
2. Re-export the PDF: `node` the render script, or open `playbook.html` and print
   to PDF with margins set to None.
3. Put the PDF wherever your playbook Google Form delivers from.
