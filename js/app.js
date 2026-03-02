/* ══════════════════════════════════════════════════════
   AGROMIND UZ — app.js
   Barcha sahifalar uchun umumiy logika.
   MUHIM: Bu fayl hech qachon redirect qilmaydi.
   Splash redirect faqat index.html ichida.
   ══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. MA'LUMOTLAR (Data)
───────────────────────────────────────── */
var AM = {

  waterHistory: [
    { d: 'Du', v: 85 },
    { d: 'Se', v: 0  },
    { d: 'Ch', v: 90 },
    { d: 'Pa', v: 0  },
    { d: 'Ju', v: 75 },
    { d: 'Sh', v: 0  },
    { d: 'Ya', v: 70 }
  ],

  prices: [
    { n: 'Pomidor',   e: '&#127813;', p: 4200, ch: 8.2,  up: true  },
    { n: 'Piyoz',     e: '&#129745;', p: 1850, ch: 3.1,  up: false },
    { n: 'Bodring',   e: '&#129388;', p: 3600, ch: 12.4, up: true  },
    { n: 'Kartoshka', e: '&#129364;', p: 2100, ch: 1.8,  up: false },
    { n: 'Qovoq',     e: '&#127875;', p: 1400, ch: 4.7,  up: true  },
    { n: 'Sabzi',     e: '&#129365;', p: 2800, ch: 6.3,  up: true  },
    { n: 'Karam',     e: '&#129382;', p: 950,  ch: 2.1,  up: true  },
    { n: 'Limon',     e: '&#127819;', p: 7200, ch: 15.3, up: true  },
    { n: 'Olcha',     e: '&#127826;', p: 8500, ch: 4.6,  up: false },
    { n: 'Uzum',      e: '&#127815;', p: 5400, ch: 9.1,  up: true  }
  ],

  posts: [
    {
      id: 1,
      author: 'Behruz Toshmatov',
      region: "Farg'ona",
      av: 'B',
      avc: '#1A62D4',
      time: '2 soat oldin',
      cat: 'Kasallik',
      q: 'Pomidor barglarida sariq doglar chiqmoqda, kimdir sababini bilasizmi?',
      ans: 14,
      likes: 23,
      tags: ['pomidor', 'kasallik']
    },
    {
      id: 2,
      author: 'Dilshod Rahimov',
      region: 'Samarqand',
      av: 'D',
      avc: '#7C3AED',
      time: '5 soat oldin',
      cat: "O'g'it",
      q: 'Bodring uchun qanday organik ogit ishlatasizlar? Tajribangizni bolishing.',
      ans: 31,
      likes: 45,
      tags: ['bodring', 'organik']
    },
    {
      id: 3,
      author: 'Sardor Nazarov',
      region: 'Toshkent',
      av: 'S',
      avc: '#059669',
      time: '1 kun oldin',
      cat: 'Texnika',
      q: 'John Deere 5075E traktor ijaraga beraman. Kim qiziqadi?',
      ans: 8,
      likes: 12,
      tags: ['traktor', 'ijara']
    },
    {
      id: 4,
      author: 'Hamid Yusupov',
      region: 'Andijon',
      av: 'H',
      avc: '#B45309',
      time: '2 kun oldin',
      cat: 'Narx',
      q: 'Toshkentda pomidor narxi qachon oshadi deb oulaysizlar?',
      ans: 22,
      likes: 34,
      tags: ['pomidor', 'narx']
    }
  ]

};

/* ─────────────────────────────────────────
   2. SAHIFALAR ORASIDA O'TISH (Navigation)
   window.location.href ishlatiladi —
   har bir HTML o'z to'liq sahifasi.
───────────────────────────────────────── */
function goPage(page) {
  window.location.href = page;
}

/* ─────────────────────────────────────────
   3. BOTTOM SHEET (Modal)
───────────────────────────────────────── */
function openSheet(id) {
  var ov = document.getElementById('ov-' + id);
  var sh = document.getElementById('sh-' + id);
  if (ov) { ov.classList.add('open'); }
  if (sh) { sh.classList.add('open'); }
}

function closeSheet(id) {
  var ov = document.getElementById('ov-' + id);
  var sh = document.getElementById('sh-' + id);
  if (ov) { ov.classList.remove('open'); }
  if (sh) { sh.classList.remove('open'); }
}

/* ─────────────────────────────────────────
   4. CHIP FILTER TUGMALARI
───────────────────────────────────────── */
function initChips() {
  var groups = document.querySelectorAll('[data-chip-group]');
  var i;
  for (i = 0; i < groups.length; i++) {
    _bindChipGroup(groups[i]);
  }
}

function _bindChipGroup(group) {
  /* Duplicate listener oldini olish */
  if (group.getAttribute('data-chip-bound')) { return; }
  group.setAttribute('data-chip-bound', '1');

  group.addEventListener('click', function (e) {
    var target = e.target;
    var chip = null;

    /* Clicked elementdan yuqoriga chiqib chip topamiz */
    while (target && target !== group) {
      if (target.getAttribute('data-chip') !== null) {
        chip = target;
        break;
      }
      target = target.parentElement;
    }
    if (!chip) { return; }

    /* Active holatni yangilash */
    var all = group.querySelectorAll('[data-chip]');
    var c;
    for (c = 0; c < all.length; c++) {
      all[c].classList.remove('on');
      all[c].classList.add('off');
    }
    chip.classList.add('on');
    chip.classList.remove('off');

    /* Action callback */
    var val = chip.getAttribute('data-chip');
    var fn  = chip.getAttribute('data-action');
    if (fn && typeof window[fn] === 'function') {
      window[fn](val);
    }
  });
}

/* ─────────────────────────────────────────
   5. TOGGLE SWITCH
───────────────────────────────────────── */
function initToggles() {
  var toggles = document.querySelectorAll('.tgl');
  var t;
  for (t = 0; t < toggles.length; t++) {
    if (!toggles[t].getAttribute('data-tgl-bound')) {
      toggles[t].setAttribute('data-tgl-bound', '1');
      toggles[t].addEventListener('click', function () {
        this.classList.toggle('on');
      });
    }
  }
}

/* ─────────────────────────────────────────
   6. RENDER: SUV SARFI GRAFIGI
───────────────────────────────────────── */
function renderWaterBars(containerId) {
  var c = document.getElementById(containerId);
  if (!c) { return; }

  var i, d, h, isToday, bg, lc, fw;
  var max = 1;

  for (i = 0; i < AM.waterHistory.length; i++) {
    if (AM.waterHistory[i].v > max) { max = AM.waterHistory[i].v; }
  }

  var html = '';
  for (i = 0; i < AM.waterHistory.length; i++) {
    d       = AM.waterHistory[i];
    h       = d.v ? Math.round((d.v / max) * 68) : 6;
    isToday = (i === 2); /* CH = bugun */

    if (isToday) {
      bg = 'var(--g500)'; lc = 'var(--g500)'; fw = '800';
    } else if (d.v > 0) {
      bg = 'var(--g200)'; lc = 'var(--n400)'; fw = '600';
    } else {
      bg = 'var(--n200)'; lc = 'var(--n400)'; fw = '600';
    }

    html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center">';
    html += '<div style="width:100%;height:68px;display:flex;align-items:flex-end">';
    html += '<div style="width:100%;height:' + h + 'px;background:' + bg + ';border-radius:4px 4px 0 0;transition:height .5s ease"></div>';
    html += '</div>';
    html += '<div style="font-size:10px;font-weight:' + fw + ';text-align:center;margin-top:5px;color:' + lc + '">' + d.d + '</div>';
    html += '</div>';
  }

  c.innerHTML = html;
}

/* ─────────────────────────────────────────
   7. RENDER: NARXLAR RO'YXATI
───────────────────────────────────────── */
function renderPrices(filter) {
  var c = document.getElementById('price-list');
  if (!c) { return; }

  var i, p, arrow, color, priceStr, chStr;
  var list = [];

  for (i = 0; i < AM.prices.length; i++) {
    if (filter === 'up') {
      if (AM.prices[i].up) { list.push(AM.prices[i]); }
    } else {
      list.push(AM.prices[i]);
    }
  }

  var html = '';
  for (i = 0; i < list.length; i++) {
    p        = list[i];
    arrow    = p.up ? '&#8593;' : '&#8595;';
    color    = p.up ? 'var(--g500)' : 'var(--r400)';
    priceStr = p.p.toLocaleString();
    chStr    = p.ch.toFixed(1);

    html += '<div class="li">';
    html += '<div style="width:44px;height:44px;border-radius:12px;background:var(--n100);';
    html += 'display:flex;align-items:center;justify-content:center;font-size:22px;';
    html += 'border:1.5px solid var(--n200);flex-shrink:0">' + p.e + '</div>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-weight:800;font-size:15px">' + p.n + '</div>';
    html += '<div style="font-size:11px;color:var(--n400);font-weight:600;margin-top:2px">1 kg</div>';
    html += '</div>';
    html += '<div style="text-align:right;flex-shrink:0">';
    html += '<div style="font-family:var(--font-display);font-size:16px;font-weight:700">';
    html += priceStr + '<span style="font-size:10px;font-weight:600"> som</span></div>';
    html += '<div style="font-size:12px;font-weight:800;color:' + color + '">';
    html += arrow + ' ' + chStr + '%</div>';
    html += '</div>';
    html += '</div>';
  }

  c.innerHTML = html;
}

/* ─────────────────────────────────────────
   8. RENDER: POSTLAR
───────────────────────────────────────── */
function renderPosts(cat) {
  var c = document.getElementById('post-list');
  if (!c) { return; }

  var i, t, post, tagsHtml;
  var list = [];

  for (i = 0; i < AM.posts.length; i++) {
    if (cat === 'Barchasi' || AM.posts[i].cat === cat) {
      list.push(AM.posts[i]);
    }
  }

  if (list.length === 0) {
    c.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--n400)">'
      + '<div style="font-size:48px;margin-bottom:10px">&#128269;</div>'
      + '<div style="font-weight:700;font-size:15px">Hech narsa topilmadi</div>'
      + '</div>';
    return;
  }

  var html = '';
  for (i = 0; i < list.length; i++) {
    post     = list[i];
    tagsHtml = '';

    for (t = 0; t < post.tags.length; t++) {
      tagsHtml += '<span style="font-size:11px;color:var(--g600);background:var(--g50);'
        + 'padding:3px 9px;border-radius:20px;font-weight:700">#' + post.tags[t] + '</span>';
    }

    html += '<div class="card" style="margin-bottom:10px;cursor:pointer">';

    /* Sarlavha qator */
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">';
    html += '<div style="width:38px;height:38px;border-radius:11px;background:' + post.avc + '22;'
      + 'color:' + post.avc + ';display:flex;align-items:center;justify-content:center;'
      + 'font-weight:800;font-size:15px;flex-shrink:0">' + post.av + '</div>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-weight:800;font-size:13px">' + post.author + '</div>';
    html += '<div style="font-size:11px;color:var(--n400)">' + post.region + ' &bull; ' + post.time + '</div>';
    html += '</div>';
    html += '<span class="badge bg" style="flex-shrink:0">' + post.cat + '</span>';
    html += '</div>';

    /* Savol matni */
    html += '<p style="font-size:14px;line-height:1.65;color:var(--n700);margin-bottom:10px">' + post.q + '</p>';

    /* Teglar */
    html += '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px">' + tagsHtml + '</div>';

    /* Alt qism */
    html += '<div style="display:flex;gap:14px;padding-top:10px;border-top:1.5px solid var(--n100)">';
    html += '<span style="font-size:12px;color:var(--n500);font-weight:700">&#128172; ' + post.ans + ' javob</span>';
    html += '<span style="font-size:12px;color:var(--n500);font-weight:700">&#10084;&#65039; ' + post.likes + '</span>';
    html += '</div>';

    html += '</div>';
  }

  c.innerHTML = html;
}

/* ─────────────────────────────────────────
   9. NDVI BAR ANIMATSIYA
───────────────────────────────────────── */
function animateNDVI() {
  var bars = document.querySelectorAll('.ndvi-bar');
  var i;
  for (i = 0; i < bars.length; i++) {
    bars[i].style.width = (bars[i].getAttribute('data-w') || '0') + '%';
  }
}

/* ─────────────────────────────────────────
   10. FILTER CALLBACKLAR (chip action)
───────────────────────────────────────── */
function filterPrices(val) {
  renderPrices(val);
}

function filterPosts(cat) {
  renderPosts(cat);
}

/* ─────────────────────────────────────────
   11. DOMContentLoaded — SAHIFAGA QARAB
   ════════════════════════════════════════
   Bu yerda HECH QANDAY setTimeout redirect
   YO'Q. Har sahifa o'z ichidagi scriptda
   o'zi kerakli narsani qiladi.
   Bu boot faqat render va initlar uchun.
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* Joriy sahifa nomini olish */
  var path    = window.location.pathname;
  var pageName = path.substring(path.lastIndexOf('/') + 1).toLowerCase();

  /* Agar pathname bo'sh bo'lsa (masalan: localhost/) — dashboard deb hisobla */
  if (pageName === '' || pageName === '/') {
    pageName = 'dashboard.html';
  }

  /* Har sahifaga mos init */
  if (pageName === 'bozor.html') {
    renderPrices('all');
    initChips();
  }

  if (pageName === 'farmernet.html') {
    renderPosts('Barchasi');
    initChips();
  }

  if (pageName === 'suvai.html') {
    renderWaterBars('wb');
  }

  if (pageName === 'skyview.html') {
    setTimeout(animateNDVI, 300);
  }

  if (pageName === 'profil.html') {
    initToggles();
  }

  if (pageName === 'dashboard.html') {
    /* Dashboard uchun maxsus init kerak bo'lsa shu yerda */
  }

  /* index.html — hech narsa qilmaymiz.
     Splash va onboarding index.html ichidagi
     o'z <script> tagi orqali boshqariladi. */

});
