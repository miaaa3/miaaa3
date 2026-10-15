// Renders the profile images from tools/render.html with Playwright.
// Serve ~/PROJECTS on port 8790 (python3 -m http.server 8790), then: node tools/render.cjs <out-dir>
// and convert with cwebp (see README history). Needs the playwright package.
const { chromium } = require('playwright');
const out = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1240, height: 900 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8790/miaaa3-profile/tools/render.html', { waitUntil: 'networkidle' });
  await p.waitForSelector('body[data-ready="1"]'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const ids = await p.evaluate(() => ['hero', 'b-portfolio', 'b-cv', 'b-linkedin', 'exp', 'status', ...[...document.querySelectorAll('.pcard')].map(e => e.id)]);
  for (const id of ids) await p.locator('#' + id).screenshot({ path: `${out}/${id}.png`, omitBackground: true });
  console.log(ids.join(' '));
  await b.close();
})();
