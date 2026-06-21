/* ===========================
   LOVE SITE — script.js (optimisé)
   =========================== */

const START = new Date('2023-06-21T00:00:00');
function diffDays()   { return Math.floor((Date.now() - START) / 864e5); }
function diffMonths() { return Math.floor(diffDays() / 30.44); }

/* ── Détection mobile/touch ── */
const isMobile = window.matchMedia('(max-width: 768px)').matches ||
                 ('ontouchstart' in window);

/* ══════════════════════════════════════
   SPLASH — déclenche le son au clic
   ══════════════════════════════════════ */
const MUS = document.getElementById('bgMusic');
const splash = document.getElementById('splashScreen');
const splashBtn = document.getElementById('splashBtn');

function startEverything() {
  if (MUS) {
    MUS.volume = 0.8;
    MUS.loop = true;
    MUS.currentTime = 0;
    MUS.play()
      .then(() => {
        const v = document.getElementById('mpVinyl');
        if (v) v.classList.add('spinning');
        const b = document.getElementById('mpBtn');
        if (b) b.textContent = '⏸';
      })
      .catch(() => {});
    MUS.addEventListener('ended', () => { MUS.currentTime = 0; MUS.play().catch(() => {}); });
  }
  if (splash) {
    splash.classList.add('hide');
    setTimeout(() => { splash.style.display = 'none'; }, 900);
  }
  initSite();
}

if (splashBtn) splashBtn.addEventListener('click', startEverything);
if (splash) splash.addEventListener('click', e => { if (e.target === splash) startEverything(); });

/* Pétales splash — moins sur mobile */
const splashPetals = document.getElementById('splashPetals');
if (splashPetals) {
  const count = isMobile ? 4 : 8;
  ['🌸','🌺','🌷','✿','❀'].slice(0, count).forEach((p, i) => {
    const el = document.createElement('span');
    el.style.cssText = `position:absolute;top:-20px;left:${10+i*18}%;font-size:${14+i*3}px;animation:petalFall ${7+i*2}s ${i*1.2}s linear infinite;opacity:0`;
    el.textContent = p;
    splashPetals.appendChild(el);
  });
}

/* ══════════════════════════
   INIT SITE
   ══════════════════════════ */
function initSite() {

  /* --- COUNTERS --- */
  const hcD = document.getElementById('hcDays');
  const hcM = document.getElementById('hcMonths');
  if (hcD) hcD.textContent = diffDays().toLocaleString('fr-FR');
  if (hcM) hcM.textContent = diffMonths();

  /* --- FLOATING HEARTS (réduit sur mobile) --- */
  const fl = document.getElementById('floatingLayer');
  const chars = ['♡','♥','💕','💗','🌸','✨'];
  if (fl) {
    const count = isMobile ? 12 : 40; /* Moins d'éléments = moins de GPU */
    for (let i = 0; i < count; i++) {
      const h = document.createElement('span');
      h.className = 'fh';
      h.textContent = chars[i % chars.length];
      h.style.cssText = `left:${(i/count)*100}vw;font-size:${10+Math.random()*14}px;animation-duration:${11+Math.random()*12}s;animation-delay:${(i/count)*14}s`;
      fl.appendChild(h);
    }
  }

  /* --- SPARKLES (désactivé sur mobile) --- */
  if (!isMobile) {
    const sl = document.getElementById('sparkLayer');
    if (sl) for (let i = 0; i < 40; i++) {
      const s = document.createElement('div');
      s.className = 'spark';
      const sz = 2 + Math.random() * 4;
      s.style.cssText = `left:${Math.random()*100}vw;top:${Math.random()*100}vh;width:${sz}px;height:${sz}px;animation-duration:${3+Math.random()*5}s;animation-delay:${Math.random()*8}s;background:${Math.random()>.5?'#e8507a':'#f4a0c0'}`;
      sl.appendChild(s);
    }
  }

  /* --- HERO PETALS (réduit sur mobile) --- */
  const hp = document.getElementById('heroPetals');
  const pc = ['🌸','🌺','🌷'];
  if (hp) {
    const count = isMobile ? 8 : 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = pc[i % pc.length];
      p.style.cssText = `left:${(i/count)*100}%;font-size:${13+i%8}px;animation-duration:${7+i%6}s;animation-delay:${(i/count)*10}s`;
      hp.appendChild(p);
    }
  }

  /* --- CANVAS BG (désactivé sur petit mobile) --- */
  const cv = document.getElementById('bgCanvas');
  if (cv && !isMobile) {
    const ctx = cv.getContext('2d');
    const orbs = Array.from({length: 4}, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random()-.5)*.0003, vy: (Math.random()-.5)*.0003,
      r: .25+Math.random()*.2, c: Math.random()>.5?'#f8c0d8':'#fde8f0'
    }));
    function resz() { cv.width = window.innerWidth; cv.height = document.body.scrollHeight; }
    resz();
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resz, 200); });
    let lastT = 0;
    (function draw(ts) {
      if (ts - lastT < 50) { requestAnimationFrame(draw); return; } /* max 20fps pour canvas */
      lastT = ts;
      ctx.clearRect(0, 0, cv.width, cv.height);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < 0 || o.x > 1) o.vx *= -1;
        if (o.y < 0 || o.y > 1) o.vy *= -1;
        const g = ctx.createRadialGradient(o.x*cv.width, o.y*cv.height, 0, o.x*cv.width, o.y*cv.height, o.r*Math.min(cv.width, cv.height));
        g.addColorStop(0, o.c+'88'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
      });
      requestAnimationFrame(draw);
    })(0);
  } else if (cv) {
    cv.style.display = 'none'; /* Économise GPU sur mobile */
  }

  /* --- GALLERY (chargement paresseux par batch) --- */
  const photoData = [
    {src:'images/photo1.jpg',  label:'Complices face au monde', icon:'❤️'},
    {src:'images/photo2.jpg',  label:'Ce regard qui dit tout',  icon:'✨'},
    {src:'images/photo3.jpg',  label:'Elle, radieuse',          icon:'🌟'},
    {src:'images/photo4.jpg',  label:'Son sourire, mon soleil', icon:'☀️'},
    {src:'images/photo5.jpg',  label:'Sa joie contagieuse',     icon:'😊'},
    {src:'images/photo6.jpg',  label:'Un repas, un souvenir',   icon:'🍽️'},
    {src:'images/photo7.jpg',  label:'Nos moments gourmands',   icon:'😋'},
    {src:'images/photo8.jpg',  label:'Lui, sous les fleurs',    icon:'🌿'},
    {src:'images/photo9.jpg',  label:'Nos mains, un cœur',     icon:'🫶'},
    {src:'images/photo10.jpg', label:'La fleur qu\'elle tenait',icon:'🌼'},
    {src:'images/photo11.jpg', label:'Sa main et la fleur',     icon:'🌷'},
    {src:'images/photo12.jpg', label:'Une fleur pour nous',     icon:'💐'},
    {src:'images/photo13.jpg', label:'Mains entrelacées',       icon:'🔗'},
    {src:'images/photo14.jpg', label:'Elle qui me fait sourire',icon:'🌺'},
    {src:'images/photo15.jpg', label:'Ce sourire que j\'aime',  icon:'💕'},
    {src:'images/photo16.jpg', label:'Nos regards',             icon:'👀'},
    {src:'images/photo17.jpg', label:'Ensemble dehors',         icon:'🌞'},
    {src:'images/photo18.jpg', label:'Un instant précieux',     icon:'💫'},
    {src:'images/photo19.jpg', label:'Nos doigts, notre langue',icon:'💬'},
    {src:'images/photo20.jpg', label:'Toi & moi',               icon:'♡'},
    {src:'images/photo21.jpg', label:'Gravé dans le temps',     icon:'⏳'},
    {src:'images/photo22.jpg', label:'Une page de notre vie',   icon:'📖'},
    {src:'images/photo23.jpg', label:'Précieux',                icon:'💎'},
    {src:'images/photo24.jpg', label:'Pour toujours',           icon:'♾️'},
    {src:'images/photo25.jpg', label:'Notre lumière',           icon:'🌟'},
    {src:'images/photo26.jpg', label:'Elle, face au monde',     icon:'🖤'},
    {src:'images/photo27.jpg', label:'Son sourire, mon tout',   icon:'💖'},
    {src:'images/photo28.jpg', label:'Notre gâteau d\'amour',   icon:'🎂'},
    {src:'images/photo29.jpg', label:'Un sourire complice',    icon:'🎉'},
    {src:'images/photo30.jpg', label:'Le jour de tes vœux',    icon:'🕯️'},
    {src:'images/photo31.jpg', label:'Nos instants ensemble',  icon:'🍿'},
  ];

  const gg = document.getElementById('galleryGrid');
  if (gg) {
    /* Créer d'abord les 8 premiers (visible screen), puis le reste avec un delay */
    const renderBatch = (start, end) => {
      photoData.slice(start, end).forEach((ph, idx) => {
        const i = start + idx;
        const d = document.createElement('div');
        d.className = 'polaroid reveal';
        /* Utiliser data-src pour lazy loading réel */
        d.innerHTML = `<div class="polaroid-img-wrap"><img data-src="${ph.src}" alt="${ph.label}" loading="lazy" onerror="this.closest('.polaroid').style.display='none'"></div><span class="polaroid-heart">${ph.icon}</span><div class="polaroid-label">${ph.label}</div>`;
        d.addEventListener('click', () => openLB(i));
        gg.appendChild(d);
      });
    };
    renderBatch(0, 8); /* Premier batch immédiat */
    setTimeout(() => renderBatch(8, 31), 300); /* Reste après 300ms */
  }

  /* --- LIGHTBOX --- */
  let lbIdx = 0;
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCaption');

  function openLB(i) {
    lbIdx = i;
    lbImg.src = photoData[i].src;
    if (lbCap) lbCap.textContent = photoData[i].label + ' ' + photoData[i].icon;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() { lb.classList.remove('active'); document.body.style.overflow = ''; }
  function prevLB() { lbIdx = (lbIdx - 1 + photoData.length) % photoData.length; lbImg.src = photoData[lbIdx].src; if (lbCap) lbCap.textContent = photoData[lbIdx].label + ' ' + photoData[lbIdx].icon; }
  function nextLB() { lbIdx = (lbIdx + 1) % photoData.length; lbImg.src = photoData[lbIdx].src; if (lbCap) lbCap.textContent = photoData[lbIdx].label + ' ' + photoData[lbIdx].icon; }

  document.getElementById('lbClose') && (document.getElementById('lbClose').onclick = closeLB);
  document.getElementById('lbPrev') && (document.getElementById('lbPrev').onclick = prevLB);
  document.getElementById('lbNext') && (document.getElementById('lbNext').onclick = nextLB);
  lb && lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

  /* Swipe sur mobile pour lightbox */
  if (lb) {
    let tX = 0;
    lb.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, {passive: true});
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tX;
      if (Math.abs(dx) > 50) { dx < 0 ? nextLB() : prevLB(); }
    });
  }

  document.addEventListener('keydown', e => {
    if (!lb || !lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') prevLB();
    if (e.key === 'ArrowRight') nextLB();
  });

  /* Lazy load images via IntersectionObserver */
  const imgObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target.querySelector('img[data-src]');
        if (img) { img.src = img.dataset.src; delete img.dataset.src; }
        imgObs.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('.polaroid').forEach(el => imgObs.observe(el));

  /* --- VIDEOS (lazy — ne charger que preload="none" initialement) --- */
  const vidData = [
    {src:'videos/video1.mp4',  label:'Notre moment ♡'},
    {src:'videos/video2.mp4',  label:'Toi, vivante ♡'},
    {src:'videos/video3.mp4',  label:'Ensemble, toujours ♡'},
    {src:'videos/video4.mp4',  label:'Des éclats de vie ♡'},
    {src:'videos/video5.mp4',  label:'Nos instants précieux ♡'},
    {src:'videos/video6.mp4',  label:'Ce que l\'on garde ♡'},
    {src:'videos/video7.mp4',  label:'Notre lumière ♡'},
    {src:'videos/video8.mp4',  label:'Un sourire gravé ♡'},
    {src:'videos/video9.mp4',  label:'Rien que nous deux ♡'},
    {src:'videos/video10.mp4', label:'Ces instants rares ♡'},
    {src:'videos/video11.mp4', label:'Notre complicité ♡'},
    {src:'videos/video12.mp4', label:'Vivants ensemble ♡'},
    {src:'videos/video13.mp4', label:'Ce bonheur simple ♡'},
    {src:'videos/video14.mp4', label:'Pour toujours en mémoire ♡'},
    {src:'videos/video15.mp4', label:'Encore et encore ♡'},
    {src:'videos/video16.mp4', label:'Un regard qui dit tout ♡'},
    {src:'videos/video17.mp4', label:'Nos fous rires ♡'},
    {src:'videos/video18.mp4', label:'La douceur de nos jours ♡'},
    {src:'videos/video19.mp4', label:'Des instants volés ♡'},
    {src:'videos/video20.mp4', label:'Notre histoire continue ♡'},
    {src:'videos/video21.mp4', label:'Un moment volé ♡'},
    {src:'videos/video22.mp4', label:'Toi, vivante et belle ♡'},
    {src:'videos/video23.mp4', label:'Ces éclats de rire ♡'},
    {src:'videos/video24.mp4', label:'Notre complicité ♡'},
    {src:'videos/video25.mp4', label:'Gravé pour toujours ♡'},
    {src:'videos/video26.mp4', label:'Ce bonheur qu\'on partage ♡'},
    {src:'videos/video27.mp4', label:'Ensemble, encore ♡'},
    {src:'videos/video28.mp4', label:'Ces instants précieux ♡'},
    {src:'videos/video29.mp4', label:'Nos souvenirs vivants ♡'},
    {src:'videos/video30.mp4', label:'Nous deux, toujours ♡'},
  ];

  const vg = document.getElementById('videoGrid');
  if (vg) {
    vidData.forEach(v => {
      const c = document.createElement('div');
      c.className = 'vid-card reveal';
      /* preload="none" = ne charge rien tant que l'utilisateur ne clique pas */
      c.innerHTML = `<video src="${v.src}" controls preload="none" playsinline loading="lazy" onerror="this.closest('.vid-card').style.display='none'"></video><div class="vid-label">${v.label}</div>`;
      vg.appendChild(c);
    });

    /* Lazy-load src des vidéos à la volée */
    const vidObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const vid = e.target.querySelector('video');
          if (vid && !vid.src.includes('video')) {
            vid.load(); /* Démarre le chargement metadata uniquement */
          }
        }
      });
    }, { rootMargin: '100px' });
    document.querySelectorAll('.vid-card').forEach(el => vidObs.observe(el));
  }

  /* --- QUOTES --- */
  const quotesData = [
    {text:"L'amour n'est pas de regarder l'un l'autre, c'est de regarder ensemble dans la même direction.", src:"Saint-Exupéry"},
    {text:"Les plus belles histoires d'amour sont celles qui résistent à la tempête.", src:"Sagesse"},
    {text:"Deux âmes qui s'aiment sont capables de traverser n'importe quelle nuit.", src:"Inspiration"},
    {text:"Ce qui rend une relation belle, ce n'est pas l'absence de conflits, c'est la force de continuer malgré eux.", src:"Vérité"},
    {text:"Aimer, c'est choisir l'autre chaque jour, même quand c'est difficile.", src:"Pour nous"},
    {text:"Rester quand tout pousse à partir — c'est l'acte d'amour le plus courageux.", src:"Courage"},
    {text:"Parfois l'amour compliqué est le plus profond — parce qu'il refuse de capituler.", src:"Notre histoire"},
    {text:"On ne mesure pas la valeur d'un amour à l'absence d'obstacles, mais à la volonté de les surmonter ensemble.", src:"Fidélité"},
  ];
  const qc = document.getElementById('quotesCarousel');
  const qd = document.getElementById('quotesDots');
  let qCur = 0, qT;
  if (qc) {
    quotesData.forEach((q, i) => {
      const s = document.createElement('div');
      s.className = 'q-slide' + (i === 0 ? ' active' : '');
      s.innerHTML = `<div class="q-text">${q.text}<span class="q-source">— ${q.src}</span></div>`;
      qc.appendChild(s);
      const dot = document.createElement('button');
      dot.className = 'q-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goQ(i);
      qd && qd.appendChild(dot);
    });
    function goQ(n) {
      const ss = qc.querySelectorAll('.q-slide'), dd = qd ? qd.querySelectorAll('.q-dot') : [];
      ss[qCur].classList.remove('active'); ss[qCur].classList.add('out');
      dd[qCur] && dd[qCur].classList.remove('active');
      setTimeout(() => ss[qCur].classList.remove('out'), 600);
      qCur = n; ss[qCur].classList.add('active'); dd[qCur] && dd[qCur].classList.add('active');
      clearInterval(qT); qT = setInterval(() => goQ((qCur+1) % quotesData.length), 5000);
    }
    qT = setInterval(() => goQ((qCur+1) % quotesData.length), 5000);

    /* Swipe sur mobile pour carousel */
    let qTouchX = 0;
    qc.addEventListener('touchstart', e => { qTouchX = e.touches[0].clientX; }, {passive: true});
    qc.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - qTouchX;
      if (Math.abs(dx) > 40) goQ(dx < 0 ? (qCur+1) % quotesData.length : (qCur - 1 + quotesData.length) % quotesData.length);
    });
  }

  /* --- HEARTS RAIN --- */
  const fr = document.getElementById('finalRain');
  if (fr) {
    ['♡','♥','💕','🌸','✨'].forEach((c, i) => {
      const h = document.createElement('span');
      h.className = 'hr-drop';
      h.textContent = c;
      h.style.cssText = `left:${5+i*18}%;font-size:${12+i*3}px;animation-duration:${5+i*2}s;animation-delay:${i*1.5}s`;
      fr.appendChild(h);
    });
  }

  /* --- MUSIC PLAYER --- */
  const mpBtn = document.getElementById('mpBtn');
  const mpVinyl = document.getElementById('mpVinyl');
  if (mpBtn && MUS) {
    mpBtn.addEventListener('click', () => {
      if (MUS.paused) {
        MUS.play(); if (mpVinyl) mpVinyl.classList.add('spinning'); mpBtn.textContent = '⏸';
      } else {
        MUS.pause(); if (mpVinyl) mpVinyl.classList.remove('spinning'); mpBtn.textContent = '▶';
      }
    });
  }

  /* --- MOTS CACHÉS POPUP --- */
  const popup = document.getElementById('secretPopup');
  const popupText = document.getElementById('secretPopupText');
  const popupClose = document.getElementById('secretClose');
  const popupIcon = document.getElementById('secretPopupIcon');

  /* Mapping icône par type de secret */
  const iconMap = {'💌':'💌','🌟':'⭐','🔒':'🔐','✍️':'📝','🌸':'🌸','🎥':'🎬','💫':'✨','🎂':'🎂','✨':'💫','♡':'❤️','🖤':'💖','💎':'💎','🌙':'🌙'};

  document.querySelectorAll('.secret-word').forEach(sw => {
    sw.addEventListener('click', e => {
      e.stopPropagation();
      const msg = sw.dataset.secret;
      if (msg && popup && popupText) {
        popupText.textContent = msg;
        /* Changer l'icône selon le symbole cliqué */
        if (popupIcon) popupIcon.textContent = iconMap[sw.textContent.trim()] || '💌';
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  const closePopup = () => { popup && popup.classList.remove('active'); document.body.style.overflow = ''; };
  popupClose && popupClose.addEventListener('click', closePopup);
  popup && popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });

  /* --- CLICK HEARTS (réduit sur mobile) --- */
  if (!isMobile) {
    document.addEventListener('click', e => {
      if (e.target.closest('.secret-word') || e.target.closest('.secret-popup') || e.target.closest('#splashScreen')) return;
      for (let i = 0; i < 4; i++) {
        const h = document.createElement('span');
        h.className = 'click-heart';
        h.textContent = ['♡','♥','💕'][i % 3];
        h.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--tx:${(Math.random()-.5)*70}px;--ty:${-35-Math.random()*50}px;font-size:${12+i*3}px`;
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 900);
      }
    });
  }

  /* --- SCROLL REVEAL (Intersection Observer, pas de timeout) --- */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        /* Stats counter */
        if (e.target.classList.contains('stats-section') && !window._statsRan) {
          window._statsRan = true;
          animNum(document.getElementById('sDays'), diffDays(), 1600);
          animNum(document.getElementById('sMonths'), diffMonths(), 1200);
        }
        ro.unobserve(e.target); /* Une seule fois suffit */
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .stats-section').forEach(el => ro.observe(el));

  /* Observer pour éléments ajoutés dynamiquement (galerie/videos) */
  const mutObs = new MutationObserver(() => {
    document.querySelectorAll('.reveal:not([data-obs])').forEach(el => {
      el.dataset.obs = '1';
      ro.observe(el);
      imgObs && imgObs.observe(el);
    });
  });
  mutObs.observe(document.body, { childList: true, subtree: true });

  /* --- CURSEUR (desktop seulement) --- */
  if (!isMobile) {
    const cur = document.getElementById('cursor');
    const curt = document.getElementById('cursorTrail');
    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, {passive: true});
    document.addEventListener('click', () => {
      cur && cur.classList.add('clicked');
      setTimeout(() => cur && cur.classList.remove('clicked'), 300);
    });
    if (cur && curt) {
      (function animCursor() {
        tx += (mx - tx) * .15; ty += (my - ty) * .15;
        cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        curt.style.left = tx + 'px'; curt.style.top = ty + 'px';
        requestAnimationFrame(animCursor);
      })();
    }
  }

  /* --- VÉRIFICATION JOUR-J : 21 JUIN --- */
  checkAnniversaryDay();

} /* fin initSite */

/* ════════════════════════════════════════════
   MODE FÊTE — activé automatiquement le 21 juin
   ════════════════════════════════════════════ */
function checkAnniversaryDay() {
  const now = new Date();
  const isAnniversary = (now.getMonth() === 5 && now.getDate() === 21); // juin = mois 5 (0-indexé)

  if (!isAnniversary) return;

  /* 0. Activer le mode fête sur tout le body — cache les sections "hide-on-party" */
  document.body.classList.add('party-day');

  /* 1. Afficher la section anniversaire */
  const annivSection = document.getElementById('anniversaryDay');
  if (annivSection) annivSection.style.display = 'block';

  /* 2. Changer le contenu du hero pour le mode fête */
  const heroEyebrow = document.getElementById('heroEyebrow');
  const heroTitle   = document.getElementById('heroTitleText');
  const heroSince   = document.getElementById('heroSinceText');
  const heroSection = document.querySelector('.hero');
  const heroCta     = document.querySelector('.hero-cta');

  if (heroSection) heroSection.classList.add('party-mode');
  if (heroEyebrow) heroEyebrow.textContent = '🎉 C\'est aujourd\'hui ! Joyeux anniversaire à nous 🎉';
  if (heroTitle)   heroTitle.textContent   = 'Joyeux 3 Ans !';
  if (heroSince)   heroSince.innerHTML     = 'Le <strong>21 Juin 2026</strong> — notre 3ème anniversaire ♡';
  if (heroCta) { heroCta.setAttribute('href', '#anniversaryDay'); heroCta.querySelector('span').textContent = 'Voir la surprise'; }

  /* 3. Lancer les confettis en continu toute la journée */
  startConfetti();

  /* 4. Mettre à jour le titre de l'onglet navigateur */
  document.title = '🎉 Joyeux 3 Ans — Nous Deux ♡';

  /* 5. Notification discrète en haut de page */
  showAnniversaryBanner();

  /* 6. Construire la mosaïque photo */
  buildAnnivMosaic();

  /* 6b. Activer le bouton paillettes */
  initGlitterButton();

  /* 7. Construire le carrousel vidéo plein format */
  buildAnnivVideoCarousel();

  /* 8. Animer les stats chiffrées */
  animateAnnivStats();

  /* 9. Lancer les cœurs flottants sur canvas */
  startFloatingHearts();

  /* 10. Salves de confettis à l'ouverture */
  setTimeout(() => launchCelebrationBurst(), 800);
  setTimeout(() => launchCelebrationBurst(), 2400);

  /* 11. Rideau de cinéma — remplace le splash */
  initCinemaScreen();
}

/* ── RIDEAU DE CINÉMA — le 21 juin uniquement ── */
function initCinemaScreen() {
  const cinema  = document.getElementById('cinemaScreen');
  const splash  = document.getElementById('splashScreen');
  const btn     = document.getElementById('cinemaBtn');
  if (!cinema) return;

  /* Cacher le splash normal, montrer le cinéma */
  if (splash) splash.style.display = 'none';
  cinema.style.display = 'flex';

  /* Générer les anneaux du rail */
  const railRings = document.getElementById('railRings');
  if (railRings) {
    const count = Math.ceil(window.innerWidth / 22);
    for (let i = 0; i < count; i++) {
      const r = document.createElement('div');
      r.className = 'rail-ring';
      railRings.appendChild(r);
    }
  }

  /* Faire apparaître les éléments texte en cascade */
  setTimeout(() => document.getElementById('cinemaLogo')?.classList.add('visible'),   300);
  setTimeout(() => document.getElementById('cinemaDate')?.classList.add('visible'),   700);
  setTimeout(() => document.getElementById('cinemaTagline')?.classList.add('visible'),1000);
  setTimeout(() => document.getElementById('cinemaStars')?.classList.add('visible'),  1300);
  setTimeout(() => document.getElementById('cinemaBtn')?.classList.add('visible'),    1600);
  setTimeout(() => document.getElementById('cinemaHint')?.classList.add('visible'),   2000);

  /* Ouvrir le rideau */
  function openCurtain() {
    btn && (btn.disabled = true);
    cinema.classList.add('opening');

    /* Pendant l'ouverture : afficher le splash anniversaire */
    setTimeout(() => {
      /* Démarrer la vraie page */
      startEverything();
    }, 900);

    /* Puis faire disparaître le cinéma */
    setTimeout(() => {
      cinema.classList.add('done');
      setTimeout(() => cinema.remove(), 800);
    }, 1800);
  }

  btn?.addEventListener('click', openCurtain);
  /* Aussi sur touche Espace ou Entrée */
  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !cinema.classList.contains('opening')) {
      openCurtain();
    }
  }, { once: true });
}


function animateAnnivStats() {
  const START_DATE = new Date('2023-06-21T00:00:00');
  const now2   = new Date();
  const ms2    = now2 - START_DATE;
  const jours2    = Math.floor(ms2 / 864e5);
  const heures2   = Math.floor(ms2 / 36e5);
  const semaines2 = Math.floor(ms2 / (7 * 864e5));

  function countUp(el, target, duration) {
    if (!el) return;
    const startT = performance.now();
    const update = (t) => {
      const progress = Math.min((t - startT) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('fr-FR');
    };
    requestAnimationFrame(update);
  }

  const statsRow = document.querySelector('.anniv-stats-row');
  if (!statsRow) return;
  const obs2 = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      countUp(document.getElementById('asJours'),    jours2,    1800);
      countUp(document.getElementById('asHeures'),   heures2,   2200);
      countUp(document.getElementById('asSemaines'), semaines2, 1500);
      obs2.disconnect();
    }
  }, { threshold: .3 });
  obs2.observe(statsRow);
}

/* ── CŒURS FLOTTANTS SUR CANVAS ── */
function startFloatingHearts() {
  const canvas = document.getElementById('heartsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const fHearts = Array.from({ length: 22 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + window.innerHeight,
    size: 14 + Math.random() * 20,
    speed: .3 + Math.random() * .7,
    alpha: .25 + Math.random() * .4,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: .015 + Math.random() * .025,
  }));

  let fRunning = true;
  function fLoop() {
    if (!fRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fHearts.forEach(h => {
      h.y -= h.speed; h.wobble += h.wobbleSpeed;
      const wx = h.x + Math.sin(h.wobble) * 20;
      if (h.y < -40) { h.y = canvas.height + 40; h.x = Math.random() * canvas.width; }
      ctx.save(); ctx.globalAlpha = h.alpha;
      ctx.font = h.size + 'px serif'; ctx.textAlign = 'center';
      ctx.fillText('❤️', wx, h.y); ctx.restore();
    });
    requestAnimationFrame(fLoop);
  }
  fLoop();
  document.addEventListener('visibilitychange', () => {
    fRunning = !document.hidden; if (fRunning) fLoop();
  });
}

/* ── SALVE DE CONFETTIS ── */
function launchCelebrationBurst() {
  const colors = ['#e8507a','#ffd700','#ff8fa3','#fff','#ff6b9d','#ffc0cb','#b5179e'];
  for (let i = 0; i < 55; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.cssText = `position:fixed;top:${5+Math.random()*35}%;left:${Math.random()*100}%;
        width:${6+Math.random()*10}px;height:${6+Math.random()*10}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${Math.random()>.5?'50%':'2px'};pointer-events:none;z-index:9998;
        animation:confettiFall ${1.5+Math.random()*2}s ease forwards;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 25);
  }
}



/* --- MOSAÏQUE PHOTO SPÉCIALE FÊTE (avec dispositions multiples) --- */
function buildAnnivMosaic() {
  const mosaic = document.getElementById('annivMosaic');
  if (!mosaic) return;

  mosaic.classList.add('layout-mosaic');

  // Sélection volontairement différente : ordre mélangé, certaines en grand format
  const picks = [
    { n: 9,  size: 'big'  },
    { n: 30, size: ''     },
    { n: 5,  size: 'wide' },
    { n: 14, size: ''     },
    { n: 22, size: 'tall' },
    { n: 2,  size: ''     },
    { n: 18, size: ''     },
    { n: 31, size: 'wide' },
    { n: 11, size: ''     },
    { n: 26, size: 'big'  },
    { n: 7,  size: ''     },
    { n: 19, size: ''     },
    { n: 3,  size: 'tall' },
    { n: 24, size: ''     },
    { n: 15, size: ''     },
    { n: 8,  size: 'wide' },
  ];

  picks.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'anniv-mosaic-item ' + p.size;
    div.style.zIndex = picks.length - i;
    div.innerHTML = `<img src="images/photo${p.n}.jpg" alt="Souvenir ${p.n}" loading="lazy" onerror="this.closest('.anniv-mosaic-item').style.display='none'">`;
    mosaic.appendChild(div);
  });

  positionLayout(mosaic, 'mosaic');

  /* --- Boutons de sélection de disposition --- */
  document.querySelectorAll('.layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layout = btn.dataset.layout;
      switchMosaicLayout(mosaic, layout);
    });
  });
}

function switchMosaicLayout(mosaic, layout) {
  // Retirer toutes les classes layout-*
  mosaic.className = mosaic.className.replace(/layout-\w+/g, '').trim();
  mosaic.classList.add('anniv-mosaic', 'reveal', 'visible', 'layout-' + layout);
  mosaic.dataset.currentLayout = layout;
  positionLayout(mosaic, layout);

  // Recalcule la disposition "circle" si la fenêtre change de taille
  if (layout === 'circle' && !mosaic._resizeBound) {
    mosaic._resizeBound = true;
    window.addEventListener('resize', () => {
      if (mosaic.dataset.currentLayout === 'circle') positionLayout(mosaic, 'circle');
    });
  }
}

function positionLayout(mosaic, layout) {
  const items = mosaic.querySelectorAll('.anniv-mosaic-item');
  if (layout === 'circle') {
    const radius = window.innerWidth < 700 ? 150 : 220;
    items.forEach((item, i) => {
      const angle = (i / items.length) * 2 * Math.PI;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      item.style.transform = `translate(${x}px, ${y}px)`;
    });
  } else if (layout === 'stack') {
    items.forEach((item, i) => {
      const offset = i * 3;
      const rot = (i % 2 === 0 ? 1 : -1) * (3 + i * 0.6);
      item.style.left = `calc(50% - 110px + ${offset}px)`;
      item.style.transform = `rotate(${rot}deg)`;
      item.style.zIndex = items.length - i;
    });
  } else {
    // mosaic / grid / film : reset transform
    items.forEach(item => { item.style.transform = ''; item.style.left = ''; });
  }
}

/* --- BOUTON PAILLETTES INTERACTIF --- */
function initGlitterButton() {
  const btn = document.getElementById('glitterBtn');
  const canvas = document.getElementById('glitterCanvas');
  if (!btn || !canvas) return;

  const glitterColors = ['#ffd700', '#ffb6c1', '#e8507a', '#ff8fa3', '#fff', '#c0392b', '#ffeb3b'];
  const glitterShapes = ['✦', '✧', '★', '♡', '●'];

  btn.addEventListener('click', () => {
    // Petite explosion immédiate au niveau du bouton
    const rect = btn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;

    for (let i = 0; i < 80; i++) {
      setTimeout(() => spawnGlitter(originX), i * 8);
    }

    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 400);
  });

  function spawnGlitter(originX) {
    const g = document.createElement('span');
    const isEmoji = Math.random() > 0.5;
    g.className = 'glitter-piece';
    g.style.left = (originX + (Math.random() - 0.5) * 300) + 'px';
    g.style.fontSize = (10 + Math.random() * 14) + 'px';
    g.style.animationDuration = (2.5 + Math.random() * 3) + 's';

    if (isEmoji) {
      g.textContent = glitterShapes[Math.floor(Math.random() * glitterShapes.length)];
      g.style.color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
    } else {
      const size = 4 + Math.random() * 5;
      g.style.width = size + 'px';
      g.style.height = size + 'px';
      g.style.background = glitterColors[Math.floor(Math.random() * glitterColors.length)];
      g.style.borderRadius = '50%';
      g.style.display = 'block';
    }

    canvas.appendChild(g);
    setTimeout(() => g.remove(), 6000);
  }
}

/* --- CARROUSEL VIDÉO PLEIN FORMAT --- */
function buildAnnivVideoCarousel() {
  const stage = document.getElementById('avcStage');
  const dots  = document.getElementById('avcDots');
  if (!stage) return;

  // Sélection différente de la grille vidéo normale
  const picks = [3, 11, 19, 7, 25, 14, 2, 30];
  let current = 0;

  picks.forEach((n, i) => {
    const v = document.createElement('video');
    v.src = `videos/video${n}.mp4`;
    v.controls = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.className = i === 0 ? 'active' : '';
    v.onerror = function() { this.style.display = 'none'; };
    stage.appendChild(v);

    const d = document.createElement('button');
    d.className = 'avc-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToVideo(i));
    dots.appendChild(d);
  });

  function goToVideo(idx) {
    const vids = stage.querySelectorAll('video');
    const dd   = dots.querySelectorAll('.avc-dot');
    vids[current].classList.remove('active');
    vids[current].pause();
    dd[current].classList.remove('active');
    current = idx;
    vids[current].classList.add('active');
    dd[current].classList.add('active');
  }

  document.getElementById('avcPrev').addEventListener('click', () => {
    goToVideo((current - 1 + picks.length) % picks.length);
  });
  document.getElementById('avcNext').addEventListener('click', () => {
    goToVideo((current + 1) % picks.length);
  });
}

function startConfetti() {
  const container = document.getElementById('annivConfetti');
  if (!container) return;
  const colors = ['#e8507a', '#ffd700', '#ff8fa3', '#ffb6c1', '#fff0d9', '#c0392b'];
  const shapes = ['50%', '2px']; // rond ou carré

  function spawnConfetti() {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    c.style.left = Math.random() * 100 + '%';
    c.style.width = size + 'px';
    c.style.height = size + 'px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
    c.style.animationDuration = (4 + Math.random() * 5) + 's';
    container.appendChild(c);
    setTimeout(() => c.remove(), 9500);
  }

  // Génère des confettis en continu pendant que la section est visible
  setInterval(spawnConfetti, 250);
  for (let i = 0; i < 30; i++) setTimeout(spawnConfetti, i * 80);
}

function showAnniversaryBanner() {
  const banner = document.createElement('div');
  banner.style.cssText = `
    position:fixed;top:0;left:0;right:0;z-index:9000;
    background:linear-gradient(135deg,#e8507a,#ffd700);
    color:#fff;text-align:center;padding:10px 16px;
    font-family:'Lato',sans-serif;font-weight:700;font-size:13px;
    letter-spacing:.5px;box-shadow:0 4px 20px rgba(0,0,0,.15);
    animation:slideDownBanner .5s ease both;
  `;
  banner.innerHTML = '🎉 Aujourd\'hui c\'est notre anniversaire ! Découvre la surprise plus bas ↓ 🎉';
  document.body.prepend(banner);

  const style = document.createElement('style');
  style.textContent = `@keyframes slideDownBanner{from{transform:translateY(-100%)}to{transform:translateY(0)}}`;
  document.head.appendChild(style);


  setTimeout(() => { banner.style.opacity = '0'; banner.style.transition='opacity .6s'; setTimeout(()=>banner.remove(),600); }, 8000);
}

/* ════════════════════════════════════════════
   INNOVATIONS V2
   ════════════════════════════════════════════ */

/* ── Données : proverbes & citations ── */
const ALL_PROVERBES = [
  { text: "L'amour n'est pas de regarder l'un l'autre, c'est de regarder ensemble dans la même direction.", src: "Antoine de Saint-Exupéry", icon: "🌹" },
  { text: "Là où il y a amour, il y a vie.", src: "Gandhi", icon: "🕊️" },
  { text: "Aimer, c'est trouver sa propre richesse dans la personne qu'on aime.", src: "Jacques Maritain", icon: "💎" },
  { text: "Un cœur qui aime est toujours jeune.", src: "Proverbe grec", icon: "🫀" },
  { text: "Le bonheur, c'est aimer et être aimé.", src: "George Sand", icon: "✨" },
  { text: "L'amour vrai ne fuit pas les obstacles, il les traverse.", src: "Proverbe français", icon: "🌊" },
  { text: "Deux âmes qui s'aiment sont capables de traverser n'importe quelle nuit.", src: "Inspiration", icon: "🌙" },
  { text: "Aimer, c'est choisir l'autre chaque jour, même quand c'est difficile.", src: "Sagesse moderne", icon: "🔄" },
  { text: "On reconnaît l'arbre à ses fruits, et l'amour à ses actes.", src: "Sagesse populaire", icon: "🌳" },
  { text: "L'amour véritable ne se nourrit pas de perfection, mais de persévérance.", src: "Proverbe français", icon: "🌱" },
  { text: "Le temps n'épargne pas ce qu'on a fait sans lui.", src: "Paul Valéry", icon: "⏳" },
  { text: "Aimer quelqu'un, c'est lui dire : tu ne mourras pas.", src: "Gabriel Marcel", icon: "💫" },
  { text: "Ce qui se fait avec amour se fait toujours bien.", src: "Van Gogh", icon: "🎨" },
  { text: "Le vrai amour commence quand on n'attend rien en retour.", src: "Antoine de Saint-Exupéry", icon: "🎁" },
  { text: "Rester quand tout pousse à partir — c'est l'acte d'amour le plus courageux.", src: "Notre histoire", icon: "💪" },
  { text: "L'amour ne cherche pas sa propre gloire.", src: "1 Corinthiens 13", icon: "🙏" },
];

const PROVERBES_MONDE = [
  { flag: "🇯🇵", origin: "Proverbe japonais", text: "L'amour et les nuages n'ont jamais de forme fixe.", meaning: "L'amour est toujours en mouvement, changeant et vivant — il ne se laisse jamais enfermer." },
  { flag: "🇧🇷", origin: "Proverbe brésilien", text: "Amor com amor se paga — l'amour se paye avec de l'amour.", meaning: "La seule monnaie valide entre deux êtres qui s'aiment, c'est l'amour lui-même." },
  { flag: "🇦🇫", origin: "Proverbe afghan", text: "Si tu ne peux pas être le soleil, sois au moins la lune.", meaning: "Chacun apporte sa lumière à sa façon. L'amour, c'est aussi savoir éclairer dans l'ombre." },
  { flag: "🇹🇷", origin: "Proverbe turc", text: "L'amour ne dure pas parce qu'il commence avec un sourire, mais parce qu'il résiste aux larmes.", meaning: "La vraie force d'un amour se mesure dans les moments difficiles, pas dans les beaux jours." },
  { flag: "🇨🇳", origin: "Proverbe chinois", text: "Aimer profondément quelqu'un donne force ; être profondément aimé de quelqu'un donne courage.", meaning: "Chaque direction de l'amour apporte un don différent — l'un fortifie, l'autre libère." },
  { flag: "🌍", origin: "Proverbe africain", text: "Si tu veux aller vite, marche seul. Si tu veux aller loin, marche ensemble.", meaning: "Deux personnes unies par l'amour vont infiniment plus loin que l'un ou l'autre seul." },
];

const MINI_MOMENTS_DATA = [
  { emoji: "☕", text: "Le café qu'on prépare pour l'autre sans demander" },
  { emoji: "📱", text: "Le message du matin qui réchauffe toute la journée" },
  { emoji: "😴", text: "S'endormir en se tenant la main" },
  { emoji: "🎵", text: "Quand une chanson nous ramène à un souvenir" },
  { emoji: "🍽️", text: "Partager le même plat en sachant lequel l'autre préfère" },
  { emoji: "😂", text: "Ces fous rires qu'on ne sait plus expliquer" },
  { emoji: "🚗", text: "Les trajets où le silence est confortable" },
  { emoji: "👀", text: "Ce regard qui veut dire « je suis là »" },
  { emoji: "🌧️", text: "Rester dedans quand il pleut dehors" },
  { emoji: "🤝", text: "Se tenir la main dans la rue, comme ça, naturellement" },
  { emoji: "🌅", text: "Regarder le coucher de soleil sans rien dire" },
  { emoji: "📸", text: "Prendre des photos sans que l'autre sache" },
  { emoji: "🍫", text: "Se souvenir de ce que l'autre aime sans avoir à demander" },
  { emoji: "🌺", text: "Un geste doux qui dit « je t'aime » sans un mot" },
  { emoji: "⭐", text: "Compter les étoiles ensemble en faisant des projets" },
  { emoji: "🫂", text: "Ces câlins qui durent un peu trop longtemps — et c'est bien" },
];

const LOVE_METER_MSGS = [
  { min: 0,   max: 5,   msg: "Clique pour commencer ♡",               emojis: "" },
  { min: 5,   max: 20,  msg: "Ton amour commence à vibrer…",          emojis: "♡" },
  { min: 20,  max: 50,  msg: "Ça chauffe ! Elle reçoit tout ça ♡",   emojis: "♡ ♥" },
  { min: 50,  max: 100, msg: "Wow, tant d'amour ! 🌸",                emojis: "♡ ♥ 💕" },
  { min: 100, max: 200, msg: "Incroyable… ton cœur est immense !",    emojis: "♡ ♥ 💕 🌸" },
  { min: 200, max: 500, msg: "Tu l'aimes à l'infini c'est clair 💫",  emojis: "♡ ♥ 💕 🌸 ✨" },
  { min: 500, max: Infinity, msg: "Aucune mesure ne peut contenir cet amour ♾️", emojis: "♡ ♥ 💕 🌸 ✨ 💖" },
];

const LOVE_METER_PROVERBES = [
  { text: "L'amour ne connaît pas de mesure.", src: "Saint Bernard" },
  { text: "Aimer, c'est ne pas compter.", src: "Jean Cocteau" },
  { text: "Le cœur a ses raisons que la raison ne connaît point.", src: "Pascal" },
  { text: "On ne voit bien qu'avec le cœur.", src: "Saint-Exupéry" },
  { text: "Là où il y a amour, il y a vie.", src: "Gandhi" },
  { text: "Aimer, c'est choisir l'autre encore et encore.", src: "Sagesse moderne" },
];

/* ── BANDEAU TICKER ── */
function initProvTicker() {
  const inner = document.getElementById('provTickerInner');
  if (!inner) return;
  // Dupliquer pour boucle infinie
  const items = [...ALL_PROVERBES, ...ALL_PROVERBES];
  items.forEach((p, i) => {
    const span = document.createElement('span');
    span.className = 'proverbe-ticker-item';
    span.innerHTML = `<span class="ti-icon">${p.icon}</span><em>${p.text}</em><span class="ti-src">— ${p.src}</span>`;
    inner.appendChild(span);
    if (i < items.length - 1) {
      const sep = document.createElement('span');
      sep.className = 'proverbe-ticker-sep';
      sep.textContent = '✦';
      inner.appendChild(sep);
    }
  });
}

/* ── CITATION DU JOUR ── */
function initCitationJour() {
  const cjText   = document.getElementById('cjText');
  const cjAuthor = document.getElementById('cjAuthor');
  const cjDots   = document.getElementById('cjDots');
  const cjBar    = document.getElementById('cjBar');
  if (!cjText) return;

  const data = ALL_PROVERBES;
  let cur = 0, timer, barTimer;

  data.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'cj-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goCJ(i));
    cjDots && cjDots.appendChild(d);
  });

  function goCJ(n) {
    cjText.classList.add('fading');
    cjAuthor.classList.add('fading');
    clearTimeout(timer); clearTimeout(barTimer);
    cjBar.classList.remove('animating'); cjBar.style.width = '0';

    setTimeout(() => {
      cur = n;
      cjText.textContent = `« ${data[cur].text} »`;
      cjAuthor.textContent = `— ${data[cur].src}`;
      cjText.classList.remove('fading');
      cjAuthor.classList.remove('fading');
      document.querySelectorAll('.cj-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
      // Relancer barre
      requestAnimationFrame(() => {
        cjBar.classList.add('animating');
      });
      timer = setTimeout(() => goCJ((cur + 1) % data.length), 6200);
    }, 300);
  }

  document.getElementById('cjPrev') && (document.getElementById('cjPrev').onclick = () => goCJ((cur - 1 + data.length) % data.length));
  document.getElementById('cjNext') && (document.getElementById('cjNext').onclick = () => goCJ((cur + 1) % data.length));

  goCJ(0);
}

/* ── MINI MOMENTS FRISE ── */
function initMiniMoments() {
  const t1 = document.getElementById('mmTrack1');
  const t2 = document.getElementById('mmTrack2');
  if (!t1 || !t2) return;

  function buildTrack(el, items) {
    // Dupliquer pour loop
    [...items, ...items].forEach(m => {
      const d = document.createElement('div');
      d.className = 'mm-item';
      d.innerHTML = `<span class="mm-emoji">${m.emoji}</span><p class="mm-text">${m.text}</p>`;
      el.appendChild(d);
    });
  }

  buildTrack(t1, MINI_MOMENTS_DATA.slice(0, 8));
  buildTrack(t2, MINI_MOMENTS_DATA.slice(8));
}

/* ── PROVERBES DU MONDE ── */
function initProverbesMonde() {
  const grid = document.getElementById('pmGrid');
  if (!grid) return;
  PROVERBES_MONDE.forEach(p => {
    const c = document.createElement('div');
    c.className = 'pm-card reveal';
    c.innerHTML = `
      <span class="pm-flag">${p.flag}</span>
      <span class="pm-origin">${p.origin}</span>
      <p class="pm-text">« ${p.text} »</p>
      <p class="pm-meaning">${p.meaning}</p>`;
    grid.appendChild(c);
  });
}

/* ── LOVE METER ── */
function initLoveMeter() {
  const btn  = document.getElementById('lmHeart');
  const cnt  = document.getElementById('lmCount');
  const bar  = document.getElementById('lmBar');
  const msg  = document.getElementById('lmMsg');
  const emj  = document.getElementById('lmEmojis');
  const pt   = document.getElementById('lmProvText');
  const ps   = document.getElementById('lmProvSrc');
  if (!btn) return;

  let count = 0, pIdx = 0;

  function spawnParticle() {
    const p = document.createElement('span');
    p.textContent = ['♡','♥','💕','✨','🌸'][Math.floor(Math.random()*5)];
    const rect = btn.getBoundingClientRect();
    p.style.cssText = `
      position:fixed;left:${rect.left + rect.width/2}px;top:${rect.top}px;
      font-size:${16+Math.random()*12}px;pointer-events:none;z-index:9999;
      animation:clickPop .9s ease forwards;
      --tx:${(Math.random()-.5)*80}px;--ty:${-50-Math.random()*60}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }

  btn.addEventListener('click', () => {
    count++;
    cnt.textContent = count.toLocaleString('fr-FR');
    btn.classList.add('burst');
    setTimeout(() => btn.classList.remove('burst'), 400);

    // Barre de progression (max 500)
    const pct = Math.min((count / 500) * 100, 100);
    bar.style.width = pct + '%';

    // Message et emojis
    const stage = LOVE_METER_MSGS.find(s => count >= s.min && count < s.max) || LOVE_METER_MSGS[LOVE_METER_MSGS.length-1];
    msg.textContent = stage.msg;
    emj.textContent = stage.emojis;

    // Proverbe tous les 20 clics
    if (count % 20 === 0) {
      pIdx = (pIdx + 1) % LOVE_METER_PROVERBES.length;
      pt.textContent = `« ${LOVE_METER_PROVERBES[pIdx].text} »`;
      ps.textContent = `— ${LOVE_METER_PROVERBES[pIdx].src}`;
    }

    // Particules
    for (let i = 0; i < 3; i++) setTimeout(spawnParticle, i * 60);
  });
}

/* ── LANCEMENT ── */
(function initV2() {
  initProvTicker();
  initCitationJour();
  initMiniMoments();
  initProverbesMonde();
  initLoveMeter();
})();

/* Helper: anime un nombre */

function animNum(el, target, dur) {
  if (!el) return;
  let s = null;
  (function step(ts) {
    if (!s) s = ts;
    const p = Math.min((ts - s) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1-p, 3)) * target).toLocaleString('fr-FR');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('fr-FR');
  })(performance.now());
}
