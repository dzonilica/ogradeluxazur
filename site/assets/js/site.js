/* ==========================================================================
   LUX AZUR - site behaviour
   --------------------------------------------------------------------------
   >>> PODESITE OVDE <<<  (popunite svoje podatke, sve ostalo radi samo)
   Prazno polje se automatski SAKRIVA na sajtu, ne prikazuje se prazno.
   ========================================================================== */
const SITE = {
  instagram: "https://www.instagram.com/ograde_lux_azur/",
  instagramHandle: "@ograde_lux_azur",

  phone:     "",   // npr. "+381 62 123 456"
  email:     "",   // npr. "info@luxazur.rs"
  address:   "",   // npr. "Kralja Petra 12, Kragujevac"
  hours:     "Pon–sub, 08–18 h",

  // Endpoint za slanje forme (Formspree, Getform, Web3Forms, vaš PHP…).
  // Ako je prazno, umesto forme prikazuje se kontakt preko Instagrama.
  formEndpoint: ""
};

/* ========================================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- 0. loader ---------- */
function loader() {
  const el = $(".loader");
  if (!el) return;
  const root = document.documentElement;

  // bez klase js-loading (nije prvi ulazak), sklanjamo odmah
  if (!root.classList.contains("js-loading")) { el.remove(); return; }
  try { sessionStorage.setItem("la_seen", "1"); } catch (e) {}

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    el.classList.add("is-done");
    // js-loading ostaje dok traje izlazna animacija, inace bi .loader
    // odmah dobio display:none i rez se ne bi ni video
    setTimeout(() => {
      root.classList.remove("js-loading");
      el.remove();
    }, 900);
  };

  const MIN = 820;
  const t0 = performance.now();
  const onReady = () => setTimeout(finish, Math.max(0, MIN - (performance.now() - t0)));

  if (document.readyState === "complete") onReady();
  else addEventListener("load", onReady, { once: true });

  setTimeout(finish, 4500);          // sigurnosni prekid
}

/* ---------- 1. kontakt podaci u DOM ---------- */
function hydrateContacts() {
  const map = {
    phone:   { href: v => "tel:" + v.replace(/[^\d+]/g, ""), val: SITE.phone },
    email:   { href: v => "mailto:" + v,                     val: SITE.email },
    address: { href: v => "https://maps.google.com/?q=" + encodeURIComponent(v), val: SITE.address },
    hours:   { href: null,                                   val: SITE.hours },
    instagram: { href: () => SITE.instagram,                 val: SITE.instagramHandle }
  };

  $$("[data-contact]").forEach(el => {
    const cfg = map[el.dataset.contact];
    if (!cfg || !cfg.val) { el.remove(); return; }
    const slot = el.querySelector("[data-value]") || el;
    slot.textContent = cfg.val;
    const link = el.tagName === "A" ? el : slot.tagName === "A" ? slot : null;
    if (cfg.href && link) link.href = cfg.href(cfg.val);
  });

  $$("[data-href-instagram]").forEach(a => { a.href = SITE.instagram; });
}

/* ---------- 2. nav: tamna preko hero-a, svetla preko sadržaja ---------- */
function navInvert() {
  const nav = $(".nav");
  const hero = $("[data-nav-dark]");
  if (!nav) return;
  if (!hero) { nav.classList.remove("nav--dark"); return; }

  const check = () => {
    const h = hero.getBoundingClientRect();
    nav.classList.toggle("nav--dark", h.bottom > 84);
  };
  check();
  addEventListener("scroll", check, { passive: true });
  addEventListener("resize", check);
}

/* ---------- 3. mobilni meni ---------- */
function drawer() {
  const burger = $(".nav__burger");
  if (!burger) return;
  const close = () => {
    document.body.classList.remove("menu-open");
    document.documentElement.classList.remove("no-scroll");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    document.documentElement.classList.toggle("no-scroll", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  $$(".drawer a").forEach(a => a.addEventListener("click", close));
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

/* ---------- 4. tabovi (feature kartica + proces) ---------- */
function tabs(tabSel, groupAttr, onChange) {
  const groups = {};
  $$(tabSel).forEach(t => {
    const g = t.getAttribute(groupAttr) || "default";
    (groups[g] = groups[g] || []).push(t);
  });

  Object.values(groups).forEach(list => {
    const select = i => {
      list.forEach((t, k) => t.setAttribute("aria-selected", String(k === i)));
      if (onChange) onChange(list[i], i, list);
    };
    list.forEach((t, i) => {
      t.addEventListener("click", () => select(i));
      t.addEventListener("keydown", e => {
        const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1
                : e.key === "ArrowLeft"  || e.key === "ArrowUp"   ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const next = (i + d + list.length) % list.length;
        list[next].focus();
        select(next);
      });
    });
    select(list.findIndex(t => t.getAttribute("aria-selected") === "true") < 0
      ? 0
      : list.findIndex(t => t.getAttribute("aria-selected") === "true"));
  });
}

/* ---------- 5. proces panel (slika/video prati tab) ---------- */
function processPanel() {
  const panel = $("[data-panel]");
  if (!panel) return;
  const shots = $$("[data-shot]", panel);

  tabs(".ptab", "data-group", tab => {
    const key = tab.dataset.shot;
    shots.forEach(s => {
      const on = s.dataset.shot === key;
      s.classList.toggle("is-on", on);
      const v = s.querySelector("video");
      if (v) { on ? v.play().catch(() => {}) : v.pause(); }
    });
  });
}

/* ---------- 6. karusel šara ---------- */
function carousel() {
  const track = $("[data-carousel]");
  if (!track) return;
  const prev = $("[data-c-prev]"), next = $("[data-c-next]");
  const step = () => (track.firstElementChild?.offsetWidth || 300) + 12;

  const sync = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max;
  };
  prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next?.addEventListener("click", () => track.scrollBy({ left:  step(), behavior: "smooth" }));
  track.addEventListener("scroll", sync, { passive: true });
  addEventListener("resize", sync);
  sync();
}

/* ---------- 7. galerija: filter + lightbox ---------- */
function gallery() {
  const grid = $("[data-gallery]");
  if (!grid) return;

  const items = $$(".gitem", grid);

  $$("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      $$("[data-filter]").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      items.forEach(it => it.classList.toggle("is-hidden", f !== "sve" && it.dataset.cat !== f));
    });
  });

  /* lightbox */
  const lb   = $(".lb");
  if (!lb) return;
  const img  = $(".lb img", lb);
  const cap  = $(".lb__cap", lb);
  let idx = 0, visible = [];
  let lastFocus = null;

  const show = i => {
    visible = items.filter(it => !it.classList.contains("is-hidden"));
    idx = (i + visible.length) % visible.length;
    const src = visible[idx].dataset.full;
    img.src = src;
    img.alt = visible[idx].querySelector("img")?.alt || "";
    cap.textContent = `${visible[idx].dataset.caption} (${idx + 1}/${visible.length})`;
  };
  const open = i => {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add("is-open");
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
    $(".lb__x", lb).focus();
  };
  const close = () => {
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
    lastFocus?.focus();
  };

  const openItem = it => {
    visible = items.filter(x => !x.classList.contains("is-hidden"));
    open(visible.indexOf(it));
  };
  items.forEach(it => {
    it.addEventListener("click", () => openItem(it));
    it.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      openItem(it);
    });
  });

  $(".lb__x", lb).addEventListener("click", close);
  $(".lb__p", lb).addEventListener("click", () => show(idx - 1));
  $(".lb__n", lb).addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  addEventListener("keydown", e => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape")     close();
    if (e.key === "ArrowLeft")  show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
}

/* ---------- 8. forma ---------- */
function contactForm() {
  const form = $("[data-form]");
  if (!form) return;
  if (!SITE.formEndpoint) return;

  form.hidden = false;
  $("[data-contact-fallback]")?.remove();
  const msg = $(".form__msg", form);

  const say = text => { msg.textContent = text; msg.classList.add("is-on"); };

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const btn = $("button[type=submit]", form);
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = "Slanje…";

    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      say("Hvala. Vaš upit je poslat.");
    } catch {
      say("Slanje nije uspelo. Pokušajte ponovo ili nam pišite na Instagram.");
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  });
}

/* ---------- 9. reveal on scroll ---------- */
function reveal() {
  const els = $$(".rv");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      obs.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .06 });
  els.forEach(el => io.observe(el));
}

/* ---------- 10. sticky index (proizvodi) ---------- */
function stickyIndex() {
  const links = $$(".sticky-idx a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle("is-on", a.hash === "#" + en.target.id));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  links.forEach(a => { const t = $(a.hash); if (t) io.observe(t); });
}

/* ---------- 11. godina u footeru ---------- */
function year() {
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
}

/* ---------- 12. paralaksa ----------
   Moderni pregledaci (Chrome, Edge, Safari 26+) sve rade u CSS-u, preko
   scroll-driven animacije, van glavne niti - tamo ova funkcija odmah izlazi.
   Na starijim pregledacima isti pomeraj upisujemo sami, ali samo za slike
   koje su trenutno na ekranu i samo jednom po kadru.
   Hod se cita iz CSS-a (--plx-t), da vrednost stoji na jednom mestu.
------------------------------------------------------------------------- */
function parallax() {
  const boxes = $$(".plx");
  if (!boxes.length) return;
  if (window.CSS && CSS.supports && CSS.supports("animation-timeline: view()")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = boxes
    .map(box => ({ box, el: box.querySelector(":scope > picture, :scope > img"), t: 0 }))
    .filter(it => it.el);
  if (!items.length) return;

  const measure = () => items.forEach(it => {
    it.t = parseFloat(getComputedStyle(it.el).getPropertyValue("--plx-t")) || 0;
  });

  const live = new Set();
  let raf = 0;

  const frame = () => {
    raf = 0;
    const vh = innerHeight;
    live.forEach(it => {
      const r = it.box.getBoundingClientRect();
      // 0 = tek ulazi odozdo, 1 = tek je izasla gore
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      it.box.style.setProperty("--plx-y", ((p * 2 - 1) * it.t).toFixed(2) + "%");
    });
  };
  const ask = () => { if (!raf && live.size) raf = requestAnimationFrame(frame); };

  measure();

  if ("IntersectionObserver" in window) {
    const byNode = new Map(items.map(it => [it.box, it]));
    const io = new IntersectionObserver(ents => {
      ents.forEach(e => {
        const it = byNode.get(e.target);
        e.isIntersecting ? live.add(it) : live.delete(it);
      });
      ask();
    }, { rootMargin: "15% 0px" });
    items.forEach(it => io.observe(it.box));
  } else {
    items.forEach(it => live.add(it));
  }

  addEventListener("scroll", ask, { passive: true });
  addEventListener("resize", () => { measure(); ask(); });
  ask();
}

/* ---------- 13. video: skida se i pusta samo kada dodje na ekran ---------- */
function lazyVideo() {
  const vids = $$("video[data-lazy]");
  if (!vids.length || !("IntersectionObserver" in window)) {
    vids.forEach(v => v.play().catch(() => {}));
    return;
  }
  const io = new IntersectionObserver(ents => {
    ents.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (v.preload !== "auto") v.preload = "auto";
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: .35 });
  vids.forEach(v => io.observe(v));
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loader();
  hydrateContacts();
  navInvert();
  drawer();
  tabs(".ftab", "data-group");
  processPanel();
  carousel();
  gallery();
  contactForm();
  reveal();
  stickyIndex();
  parallax();
  lazyVideo();
  year();
});
