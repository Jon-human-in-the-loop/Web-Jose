/* ATELIER NOIR — micro-interaction layer (dependency-free, ~1KB) */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Nav condenses + deepens once you leave the top */
  var nav = document.querySelector("nav");
  if(nav){
    var onScroll = function(){ nav.classList.toggle("scrolled", window.scrollY > 32); };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive:true});
  }

  if(reduce) return;

  /* Magnetic pull on primary actions */
  var magnets = document.querySelectorAll(".btn-primary, .btn-nav, .btn-cta, .magnetic");
  magnets.forEach(function(el){
    var strength = 0.32;
    el.addEventListener("mousemove", function(e){
      var r = el.getBoundingClientRect();
      var mx = e.clientX - (r.left + r.width/2);
      var my = e.clientY - (r.top + r.height/2);
      el.style.transform = "translate(" + (mx*strength) + "px," + (my*strength) + "px)";
    });
    el.addEventListener("mouseleave", function(){ el.style.transform = ""; });
  });
})();

/* ============================================================
   COOKIE CONSENT + TRACKING GATE  (GDPR / RGPD ready)
   ------------------------------------------------------------
   To turn on tracking later, ONLY fill in the IDs in TRACKING below.
   Scripts load exclusively AFTER the matching category is consented.
   Public API:  window.AtelierConsent.open()  // reopen preferences
                window.AtelierConsent.get()   // {necessary,analytics,marketing}
                window.AtelierConsent.has("analytics")
   ============================================================ */
(function(){
  "use strict";

  /* ▼▼▼  FILL THESE IN WHEN READY — leave "" to keep disabled  ▼▼▼ */
  var TRACKING = {
    ga4:       "",   // Google Analytics 4   →  "G-XXXXXXXXXX"   (category: analytics)
    gtm:       "",   // Google Tag Manager   →  "GTM-XXXXXXX"    (category: analytics)
    metaPixel: ""    // Meta / Facebook Pixel →  "1234567890"    (category: marketing)
  };
  /* ▲▲▲ ─────────────────────────────────────────────────────── ▲▲▲ */

  var KEY = "atelierConsent";
  var DEFAULTS = { necessary:true, analytics:false, marketing:false };
  var loaded = { ga4:false, gtm:false, metaPixel:false };

  function read(){
    try{ var v=JSON.parse(localStorage.getItem(KEY)); if(v && typeof v==="object" && "analytics" in v) return v; }catch(e){}
    return null;
  }
  function persist(s){ try{ s.ts=Date.now(); localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }

  /* ---- Tracking loaders (invoked only when allowed) ---- */
  function loadGA4(id){
    if(loaded.ga4 || !id) return; loaded.ga4=true;
    var s=document.createElement("script"); s.async=true;
    s.src="https://www.googletagmanager.com/gtag/js?id="+id; document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
    window.gtag("js", new Date()); window.gtag("config", id);
  }
  function loadGTM(id){
    if(loaded.gtm || !id) return; loaded.gtm=true;
    window.dataLayer=window.dataLayer||[]; window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});
    var s=document.createElement("script"); s.async=true;
    s.src="https://www.googletagmanager.com/gtm.js?id="+id; document.head.appendChild(s);
  }
  function loadMetaPixel(id){
    if(loaded.metaPixel || !id) return; loaded.metaPixel=true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id); window.fbq("track","PageView");
  }
  function apply(s){
    if(s.analytics){ loadGA4(TRACKING.ga4); loadGTM(TRACKING.gtm); }
    if(s.marketing){ loadMetaPixel(TRACKING.metaPixel); }
  }

  /* ---- Public API ---- */
  window.AtelierConsent = {
    get:function(){ return read() || Object.assign({}, DEFAULTS); },
    has:function(c){ var s=read(); return !!(s && s[c]); },
    set:function(state){ var s=Object.assign({}, DEFAULTS, state, {necessary:true}); persist(s); apply(s); },
    open:function(){ build(true); }
  };

  /* ---- Copy (bilingual; data-es/data-en lets setLang re-translate live) ---- */
  var TXT={
    es:{ msg:"Usamos cookies para mejorar tu experiencia, recordar preferencias y analizar el tráfico. Vos elegís qué activar.",
      more:"Política de privacidad", acceptAll:"Aceptar todo", reject:"Rechazar", config:"Configurar", save:"Guardar preferencias",
      necessaryT:"Necesarias", necessaryD:"Imprescindibles para que el sitio funcione. Siempre activas.",
      analyticsT:"Analíticas", analyticsD:"Nos ayudan a entender cómo se usa el sitio (ej. Google Analytics).",
      marketingT:"Marketing", marketingD:"Permiten medir y personalizar anuncios (ej. Meta Pixel)." },
    en:{ msg:"We use cookies to improve your experience, remember preferences and analyze traffic. You choose what to enable.",
      more:"Privacy policy", acceptAll:"Accept all", reject:"Reject", config:"Customize", save:"Save preferences",
      necessaryT:"Necessary", necessaryD:"Essential for the site to work. Always on.",
      analyticsT:"Analytics", analyticsD:"Help us understand how the site is used (e.g. Google Analytics).",
      marketingT:"Marketing", marketingD:"Used to measure and personalize ads (e.g. Meta Pixel)." }
  };
  function curLang(){ try{return localStorage.getItem("lang")||"es";}catch(e){return "es";} }
  function L(){ return TXT[curLang()] || TXT.es; }
  function da(key){ return 'data-es="'+TXT.es[key]+'" data-en="'+TXT.en[key]+'"'; }

  function catRow(cat, locked, checked){
    var t=L();
    return '<div class="cc-row">'+
      '<div class="cc-row-txt"><strong '+da(cat+"T")+'>'+t[cat+"T"]+'</strong>'+
        '<span '+da(cat+"D")+'>'+t[cat+"D"]+'</span></div>'+
      '<button type="button" class="cc-switch'+(checked?" on":"")+(locked?" locked":"")+'" '+
        'data-cat="'+cat+'" role="switch" aria-checked="'+(checked?"true":"false")+'"'+(locked?" disabled":"")+'></button>'+
    '</div>';
  }

  var node=null;
  function build(openPanel){
    if(node){ if(openPanel) node.classList.add("expanded"); return; }
    var s = read() || DEFAULTS;
    var t = L();
    node=document.createElement("div");
    node.className="cookie-consent"+(openPanel?" expanded":"");
    node.setAttribute("role","dialog");
    node.setAttribute("aria-label","Cookies");
    node.innerHTML=
      '<p class="cookie-text"><span '+da("msg")+'>'+t.msg+'</span> '+
        '<a href="/privacy.html" class="cookie-link" '+da("more")+'>'+t.more+'</a></p>'+
      '<div class="cc-panel">'+
        catRow("necessary", true, true)+
        catRow("analytics", false, !!s.analytics)+
        catRow("marketing", false, !!s.marketing)+
      '</div>'+
      '<div class="cookie-actions">'+
        '<button type="button" class="cookie-btn cookie-config" '+da("config")+'>'+t.config+'</button>'+
        '<button type="button" class="cookie-btn cookie-reject" '+da("reject")+'>'+t.reject+'</button>'+
        '<button type="button" class="cookie-btn cookie-save" '+da("save")+'>'+t.save+'</button>'+
        '<button type="button" class="cookie-btn cookie-accept" '+da("acceptAll")+'>'+t.acceptAll+'</button>'+
      '</div>';

    // switch toggles
    node.querySelectorAll(".cc-switch:not(.locked)").forEach(function(sw){
      sw.addEventListener("click", function(){
        var on=sw.classList.toggle("on");
        sw.setAttribute("aria-checked", on?"true":"false");
      });
    });
    function readSwitches(){
      var o={};
      node.querySelectorAll(".cc-switch").forEach(function(sw){ o[sw.dataset.cat]=sw.classList.contains("on"); });
      return o;
    }
    function finish(state){
      window.AtelierConsent.set(state);
      node.classList.remove("show");
      setTimeout(function(){ if(node&&node.parentNode) node.parentNode.removeChild(node); node=null; }, 600);
    }
    node.querySelector(".cookie-config").addEventListener("click", function(){ node.classList.toggle("expanded"); });
    node.querySelector(".cookie-save").addEventListener("click", function(){ finish(readSwitches()); });
    node.querySelector(".cookie-reject").addEventListener("click", function(){ finish({analytics:false,marketing:false}); });
    node.querySelector(".cookie-accept").addEventListener("click", function(){ finish({analytics:true,marketing:true}); });

    document.body.appendChild(node);
    requestAnimationFrame(function(){ setTimeout(function(){ node.classList.add("show"); }, openPanel?0:450); });
  }

  /* ---- Boot: returning visitors → apply silently; new visitors → show banner ---- */
  var stored = read();
  if(stored) apply(stored);
  else build(false);
})();

/* ============================================================
   PREMIUM MOTION LAYER — scroll progress · custom cursor · smooth scroll
   ============================================================ */
(function(){
  "use strict";
  var mm = window.matchMedia;
  var reduce = mm && mm("(prefers-reduced-motion: reduce)").matches;
  var fine   = mm && mm("(hover:hover) and (pointer:fine)").matches;

  /* Scroll progress bar */
  (function(){
    var bar=document.createElement("div"); bar.className="al-progress"; document.body.appendChild(bar);
    function upd(){ var h=document.documentElement, max=h.scrollHeight-h.clientHeight, p=max>0?h.scrollTop/max:0; bar.style.transform="scaleX("+p.toFixed(4)+")"; }
    upd(); addEventListener("scroll",upd,{passive:true}); addEventListener("resize",upd,{passive:true});
  })();

  if(!fine || reduce) return;

  /* Custom cursor — native cursor hidden only after JS confirms (graceful if JS fails) */
  (function(){
    var dot=document.createElement("div"); dot.className="al-cursor-dot";
    var ring=document.createElement("div"); ring.className="al-cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add("has-cursor");
    var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener("mousemove",function(e){ mx=e.clientX;my=e.clientY; dot.style.transform="translate("+mx+"px,"+my+"px)"; },{passive:true});
    (function loop(){ rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18; ring.style.transform="translate("+rx+"px,"+ry+"px)"; requestAnimationFrame(loop); })();
    var sel="a,button,.btn-primary,.btn-ghost,.btn-nav,.btn-cta,.srv-row,.port-card,.faq-q,.calc-task-item,.calc-team-btn,.step-opt,.cc-switch,.cookie-btn,.t-card,.method-step,.lang-sw button,.chat-toggle,input,textarea,select,[onclick]";
    addEventListener("mouseover",function(e){ if(e.target.closest&&e.target.closest(sel)) document.body.classList.add("cursor-hover"); });
    addEventListener("mouseout", function(e){ if(e.target.closest&&e.target.closest(sel)) document.body.classList.remove("cursor-hover"); });
    addEventListener("mousedown",function(){document.body.classList.add("cursor-down");});
    addEventListener("mouseup",  function(){document.body.classList.remove("cursor-down");});
    addEventListener("mouseleave",function(){dot.style.opacity=ring.style.opacity=0;});
    addEventListener("mouseenter",function(){dot.style.opacity=ring.style.opacity=1;});
  })();

  /* Lenis smooth scroll (desktop only — mobile keeps native for carousels) */
  (function(){
    var s=document.createElement("script");
    s.src="/js/lenis.min.js";
    s.onload=function(){
      try{
        var lenis=new Lenis({ duration:1.1, easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));}, smoothWheel:true });
        (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(0);
        window.__lenis=lenis;
        /* Re-route in-page anchor scrolling through Lenis */
        if(typeof window.goTo==="function"){
          window.goTo=function(id){
            try{ if(typeof closeDrawer==="function") closeDrawer(); }catch(e){}
            var el=document.getElementById(id);
            if(el) lenis.scrollTo(el,{offset:-64});
          };
        }
      }catch(e){}
    };
    document.head.appendChild(s);
  })();
})();

/* ============================================================
   GENERATIVE HERO — drifting ember mesh-gradient (canvas, ~0 deps)
   ============================================================ */
(function(){
  "use strict";
  var hero=document.getElementById("inicio"); if(!hero) return;
  var reduce=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cv=document.createElement("canvas"); cv.className="al-hero-canvas";
  hero.insertBefore(cv, hero.firstChild);
  var ctx=cv.getContext("2d"); if(!ctx) return;
  var W=0,H=0,DPR=Math.min(window.devicePixelRatio||1,1.5);
  var palette=["255,92,53","255,122,82","194,65,12","237,234,227"];
  var orbs=[];
  for(var i=0;i<4;i++){
    orbs.push({ bx:Math.random()*0.9+0.05, by:Math.random()*0.9+0.05, r:0.34+Math.random()*0.32,
      c:palette[i%palette.length], a:(i===3?0.022:0.05), sx:0.3+Math.random()*0.5, sy:0.3+Math.random()*0.5,
      px:Math.random()*6.28, py:Math.random()*6.28 });
  }
  function resize(){ var r=hero.getBoundingClientRect(); W=cv.width=Math.max(1,r.width*DPR); H=cv.height=Math.max(1,r.height*DPR); cv.style.width=r.width+"px"; cv.style.height=r.height+"px"; }
  resize(); window.addEventListener("resize",resize,{passive:true});
  function draw(t){
    ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation="lighter";
    var big=Math.max(W,H);
    for(var i=0;i<orbs.length;i++){ var o=orbs[i];
      var x=(o.bx+Math.sin(t*0.00009*o.sx+o.px)*0.18)*W;
      var y=(o.by+Math.cos(t*0.00009*o.sy+o.py)*0.18)*H;
      var rad=o.r*big*0.5;
      var g=ctx.createRadialGradient(x,y,0,x,y,rad);
      g.addColorStop(0,"rgba("+o.c+","+o.a+")"); g.addColorStop(1,"rgba("+o.c+",0)");
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,rad,0,6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation="source-over";
  }
  var running=true, raf=0;
  function loop(){ if(!running) return; draw(performance.now()); raf=requestAnimationFrame(loop); }
  if("IntersectionObserver" in window){
    new IntersectionObserver(function(e){ running=e[0].isIntersecting; if(running && !reduce){ cancelAnimationFrame(raf); loop(); } }, {threshold:0}).observe(hero);
  }
  if(reduce) draw(2000); else loop();
})();

/* ============================================================
   AGENTE DEMO — pinned scroll-scrub: device grows, then chat advances
   (tellet-style). Desktop pins the scene; mobile shows it statically.
   ============================================================ */
(function(){
  "use strict";
  var wrap=document.querySelector(".iphone-wrap");
  var runway=document.querySelector(".demo-runway");
  var msgs=document.querySelector(".al-chat .chat-messages");
  var win=document.querySelector(".al-chat-window");
  if(!wrap||!runway) return;
  var reduce=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp(v,a,b){return v<a?a:(v>b?b:v);}

  var overflow=0;
  function measure(){ if(win&&msgs) overflow=Math.max(0, msgs.scrollHeight - win.clientHeight); }
  window.addEventListener("resize",measure,{passive:true});
  window.addEventListener("load",measure);
  setTimeout(measure,300); setTimeout(measure,1200); measure();

  var pinned=window.innerWidth>900;
  window.addEventListener("resize",function(){ pinned=window.innerWidth>900; });

  if(reduce){ if(msgs) msgs.style.transform="translateY(0)"; return; }

  wrap.style.willChange="transform";
  var t0=performance.now();
  function frame(t){
    var floatY=Math.sin((t-t0)*0.0011)*5;
    if(pinned){
      var r=runway.getBoundingClientRect();
      var dist=runway.offsetHeight-window.innerHeight;
      var p=dist>0?clamp(-r.top/dist,0,1):0;
      var pa=clamp(p/0.30,0,1);                 // phase A — grow to full size
      var sc=0.80+pa*0.20;
      wrap.style.transform="translateY("+floatY.toFixed(1)+"px) scale("+sc.toFixed(3)+")";
      var pb=clamp((p-0.30)/0.66,0,1);          // phase B — conversation advances
      if(msgs) msgs.style.transform="translateY("+(-pb*overflow).toFixed(1)+"px)";
    } else {
      wrap.style.transform="translateY("+floatY.toFixed(1)+"px)";
      if(msgs) msgs.style.transform="translateY(0)";
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ============================================================
   PREMIUM SOUND — soft hover ticks + per-section swells + mute toggle
   Web Audio, dependency-free. Unlocks on first gesture; remembers mute.
   ============================================================ */
(function(){
  "use strict";
  var AC=window.AudioContext||window.webkitAudioContext;
  if(!AC) return;
  var ctx=null, master=null;
  var enabled = (function(){ try{ return localStorage.getItem("al_sound")!=="off"; }catch(e){ return true; } })();

  function init(){
    if(ctx) return;
    ctx=new AC();
    master=ctx.createGain(); master.gain.value=0.6; master.connect(ctx.destination);
  }
  function unlock(){ init(); if(ctx && ctx.state==="suspended") ctx.resume(); }

  // a soft, lowpass-filtered tone with gentle attack + smooth decay
  function tone(freq, dur, gain, type, slideTo){
    if(!enabled || !ctx) return;
    var t=ctx.currentTime;
    var o=ctx.createOscillator(), g=ctx.createGain(), f=ctx.createBiquadFilter();
    o.type=type||"sine"; o.frequency.setValueAtTime(freq,t);
    if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
    f.type="lowpass"; f.frequency.setValueAtTime(2400,t);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.linearRampToValueAtTime(gain,t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(f); f.connect(g); g.connect(master);
    o.start(t); o.stop(t+dur+0.03);
  }
  // soft pad chord (two notes a fifth apart) — used entering a section
  function swell(base){
    if(!enabled || !ctx) return;
    tone(base, 0.42, 0.018, "sine");
    tone(base*1.5, 0.40, 0.012, "sine");
  }

  // hover pitch varies by element type → feels "designed"
  var lastHover=0;
  function hover(el){
    var now=ctx?ctx.currentTime:0;
    if(now-lastHover < 0.045) return;          // throttle (collapses double-fires)
    lastHover=now;
    var f=720;
    if(el.matches("a,.f-col a,.mega-item,.nav-center a,.lang-sw button")) f=900;
    else if(el.matches(".btn-primary,.btn-nav,.btn-cta,.drawer-cta")) f=540;
    else if(el.matches(".srv-row,.port-card,.t-card,.method-step,.prob-item")) f=640;
    else if(el.matches(".cc-switch,.al-send,.chat-toggle,.calc-team-btn,.filter-btn")) f=1040;
    tone(f, 0.07, 0.03, "sine");
  }

  /* expose + upgrade the legacy index playSound() to the premium engine */
  window.AtelierSound={
    enabled:function(){return enabled;},
    set:function(on){ enabled=on; try{localStorage.setItem("al_sound",on?"on":"off");}catch(e){} },
    hover:hover, swell:swell,
    click:function(){ unlock(); tone(620,0.12,0.07,"triangle",300); },
    open:function(){ unlock(); tone(523,0.1,0.05,"sine"); tone(784,0.16,0.04,"sine"); },
    success:function(){ unlock(); tone(523,0.1,0.05); tone(659,0.12,0.05); tone(784,0.18,0.05); }
  };
  window.playSound=function(name){
    unlock();
    if(name==="click") return window.AtelierSound.click();
    if(name==="chatOpen") return window.AtelierSound.open();
    if(name==="success") return window.AtelierSound.success();
    if(name==="hover"){ /* handled by delegation; ignore to avoid doubles */ return; }
  };

  /* unlock audio on first real gesture (browser autoplay policy) */
  ["pointerdown","keydown","touchstart"].forEach(function(ev){
    window.addEventListener(ev, unlock, {once:true, passive:true});
  });

  /* element hover micro-feedback (delegated, fires once per new element) */
  var HOVER_SEL="a,button,.btn-primary,.btn-ghost,.btn-nav,.btn-cta,.btn-back,.srv-row,.port-card,.t-card,.method-step,.prob-item,.faq-q,.calc-task-item,.calc-team-btn,.step-opt,.cc-switch,.cookie-btn,.lang-sw button,.chat-toggle,.filter-btn,.mega-item,.al-send";
  var lastEl=null;
  document.addEventListener("mouseover",function(e){
    var el=e.target.closest && e.target.closest(HOVER_SEL);
    if(el){ if(el!==lastEl){ lastEl=el; if(enabled) hover(el); } }
    else lastEl=null;
  });

  /* subtle swell when the cursor enters a new section */
  var sectFreqs=[174.6,196,220,246.9,261.6,293.7]; var si=0;
  document.querySelectorAll("section,.case-hero,.faq-hero,.port-hero").forEach(function(sec){
    sec.addEventListener("mouseenter",function(){ if(enabled){ swell(sectFreqs[si%sectFreqs.length]); si++; } });
  });

  /* mute toggle UI */
  var btn=document.createElement("button");
  btn.className="al-sound"+(enabled?"":" muted");
  btn.type="button";
  btn.setAttribute("aria-label","Sonido");
  btn.innerHTML=
    '<svg class="ic-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 6a8 8 0 0 1 0 12"/></svg>'+
    '<svg class="ic-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>';
  btn.addEventListener("click",function(){
    unlock();
    window.AtelierSound.set(!enabled);
    btn.classList.toggle("muted",!enabled);
    if(enabled){ tone(880,0.09,0.05,"sine"); }   // confirmation blip when turning on
  });
  function mount(){ if(document.body) document.body.appendChild(btn); }
  if(document.body) mount(); else window.addEventListener("DOMContentLoaded",mount);
})();
