# Lux Azur — sajt

Statički sajt (čist HTML/CSS/JS, bez build koraka). Otvara se direktno ili se kači na bilo koji hosting.

## Pokretanje lokalno

```bash
cd site
python -m http.server 8777
```

Zatim otvorite http://localhost:8777

> Dvoklik na `index.html` takođe radi, ali se video u sekciji „Proces“ i neke sitnice
> ponašaju bolje preko servera.

---

## 1. POPUNITE SVOJE PODATKE  ← jedino što je obavezno

Sve je na **jednom mestu**: vrh fajla `assets/js/site.js`

```js
const SITE = {
  instagram: "https://www.instagram.com/ograde_lux_azur/",
  instagramHandle: "@ograde_lux_azur",

  phone:   "",   // npr. "+381 62 123 456"
  email:   "",   // npr. "info@luxazur.rs"
  address: "",   // npr. "Kralja Petra 12, Kragujevac"
  hours:   "Pon–sub, 08–18 h",

  formEndpoint: ""
};
```

Polja koja ostavite **prazna automatski nestaju** sa sajta — ne prikazuje se prazan red.
Trenutno su prazni telefon, e-mail i adresa, pa se na sajtu vidi samo Instagram.

### Kontakt forma

Dok je `formEndpoint` prazan, na `kontakt.html` se umesto forme prikazuje
poziv da se upit pošalje putem Instagram profila. Forma je skrivena i bez
JavaScripta. Kada dobijete endpoint (Formspree, Getform, Web3Forms
ili vaš PHP), samo ga upišite:

```js
formEndpoint: "https://formspree.io/f/xxxxxxx"
```

Forma se tada prikazuje i šalje `POST` sa poljima: `ime`, `telefon`, `email`, `tip`, `mesto`, `poruka`.
Fotografije se šalju putem Instagrama; forma nema polje za priloge.

---

## 2. Struktura

```
site/
  index.html       početna
  proizvodi.html   6 grupa proizvoda
  galerija.html    20 radova, filter + lightbox
  proces.html      6 koraka izrade + materijali + FAQ
  o-nama.html
  kontakt.html     forma + direktan kontakt
  assets/
    css/site.css   ceo dizajn (boje i tipografija na vrhu, u :root)
    js/site.js     podešavanja + ponašanje
    img/           slike, .webp, po 3 veličine (puna, -960 i -640)
    video/         snimak iz radionice (mp4 + webm + poster)
  README.md
```

## 3. Boje i tipografija

Sve je u `assets/css/site.css`, blok `:root` na vrhu:

```css
--azur: #0F52FF;   /* akcenat — dugmad, linkovi, brojevi */
--ink:  #0B0B0D;   /* crna */
--bone: #E9E9E4;   /* svetlo siva (footer, sekcija sa šarama) */
```

Fontovi: **Archivo** (naslovi/tekst) + **JetBrains Mono** (labele, navigacija),
oba sa Google Fonts.

## 4. Dodavanje nove slike u galeriju

1. Ubacite `.webp` u `assets/img/` — dve veličine: `naziv.webp` i `naziv-640.webp`
2. U `galerija.html` kopirajte jedan `<figure class="gitem">` blok i zamenite:
   - `data-cat` — `ograde` | `gelenderi` | `kapije` | `garaze` | `nadstresnice`
   - `data-caption` — tekst ispod slike
   - `data-full` i `src`

## 5. Hero i mobilni prikaz

Hero na `index.html` zauzima **celu visinu ekrana** (`min-height:100dvh` u
`.hero`), pa ispod njega ne ostaje traka bele pozadine ni na jednom telefonu.

Fotografija se učitava u dve verzije:

- `assets/img/hero.webp` — 1800×1012, za ekrane širi od 780 px
- `assets/img/hero-640.webp` — 860×1572, uspravan kadar za telefone

Ako menjate hero, zamenite oba fajla i uskladite `width`/`height` u
`index.html` (i u `<link rel="preload">` u `<head>`).

Podešavanja za telefone su u `assets/css/site.css`, blok `MOBILNI (telefoni)`:
veći naslov u hero-u, dodirne mete od 44 px, polja forme na 16 px (iOS ih
inače zumira), galerija u dve kolone i isključeni hover efekti na dodir.

### Šta je urađeno zbog brzine na telefonu

- **Tri veličine svake slike** — `-640`, `-960` i puna. Telefon sa gustim
  ekranom je ranije uvek povlačio punu; sada bira srednju i skida oko
  **četvrtinu manje** po slici.
- **Hero se više ne skida dvaput.** `<link rel="preload">` sada nosi isti
  `media` uslov kao `<picture>`, pa telefon uzima samo uspravan kadar
  (`hero-640.webp`), a ne i položeni.
- **Fontovi ne drže prvi prikaz.** Učitavaju se odmah, ali preko
  `media="print"` trika, pa se strana iscrta bez čekanja na Google Fonts.
  (`display=swap` je svakako prvo ispisivao sistemskim slogom.)
- **Video u „Procesu" čeka da dođe na ekran** — `preload="none"` plus
  `data-lazy`, i prvo nudi `.webm` koji je manji od `.mp4`.
- **Skupi efekti su isključeni ispod 780 px**: zrno preko hero-a
  (`mix-blend-mode` se meša u svakom kadru skrola) i `backdrop-filter` na
  kartici u panelu procesa.
- Sve slike ispod prvog ekrana imaju `loading="lazy"` i `decoding="async"`.

---

## 6. Paralaksa

Slika se u svom okviru pomera sporije od strane. Okvir dobija klasu **`plx`**,
a pomera se prvo dete — `<img>` ili `<picture>`:

```html
<div class="prow__media plx">
  <img src="…" …>
</div>
```

Uslov je da okvir ima **fiksan odnos strana** (`aspect-ratio`) — takvi su već
`.hero__media`, `.fcard__media`, `.prow__media`, `.media-cap` i
`.phead__banner`. Galerija i pločice nemaju fiksnu visinu, pa tamo paralakse
nema namerno.

Jačina se podešava sa dve promenljive, blok `PARALAKSA` u `site.css`:

```css
.plx > img,.plx > picture{
  --plx-t:5.5%;   /* koliko se slika penje i spušta */
  --plx-s:1.14;   /* zum koji pravi rezervu; najmanje 1 + 2 × --plx-t */
}
```

Ako povećate `--plx-t`, **morate** povećati i `--plx-s`, inače se na krajevima
vidi ivica. Na telefonu su vrednosti manje (`3.4%` / `1.085`), u bloku
`MOBILNI`.

Radi na dva načina, bez razlike u izgledu:

- **Chrome, Edge, Safari 26+** — čista CSS animacija vezana za skrol
  (`animation-timeline: view()`). Računa je GPU, glavna nit je slobodna, pa
  skrol na telefonu ostaje gladak.
- **Stariji pregledači** — isti pomeraj upisuje `parallax()` u `site.js`, ali
  samo za slike koje su trenutno na ekranu i najviše jednom po kadru.

Uz `prefers-reduced-motion` nema ni pomeranja ni zuma — slika stoji kao ranije.

> **Pazite na `overflow`.** Okviri koriste `overflow:hidden;overflow:clip`.
> Samo `hidden` bi od okvira napravio sopstveni skrol kontejner i `view()` bi
> pratio njega umesto strane — paralaksa bi se „zamrzla". Iz istog razloga
> `body` ima `overflow-x:clip`, a zaključavanje skrola (meni, lightbox) ide
> preko klase `no-scroll` na `<html>`.

---

## 7. Objavljivanje

Sajt nema backend — radi svuda:

- **Netlify / Vercel** — prevucite folder `site` u njihov drag-and-drop
- **GitHub Pages** — push foldera, uključite Pages
- **Klasičan hosting** — FTP, ceo sadržaj foldera `site` u `public_html`

---

## 8. Logo

Znak je **„A" izrezano iz table** — pun zaobljen kvadrat (32×32, radijus 7) iz
kojeg je jednim potezom izvučen slovni oblik. Vrh slova je **zasečen ravno**,
kao kod pravog laserskog reza gde se oštri šiljak ne ostavlja; zbog toga znak
ostaje čitak i na 16 px.

Crta se jednom `<path>` putanjom sa `fill-rule="evenodd"` i tri podputanje:
tabla, kontura slova, unutrašnji trougao. Zato nema preklapanja i znak radi u
jednoj boji, na svakoj podlozi.

Koristi se na tri mesta:

- navigacija — `.brand__mark` u svakoj `.html` datoteci (puna putanja, sa tablom)
- loader — `.loader__mark--raw` / `--cut` (**samo slovo**, bez table, `viewBox="7 6.2 18 19.6"`)
- favicon — `<link rel="icon">` (inline SVG, azur `#0F52FF`)

Boju nasleđuje od roditelja (`currentColor`), pa je azur na svetloj navigaciji,
a beo na tamnoj. Ako menjate znak, zamenite `d="…"` na sva tri mesta.

## 9. Loader

Prikazuje se **samo pri prvom otvaranju sajta u poseti** (pamti se u
`sessionStorage`), ne na svakom kliku kroz meni.

Jedna ideja, bez dodataka: **laser seče znak odozgo nadole**. Slovo stoji u dva
sloja — sirovina (`--raw`, belo na 13 %) i izrezani deo (`--cut`, puno belo)
koji se otkriva `clip-path`-om iza azurne niti (`.loader__beam`). Petlja traje
1,75 s. Ispod stoji samo ime u mono slogu; nema ni trake ni potpisa u dnu.

Traje najmanje ~0,8 s, pa ceo tamni panel **odlazi naviše** u jednom potezu.

Sigurnosne granice:

- bez JavaScripta se **nikad ne pojavi** (klasa `js-loading` se dodaje skriptom)
- tvrdi prekid na 4,5 s — ne može da ostane zaglavljen
- uz `prefers-reduced-motion` nema animacije, samo kratak fade

Trajanje se menja u `assets/js/site.js`:

```js
const MIN = 820;              // koliko najmanje stoji (ms)
```

a izgled u `assets/css/site.css`, sekcija `LOADER` na dnu.

---

## Napomene

- Sve fotografije su iz Instagram naloga `@ograde_lux_azur`, prebačene u WebP.
  Na disku ih ima ~5.6 MB zajedno sa sve tri veličine, ali jedna
  poseta skine samo po jednu veličinu svake slike koja se zaista vidi.
- Tekstovi opisuju proizvodne postupke opšte (lasersko sečenje, plastifikacija,
  montaža). **Nema izmišljenih brojeva, cena, rokova ni utisaka mušterija** —
  ako želite konkretne podatke (godine iskustva, broj objekata, garanciju),
  pošaljite ih i dopisaće se.
