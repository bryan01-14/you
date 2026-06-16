/* ===========================
   LOVE SITE — script.js
   =========================== */

const START = new Date('2023-06-21T00:00:00');
function diffDays()   { return Math.floor((Date.now() - START) / 864e5); }
function diffMonths() { return Math.floor(diffDays() / 30.44); }

/* ══════════════════════════════════════════════════
   SPLASH SCREEN — LE CLIC DÉCLENCHE LE SON
   C'est la SEULE façon fiable de jouer du son
   sur tous les navigateurs (Chrome, Safari, Firefox)
   ══════════════════════════════════════════════════ */
const MUS = document.getElementById('bgMusic');
const splash = document.getElementById('splashScreen');
const splashBtn = document.getElementById('splashBtn');

function startEverything() {
  // 1. Jouer la musique (garanti car c'est dans un handler de clic user)
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
      .catch(e => console.log('Audio error:', e));

    // Sécurité : redémarrer si le son s'arrête malgré loop
    MUS.addEventListener('ended', () => {
      MUS.currentTime = 0;
      MUS.play().catch(() => {});
    });
  }
  // 2. Cacher le splash
  if (splash) {
    splash.classList.add('hide');
    setTimeout(() => { splash.style.display = 'none'; }, 900);
  }
  // 3. Lancer les animations du site
  initSite();
}

if (splashBtn) splashBtn.addEventListener('click', startEverything);
// Aussi si on clique ailleurs sur le splash
if (splash) splash.addEventListener('click', function(e) {
  if (e.target === splash) startEverything();
});

/* Petals on splash */
const splashPetals = document.getElementById('splashPetals');
if (splashPetals) {
  ['🌸','🌺','🌷','✿','❀'].forEach((p, i) => {
    const el = document.createElement('span');
    el.style.cssText = `position:absolute;top:-20px;left:${10+i*20}%;font-size:${14+Math.random()*14}px;animation:petalFall ${6+Math.random()*8}s ${Math.random()*5}s linear infinite;opacity:0`;
    el.textContent = p;
    splashPetals.appendChild(el);
  });
}

/* ══════════════════════════════════
   INIT SITE (appelé après splash)
   ══════════════════════════════════ */
function initSite() {

  /* --- COUNTERS --- */
  const hcD = document.getElementById('hcDays');
  const hcM = document.getElementById('hcMonths');
  if (hcD) hcD.textContent = diffDays().toLocaleString('fr-FR');
  if (hcM) hcM.textContent = diffMonths();

  /* --- FLOATING HEARTS --- */
  const fl = document.getElementById('floatingLayer');
  const chars = ['♡','♥','💕','💗','💓','🌸','✨','🌺','💫'];
  if (fl) for (let i = 0; i < 45; i++) {
    const h = document.createElement('span');
    h.className = 'fh';
    h.textContent = chars[Math.floor(Math.random()*chars.length)];
    h.style.cssText = `left:${Math.random()*100}vw;font-size:${10+Math.random()*18}px;animation-duration:${9+Math.random()*14}s;animation-delay:${Math.random()*14}s`;
    fl.appendChild(h);
  }

  /* --- SPARKLES --- */
  const sl = document.getElementById('sparkLayer');
  if (sl) for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const sz = 2+Math.random()*5;
    s.style.cssText = `left:${Math.random()*100}vw;top:${Math.random()*100}vh;width:${sz}px;height:${sz}px;animation-duration:${2+Math.random()*5}s;animation-delay:${Math.random()*7}s;background:${Math.random()>.5?'#e8507a':'#f4a0c0'}`;
    sl.appendChild(s);
  }

  /* --- HERO PETALS --- */
  const hp = document.getElementById('heroPetals');
  const pc = ['🌸','🌺','💮','🌷','✿'];
  if (hp) for (let i = 0; i < 26; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = pc[Math.floor(Math.random()*pc.length)];
    p.style.cssText = `left:${Math.random()*100}%;font-size:${13+Math.random()*16}px;animation-duration:${6+Math.random()*10}s;animation-delay:${Math.random()*10}s`;
    hp.appendChild(p);
  }

  /* --- CANVAS BG --- */
  const cv = document.getElementById('bgCanvas');
  if (cv) {
    const ctx = cv.getContext('2d');
    const orbs = Array.from({length:5}, () => ({
      x:Math.random(), y:Math.random(),
      vx:(Math.random()-.5)*.0003, vy:(Math.random()-.5)*.0003,
      r:.25+Math.random()*.2, c:Math.random()>.5?'#f8c0d8':'#fde8f0'
    }));
    function resz() { cv.width=window.innerWidth; cv.height=document.body.scrollHeight; }
    resz(); window.addEventListener('resize', resz);
    (function draw() {
      ctx.clearRect(0,0,cv.width,cv.height);
      orbs.forEach(o => {
        o.x+=o.vx; o.y+=o.vy;
        if(o.x<0||o.x>1) o.vx*=-1; if(o.y<0||o.y>1) o.vy*=-1;
        const g=ctx.createRadialGradient(o.x*cv.width,o.y*cv.height,0,o.x*cv.width,o.y*cv.height,o.r*Math.min(cv.width,cv.height));
        g.addColorStop(0,o.c+'99'); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.fillRect(0,0,cv.width,cv.height);
      });
      requestAnimationFrame(draw);
    })();
  }

  /* --- GALLERY --- */
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
    {src:'images/photo26.jpg', label:'Elle, face au monde',      icon:'🖤'},
    {src:'images/photo27.jpg', label:'Son sourire, mon tout',    icon:'💖'},
    {src:'images/photo28.jpg', label:'Notre gâteau d\'amour',    icon:'🎂'},
    {src:'images/photo29.jpg', label:'HBD Abraham ♡',           icon:'🎉'},
    {src:'images/photo30.jpg', label:'Le jour de tes vœux',     icon:'🕯️'},
    {src:'images/photo31.jpg', label:'Nos instants ensemble',   icon:'🍿'},
  ];

  const gg = document.getElementById('galleryGrid');
  if (gg) photoData.forEach((ph,i) => {
    const d = document.createElement('div');
    d.className = 'polaroid reveal';
    d.innerHTML = `<div class="polaroid-img-wrap"><img src="${ph.src}" alt="${ph.label}" loading="lazy" onerror="this.closest('.polaroid').style.display='none'"></div><span class="polaroid-heart">${ph.icon}</span><div class="polaroid-label">${ph.label}</div>`;
    d.addEventListener('click', () => openLB(i));
    gg.appendChild(d);
  });

  /* --- LIGHTBOX --- */
  let lbIdx = 0;
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCaption');
  function openLB(i) {
    lbIdx = i; lbImg.src = photoData[i].src;
    if (lbCap) lbCap.textContent = photoData[i].label+' '+photoData[i].icon;
    lb.classList.add('active'); document.body.style.overflow = 'hidden';
  }
  function closeLB() { lb.classList.remove('active'); document.body.style.overflow = ''; }
  document.getElementById('lbClose') && (document.getElementById('lbClose').onclick = closeLB);
  lb && lb.addEventListener('click', e => { if(e.target===lb) closeLB(); });
  document.getElementById('lbPrev') && (document.getElementById('lbPrev').onclick = () => {
    lbIdx=(lbIdx-1+photoData.length)%photoData.length; lbImg.src=photoData[lbIdx].src;
    if(lbCap) lbCap.textContent=photoData[lbIdx].label+' '+photoData[lbIdx].icon;
  });
  document.getElementById('lbNext') && (document.getElementById('lbNext').onclick = () => {
    lbIdx=(lbIdx+1)%photoData.length; lbImg.src=photoData[lbIdx].src;
    if(lbCap) lbCap.textContent=photoData[lbIdx].label+' '+photoData[lbIdx].icon;
  });
  document.addEventListener('keydown', e => {
    if(!lb||!lb.classList.contains('active')) return;
    if(e.key==='Escape') closeLB();
    if(e.key==='ArrowLeft') document.getElementById('lbPrev')&&document.getElementById('lbPrev').click();
    if(e.key==='ArrowRight') document.getElementById('lbNext')&&document.getElementById('lbNext').click();
  });

  /* --- VIDEOS --- */
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
  if (vg) vidData.forEach(v => {
    const c = document.createElement('div');
    c.className = 'vid-card reveal';
    c.innerHTML = `<video src="${v.src}" controls preload="metadata" playsinline onerror="this.closest('.vid-card').style.display='none'"></video><div class="vid-label">${v.label}</div>`;
    vg.appendChild(c);
  });

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
  let qCur=0, qT;
  if (qc) {
    quotesData.forEach((q,i) => {
      const s = document.createElement('div');
      s.className='q-slide'+(i===0?' active':'');
      s.innerHTML=`<div class="q-text">${q.text}<span class="q-source">— ${q.src}</span></div>`;
      qc.appendChild(s);
      const dot = document.createElement('button');
      dot.className='q-dot'+(i===0?' active':'');
      dot.onclick=()=>goQ(i);
      qd&&qd.appendChild(dot);
    });
    function goQ(n) {
      const ss=qc.querySelectorAll('.q-slide'), dd=qd?qd.querySelectorAll('.q-dot'):[];
      ss[qCur].classList.remove('active'); ss[qCur].classList.add('out');
      dd[qCur]&&dd[qCur].classList.remove('active');
      setTimeout(()=>ss[qCur].classList.remove('out'),600);
      qCur=n; ss[qCur].classList.add('active'); dd[qCur]&&dd[qCur].classList.add('active');
      clearInterval(qT); qT=setInterval(()=>goQ((qCur+1)%quotesData.length),4500);
    }
    qT=setInterval(()=>goQ((qCur+1)%quotesData.length),4500);
  }

  /* --- HEARTS RAIN --- */
  const fr = document.getElementById('finalRain');
  if (fr) {
    ['♡','♥','💕','💗','❤️','🌸','✨'].forEach((c,i) => {
      const h = document.createElement('span');
      h.className='hr-drop';
      h.textContent=c;
      h.style.cssText=`left:${5+i*13}%;font-size:${12+Math.random()*14}px;animation-duration:${4+Math.random()*8}s;animation-delay:${Math.random()*8}s`;
      fr.appendChild(h);
    });
  }

  /* --- MUSIC PLAYER BUTTON --- */
  const mpBtn = document.getElementById('mpBtn');
  const mpVinyl = document.getElementById('mpVinyl');
  if (mpBtn && MUS) {
    mpBtn.addEventListener('click', () => {
      if (MUS.paused) {
        MUS.play(); if(mpVinyl) mpVinyl.classList.add('spinning'); mpBtn.textContent='⏸';
      } else {
        MUS.pause(); if(mpVinyl) mpVinyl.classList.remove('spinning'); mpBtn.textContent='▶';
      }
    });
  }

  /* --- SECRET WORDS POPUP --- */
  const popup = document.getElementById('secretPopup');
  const popupText = document.getElementById('secretPopupText');
  const popupClose = document.getElementById('secretClose');

  document.querySelectorAll('.secret-word').forEach(sw => {
    sw.addEventListener('click', e => {
      e.stopPropagation();
      const msg = sw.dataset.secret;
      if (msg && popup && popupText) {
        popupText.textContent = msg;
        popup.classList.add('active');
      }
    });
  });
  popupClose && popupClose.addEventListener('click', () => popup.classList.remove('active'));
  popup && popup.addEventListener('click', e => { if(e.target===popup) popup.classList.remove('active'); });

  /* --- CLICK HEARTS --- */
  document.addEventListener('click', e => {
    if (e.target.closest('.secret-word') || e.target.closest('.secret-popup') || e.target.closest('.splash')) return;
    for (let i=0;i<5;i++) {
      const h=document.createElement('span');
      h.className='click-heart';
      h.textContent=['♡','♥','💕'][Math.floor(Math.random()*3)];
      h.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;--tx:${(Math.random()-.5)*80}px;--ty:${-40-Math.random()*60}px;font-size:${12+Math.random()*12}px`;
      document.body.appendChild(h);
      setTimeout(()=>h.remove(),900);
    }
  });

  /* --- SCROLL REVEAL --- */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.classList.add('visible');
        if(e.target.classList.contains('stats-section') && !window._statsRan) {
          window._statsRan=true;
          animNum(document.getElementById('sDays'), diffDays(), 1800);
          animNum(document.getElementById('sMonths'), diffMonths(), 1400);
        }
      }
    });
  }, {threshold:0.1});
  document.querySelectorAll('.reveal, .stats-section').forEach(el=>ro.observe(el));

  /* Observer pour les éléments ajoutés dynamiquement */
  new MutationObserver(()=>{
    document.querySelectorAll('.reveal:not([data-obs])').forEach(el=>{el.dataset.obs='1';ro.observe(el);});
  }).observe(document.body,{childList:true,subtree:true});

  /* --- CURSOR CUSTOM --- */
  const cur = document.getElementById('cursor');
  const curt = document.getElementById('cursorTrail');
  let mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  if(cur){(function ac(){tx+=(mx-tx)*.15;ty+=(my-ty)*.15;cur.style.cssText=`left:${mx}px;top:${my}px`;curt.style.cssText=`left:${tx}px;top:${ty}px`;requestAnimationFrame(ac);})();}

} /* fin initSite */

/* --- HELPER: animate number --- */
function animNum(el, target, dur) {
  if(!el) return;
  let s=null;
  (function step(ts){
    if(!s)s=ts;
    const p=Math.min((ts-s)/dur,1);
    el.textContent=Math.floor((1-Math.pow(1-p,3))*target).toLocaleString('fr-FR');
    if(p<1) requestAnimationFrame(step);
    else el.textContent=target.toLocaleString('fr-FR');
  })(performance.now());
}
