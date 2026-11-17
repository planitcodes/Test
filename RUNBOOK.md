# SavvyAviator — runbook

How to launch this, and how to run it once it is live. Everything referenced
here exists in this repo.

---

## Part 1 — Launch checklist

Nothing below needs me. Roughly an afternoon, plus one weekend for the playbook.

### Before anything else

- [ ] **Buy `savvyaviator.com`.** Last checked it had no nameservers, which usually
      means available — confirm at a registrar. ~$12/yr. Everything downstream
      depends on it.
- [ ] Create a repo named `savvyaviator`. Push this branch as `main`.
      The repo name becomes your URL if you ever go without a custom domain.
- [ ] **Settings → Pages → Source → GitHub Actions.** The workflow is written.
- [ ] Add a `CNAME` file containing just `savvyaviator.com`, point DNS at GitHub.

### Wire up the three steps

- [ ] Google Form **A** — one question, their email. This is the playbook form.
- [ ] Google Form **B** — the six questions: name, email, home airport, where
      they want to go, when, points held today, plus a free-text note field.
- [ ] Cal.com — a 75-minute event called *Flight Plan*. Connect your calendar.
- [ ] Stripe on that Cal.com event so it charges at booking. **Without this you
      cannot take money.**
- [ ] Paste the three URLs into the top of the script in `index.html`
      (`PLAYBOOK_FORM`, `QUALIFIER_FORM`, `BOOKING_URL`). Until then the three
      buttons render disabled on purpose.
- [ ] Optional: from Form B's three-dot menu → *Get pre-filled link* → read the
      `entry.NNNNN` ids into `PREFILL` so the estimator carries answers over.
- [ ] Set Form A's confirmation message to link
      `https://savvyaviator.com/d/savvyaviator-playbook.pdf`.

### Make the documents real

- [ ] Work through `PLAYBOOK-VERIFY.md`. 19 claims, priority ordered. **Start with
      Alaska → American**, which the JFK→BCN ledger row depends on.
- [ ] Delete the draft box on the playbook cover, re-export the PDF.
- [ ] Fill the bracketed fields in `privacy.html` and `terms.html` — entity name,
      state, dates, retention period, the fee line. Delete both draft boxes.
- [ ] Decide whether to cap the Booked For You fee. If yes, say so in `terms.html`
      and in email 07.

### Before you tell anyone

- [ ] Open the live site on a phone.
- [ ] Submit both forms yourself. Confirm the responses land in the Sheet.
- [ ] Book your own call, with a real card, and refund it. Confirm Stripe works
      end to end before a stranger tries it.
- [ ] Run the URL through `opengraph.xyz` to force a social re-scrape. The big
      platforms cache the first result they see.

---

## Part 2 — The client journey

Each step names the artifact that does the work.

| Stage | What they get | From |
| --- | --- | --- |
| Finds you | Landing page, or the teaser as a PDF | `index.html`, `savvyaviator-teaser.pdf` |
| Curious | The savings estimator | `#estimator` |
| First yes | The playbook | `savvyaviator-playbook.pdf` + email 01 |
| Day 3, no booking | A nudge pointing at section 06 | Email 02 |
| Books a call | Confirmation and a prep list | Email 03 |
| On the call | You fill the plan live | `flight-plan-template.docx` |
| Within 24h | The plan and the recording | Email 04 |
| Day 14 | Check-in on action one | Email 05 |
| Trip ticketed | The testimonial ask | Email 06 |
| Not a fit | An honest no | Email 08 |

Booked For You has its own front door: **email 07 before any searching**, which
fixes the benchmark fare in writing. Your terms require it. Do not skip it, and
attach the screenshot.

---

## Part 3 — Operating rhythm

**Daily, five minutes.** Check the Form B responses. Anyone who filled it out and
did not book is worth one reply.

**Before each call, fifteen minutes.** Read their questionnaire. Pre-search their
route so you arrive with one concrete option. This is the difference between
advice and a conversation.

**Within 24 hours of a call.** Send the plan. Not three days later — the value
decays fast and so does their memory of why it was worth paying for.

**Weekly.** Anyone at day 14 gets email 05. Anyone who said they were booking and
went quiet gets a one-line nudge.

**Monthly.** Check your own upcoming reservations for schedule changes. It is the
free upgrade lever you tell clients about, so use it.

---

## Part 4 — Decisions already made, and when to revisit

**The founding rate retires at ten clients.** Not "when it feels right". Delete
the `<s class="was">$300</s>` and the `.flag` paragraph in `#work`. If you let
this drift you will be at $150 in two years.

**Testimonials go back when you have two or three.** Markup is in git history:
`git show 079e18c:index.html | grep -A 20 'class="quotes"'`. Ask at booking, not
at payment — email 06 is written for that moment.

**The estimator runs conservative on purpose.** Your ledger averages 10.4¢ per
point; the calculator promises far less. That gap is deliberate: the ledger shows
what is achievable, the estimator shows what to expect. Raising it to match sets
up refund conversations.

**The Flight Deck needs a room before you sell it.** Discord is free and an hour's
work. It also needs recurring billing, which is a different Stripe setup from the
one-off call charge. Do not take a subscription you cannot deliver against.

---

## Part 5 — What goes stale

| Thing | When |
| --- | --- |
| Ledger caption "two already flown, two ticketed" | After **19 Dec 2026** it is three and one |
| The ledger itself | Add rows as you fly. It is the most persuasive thing on the site |
| Playbook claims | Card rules and award charts move constantly — re-verify yearly against `PLAYBOOK-VERIFY.md` |
| `sitemap.xml` `<lastmod>` | When a page changes materially |
| Teaser QR | Regenerate if the domain changes: `python3 tools/make-qr.py https://newdomain/#book` |
| Legal "last updated" | Whenever you touch either page |

**Do not print the teaser until the three URLs are live.** The QR points at
`/#book`, and those buttons are disabled while the URLs are empty. Paper does not
update.

---

## Part 6 — Things to never do

- **Never write your own testimonials.** FTC civil penalties per violation, and
  this site's entire claim rests on a ledger someone could verify. Invented quotes
  next to verifiable numbers poison the numbers.
- **Never let a client transfer points before a seat is confirmed.** One-way,
  irreversible, and the most expensive mistake available to someone who did
  everything else right.
- **Never recommend a card because the commission is good.** The moment your
  income depends on the application, the FAQ promising you will tell people to
  stop becomes a lie, and that is the whole brand.
- **Never quote a saving you cannot evidence.** Screenshot the cash fare at the
  time, every time.
