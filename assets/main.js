// ===== load a partial and (optionally) mark active nav link
const ACTIVE_CLASS = 'active';   // change to 'current' if you like

async function inject(selector, url, { markActive = false } = {}) {
  const host = document.querySelector(selector);
  if (!host) return;

  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  host.innerHTML = await res.text();

  if (markActive) {
    const herePath = new URL(location.href).pathname
      .replace(/\/index\.html?$/, '/')
      .replace(/\/$/, '/');

    host.querySelectorAll('a[href]').forEach(a => {
      const targetPath = new URL(a.getAttribute('href'), location.href).pathname
        .replace(/\/index\.html?$/, '/')
        .replace(/\/$/, '/');
      if (targetPath === herePath) a.classList.add(ACTIVE_CLASS);
    });
  }
}

// ===== inline years under titles on mobile
function wireInlineYears(){
  document.querySelectorAll('.line').forEach(line => {
    const yearsBox = line.querySelector('.years');
    const yTextEl = yearsBox ? (yearsBox.querySelector('.y') || yearsBox) : null;
    const txt = yTextEl ? yTextEl.textContent.trim() : '';
    if (!txt) return;
    const inlineHolder = line.querySelector('.content .role .when, .content .place .when, .content .when');
    if (inlineHolder) inlineHolder.textContent = txt;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // use relative paths so it works locally and in prod
  await inject('#site-nav', 'components/nav.html', { markActive: true });
  await inject('#site-foot', 'components/footer.html');
  wireInlineYears();
});
