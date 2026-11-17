const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// Find whatever Chromium this machine has.
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const roots = ['/opt/pw-browsers'];
  for (const r of roots) {
    if (!fs.existsSync(r)) continue;
    for (const d of fs.readdirSync(r).filter(x => x.startsWith('chromium-'))) {
      for (const sub of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
        const c = path.join(r, d, sub);
        if (fs.existsSync(c)) return c;
      }
    }
  }
  return undefined;   // let playwright use its own download
}

(async () => {
  const b = await chromium.launch({ executablePath: chromePath(), args: ['--no-sandbox'] });
  let fails = 0;
  const note = m => { fails++; console.log('  FAIL ' + m); };

  // 1. every web page, both themes, desktop + phone
  const web = ['index', 'teaser', 'privacy', 'terms', 'emails', '404'];
  for (const scheme of ['light', 'dark']) {
    for (const name of web) {
      for (const w of [1440, 390]) {
        const ctx = await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme });
        const p = await ctx.newPage();
        const errs = [];
        p.on('pageerror', e => errs.push(String(e)));
        p.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION|favicon/.test(m.text())) errs.push(m.text()); });
        await p.goto('file://' + ROOT + '/' + name + '.html', { waitUntil: 'networkidle' });
        await p.waitForTimeout(700);
        const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (ov > 0) note(name + ' ' + scheme + ' @' + w + ' overflows ' + ov + 'px');
        if (errs.length) note(name + ' ' + scheme + ' @' + w + ' js: ' + errs[0]);
        await ctx.close();
      }
    }
  }
  console.log('web pages: ' + (web.length * 4) + ' combinations checked');

  // 2. print documents — page count and nothing clipped
  const docs = [
    { file: 'playbook', expect: 16 },
    { file: 'flight-plan-template', expect: 5 },
    { file: 'teaser', expect: 1 },
  ];
  for (const d of docs) {
    const ctx = await b.newContext({ viewport: { width: 1100, height: 1400 } });
    const p = await ctx.newPage();
    await p.goto('file://' + ROOT + '/' + d.file + '.html', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1400);
    const r = await p.evaluate(() => {
      const sel = document.querySelectorAll('.page').length ? '.page' : '.sheet';
      const els = [...document.querySelectorAll(sel)];
      return {
        count: els.length,
        clipped: els.map((pg, i) => {
          const body = pg.querySelector('.pbody') || pg;
          return body.scrollHeight - body.clientHeight > 1 ? i + 1 : null;
        }).filter(Boolean),
      };
    });
    if (r.count !== d.expect) note(d.file + ' has ' + r.count + ' pages, expected ' + d.expect);
    if (r.clipped.length) note(d.file + ' clipped on page(s) ' + r.clipped.join(','));
    await ctx.close();
  }
  console.log('print documents: ' + docs.length + ' checked');

  // 3. the booking buttons must be disabled while the URLs are empty
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  await p.goto('file://' + ROOT + '/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  for (const id of ['playbookBtn', 'qualifierBtn', 'bookBtn']) {
    const v = await p.getAttribute('#' + id, 'aria-disabled');
    if (v !== 'true') note(id + ' is not disabled while its URL is empty');
  }
  // estimator still live
  await p.fill('#apt', 'ord');
  await p.click('button[data-cabin="first"]');
  await p.waitForTimeout(250);
  const saved = await p.textContent('#oSaved');
  if (!/^\$[\d,]+$/.test(saved.trim())) note('estimator output looks wrong: ' + saved);
  console.log('booking buttons disabled, estimator live (' + saved.trim() + ' for 2x first)');
  await b.close();

  // 4. static assets
  const minSize = { 'robots.txt': 60, 'sitemap.xml': 300 };   // text files are legitimately tiny
  for (const f of ['robots.txt', 'sitemap.xml', 'og-image.png', 'savvyaviator-teaser.pdf',
                   'savvyaviator-playbook.pdf', 'savvyaviator-playbook.docx',
                   'flight-plan-template.pdf', 'flight-plan-template.docx']) {
    const s = fs.statSync(ROOT + '/' + f);
    const floor = minSize[f] ?? 5000;
    if (s.size < floor) note(f + ' is suspiciously small (' + s.size + ' bytes)');
  }
  console.log('assets present');

  console.log(fails === 0 ? '\nALL CHECKS PASSED' : '\n' + fails + ' PROBLEM(S)');
})();
