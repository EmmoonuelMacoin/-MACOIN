(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const config = window.MACOIN_CONFIG || {};
  const scrollLocks = new Set();
  let previousOverflow = '';
  let toastTimer;

  function createIcon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `icons.svg#${name}`);
    svg.append(use);
    return svg;
  }

  function lockScroll(reason) {
    if (!scrollLocks.size) previousOverflow = document.body.style.overflow;
    scrollLocks.add(reason);
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll(reason) {
    scrollLocks.delete(reason);
    if (!scrollLocks.size) document.body.style.overflow = previousOverflow;
  }

  function toast(message) {
    const element = $('toast');
    if (!element) return;
    clearTimeout(toastTimer);
    element.textContent = message;
    element.hidden = false;
    element.classList.add('is-visible');
    toastTimer = setTimeout(() => {
      element.classList.remove('is-visible');
      element.hidden = true;
    }, 4000);
  }

  function setupCountdown() {
    const count = $('countdown');
    const unit = $('countdown-unit');
    if (!count || !unit) return;
    const launch = /^\d{4}-\d{2}-\d{2}$/.test(config.launchDate || '')
      ? config.launchDate : '2026-10-17';
    const target = Date.parse(`${launch}T00:00:00Z`);
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
    });
    function update() {
      const parts = Object.fromEntries(formatter.formatToParts(new Date()).map(({ type, value }) => [type, value]));
      const today = Date.parse(`${parts.year}-${parts.month}-${parts.day}T00:00:00Z`);
      const remaining = Math.round((target - today) / 86400000);
      count.textContent = String(Math.max(0, remaining)).padStart(2, '0');
      unit.textContent = remaining > 0
        ? `${remaining === 1 ? 'DAY' : 'DAYS'} UNTIL ZE LAUNCH`
        : remaining === 0
          ? 'Ze announced day is here. Official details to follow.'
          : 'Ze announced date has passed. Check ze official updates.';
      count.setAttribute('aria-label', remaining > 0
        ? `${remaining} ${remaining === 1 ? 'day' : 'days'} until ze announced launch on 17 October 2026`
        : 'Ze announced launch date, 17 October 2026, has arrived');
    }
    update();
    setInterval(update, 60000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) update();
    });
  }

  const memes = [
    { number: '02', file: '02-dissolve.png', title: 'New problem. Same red button.', alt: 'Emmoonuel Macoin stands beside a large button marked Dissolve.' },
    { number: '04', file: '04-sunglasses.png', title: 'I hear you. Ze glasses do not.', alt: 'The absurdly long-headed president sips espresso while ordinary human protesters demonstrate behind him.' },
    { number: '12', file: '12-moon.png', title: 'Ze debt has entered orbit.', alt: 'Macoin rides a blue, white and red rocket towards the Moon.' },
    { number: '01', file: '01-fired.png', title: 'Ze chart is red. Ze ministre is fired.', alt: 'A fictional prime minister leaves the palace carrying an office box.' },
    { number: '03', file: '03-queue.png', title: 'Please bring your own box.', alt: 'Fictional candidates queue outside the prime minister’s office.' },
    { number: '05', file: '05-tax.png', title: 'Ze tax is ze culture.', alt: 'The caricatured president demands tax from a worried farmer with normal human features.' },
    { number: '06', file: '06-zero-tax.png', title: 'Leadership is very exhausting.', alt: 'The fictional president relaxes on a sun lounger.' },
    { number: '07', file: '07-debt.png', title: 'Another historic high. Foshur.', alt: 'Macoin plants a flag on top of a mountain of debt.' },
    { number: '08', file: '08-en-meme-temps.png', title: 'Both directions. En même temps.', alt: 'Macoin points in two opposite directions at the same time.' },
    { number: '10', file: '10-red-chart.png', title: 'Exactly as planned. Almost.', alt: 'Macoin looks at a red trading chart with a drop of sweat.' },
  ];

  function setupMemes() {
    const grid = $('meme-grid');
    const more = $('more-memes');
    const dialog = $('meme-dialog');
    if (!grid) return;
    let expanded = false;
    let opener = null;

    function openMeme(meme, button) {
      if (!dialog || typeof dialog.showModal !== 'function') return;
      const image = $('dialog-image');
      const title = $('dialog-title');
      const download = $('download-meme');
      if (!image || !title || !download) return;
      opener = button;
      image.src = `memes/${meme.file}`;
      image.alt = meme.alt;
      title.textContent = meme.title;
      download.href = `memes/${meme.file}`;
      download.download = `MACOIN-${meme.file}`;
      dialog.showModal();
      lockScroll('meme');
      $('close-dialog')?.focus();
    }

    function render() {
      const fragment = document.createDocumentFragment();
      for (const meme of expanded ? memes : memes.slice(0, 3)) {
        const card = document.createElement('figure');
        card.className = 'meme-card';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'meme-open';
        button.setAttribute('aria-label', `Enlarge: ${meme.title}`);
        const image = document.createElement('img');
        image.src = `memes/${meme.file}`;
        image.alt = meme.alt;
        image.width = 900;
        image.height = 900;
        image.loading = 'lazy';
        image.decoding = 'async';
        const icon = document.createElement('span');
        icon.className = 'meme-expand';
        icon.append(createIcon('arrow-up-right'));
        icon.setAttribute('aria-hidden', 'true');
        button.append(image, icon);
        button.addEventListener('click', () => openMeme(meme, button));
        const caption = document.createElement('figcaption');
        const title = document.createElement('span');
        title.className = 'meme-title';
        title.textContent = meme.title;
        const label = document.createElement('span');
        label.className = 'meme-number';
        label.textContent = `ARCHIVE ${meme.number}`;
        caption.append(title, label);
        card.append(button, caption);
        fragment.append(card);
      }
      grid.replaceChildren(fragment);
      if (more) {
        more.setAttribute('aria-expanded', String(expanded));
        more.replaceChildren(document.createTextNode(expanded ? 'Close ze archives ' : 'All ze archives (10) '), createIcon(expanded ? 'minus' : 'plus'));
      }
    }

    more?.addEventListener('click', () => {
      expanded = !expanded;
      render();
      if (expanded) {
        more.focus({ preventScroll: true });
      } else {
        const heading = $('memes-title');
        heading?.setAttribute('tabindex', '-1');
        heading?.focus({ preventScroll: true });
        $('memes')?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
    $('close-dialog')?.addEventListener('click', () => dialog?.close());
    dialog?.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog?.addEventListener('close', () => {
      unlockScroll('meme');
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    render();
  }

  function setupPresident() {
    const button = $('mascot-button');
    const quote = $('president-quote');
    if (!button || !quote) return;
    const initial = quote.textContent;
    const jokes = [
      'I hear ze people. Zen I do what I already decided.',
      'I choose left. En même temps, I choose right.',
      'Zis is not a crisis. Zis is a four-hour speech.',
      'Everything is under control. Whose control? Next question.',
      'Ze people want answers. I have new sunglasses. Foshur.',
    ];
    let index = 0;
    let timer;
    quote.setAttribute('role', 'status');
    button.addEventListener('click', () => {
      clearTimeout(timer);
      quote.textContent = jokes[index++ % jokes.length];
      button.classList.remove('poked');
      void button.offsetWidth;
      button.classList.add('poked');
      timer = setTimeout(() => {
        quote.textContent = initial;
        button.classList.remove('poked');
      }, 3500);
    });
  }

  function setupMinister() {
    const button = $('fire-minister');
    const count = $('minister-count');
    const news = $('minister-news');
    const overlay = $('dissolution');
    const resume = $('resume-game');
    if (!button || !count || !news) return;
    const ministers = ['Monsieur Baguette', 'Madame Croissant', 'Jean-Pierre Fromage', 'Gérard Escargot', 'Sophie Ratatouille', 'Bernard Béret', 'Chantal Crêpe', 'Didier Pétanque', 'Hélène Camembert', 'Thierry Brioche'];
    let fired = 0;
    let current = 0;
    count.textContent = '00';
    news.setAttribute('role', 'status');

    function closeDissolution() {
      if (!overlay || overlay.hidden) return;
      overlay.hidden = true;
      button.disabled = false;
      button.focus({ preventScroll: true });
    }

    button.addEventListener('click', () => {
      if (overlay && !overlay.hidden) return;
      const old = ministers[current];
      current = (current + 1 + Math.floor(Math.random() * (ministers.length - 1))) % ministers.length;
      fired += 1;
      count.textContent = String(fired).padStart(2, '0');
      const next = ministers[current];
      const statements = [
        `${old} lasted 11 minutes. ${next}, please do not unpack.`,
        `${old} asked for a budget. ${next} will not make zis mistake.`,
        `${old} is out. ${next} is in. Ze chart is still red.`,
        `${next} is appointed. Ze notice period starts now. En même temps.`,
      ];
      news.textContent = statements[(fired - 1) % statements.length];
      if (fired % 5 === 0 && overlay && resume) {
        overlay.hidden = false;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'false');
        if (!overlay.hasAttribute('aria-label') && !overlay.hasAttribute('aria-labelledby')) overlay.setAttribute('aria-label', 'Ze assembly is dissolved');
        button.disabled = true;
        resume.focus();
      }
    });
    resume?.addEventListener('click', closeDissolution);
    overlay?.addEventListener('keydown', (event) => {
      if (!overlay || overlay.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDissolution();
      }
    });
  }

  function setupOfficialInformation() {
    const address = typeof config.contractAddress === 'string' ? config.contractAddress.trim() : '';
    const validAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    const field = $('contract-address');
    const copy = $('copy-contract');
    if (field) field.textContent = validAddress ? address : 'CA coming at launch, mes amis';
    if (copy) {
      copy.disabled = !validAddress;
      copy.textContent = validAddress ? 'COPY CA' : 'COMING SOON';
      if (validAddress) copy.append(createIcon('arrow-up-right'));
      copy.setAttribute('aria-disabled', String(!validAddress));
      copy.addEventListener('click', async () => {
        if (!validAddress) return;
        try {
          if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(address);
          toast('Ze token address is copied. Foshur.');
        } catch {
          toast('Copy failed, mes amis. Please select and copy ze address above.');
        }
      });
    }
    const links = $('official-links');
    if (!links) return;
    const rules = [
      { key: 'pumpUrl', hosts: ['pump.fun', 'www.pump.fun'], label: 'View on pump.fun' },
      { key: 'chartUrl', hosts: ['dexscreener.com', 'www.dexscreener.com'], label: 'Ze chart' },
      { key: 'xUrl', hosts: ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'], label: 'Follow on X' },
    ];
    links.replaceChildren();
    for (const rule of rules) {
      try {
        const url = new URL(config[rule.key]);
        const path = url.pathname.split('/').filter(Boolean);
        if (url.protocol !== 'https:' || !rule.hosts.includes(url.hostname) || url.username || url.password || url.port || !path.length) continue;
        if (rule.key === 'chartUrl' && path.length < 2) continue;
        if (rule.key === 'xUrl' && (!/^[A-Za-z0-9_]{1,15}$/.test(path[0]) || path.length !== 1 || /^(home|explore|search|intent|share|settings|notifications|messages|i)$/i.test(path[0]))) continue;
        const anchor = document.createElement('a');
        anchor.href = url.href;
        anchor.textContent = rule.label;
        anchor.append(createIcon('arrow-up-right'));
        anchor.className = 'official-link';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        links.append(anchor);
      } catch {
        // Missing or invalid links remain hidden.
      }
    }
    links.hidden = !links.childElementCount;
  }

  function init() {
    setupCountdown();
    setupMemes();
    setupPresident();
    setupMinister();
    setupOfficialInformation();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
