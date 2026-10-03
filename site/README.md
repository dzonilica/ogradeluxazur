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

Paleta je **svetli krem sa azur plavim detaljima** (plava po imenu „Lux
Azur“, prigušena da ne upada u oči). Sve je u `assets/css/site.css`, blok
`:root` na vrhu:

```css
--paper:  #F6F0E5;   /* krem - pozadina strane */
--bone:   #ECE2D0;   /* tamniji krem - footer, sekcija sa šarama */
--ink:    #1E1714;   /* topla braon-crna - tekst i tamna sekcija */
--accent: #2A5B84;   /* azur plava - dugmad, linkovi, brojevi, kvadratići */
--accent-ink:  #1F4766; /* tamnija plava - hover */
--accent-lite: #8DB4D6; /* svetlija plava za tamnu podlogu (hero, brojevi) */
```

Plava `#2A5B84` na kremu ima kontrast 6,3:1, a beli tekst na plavom
dugmetu 7,2:1, pa oba prolaze WCAG AA i za sitan tekst. Na tamnoj podlozi
osnovna plava ima svega 2,5:1, zato tamo (linija u hero-u, kvadratići i
brojevi u tamnoj sekciji) ide `--accent-lite`, 8,1:1.

Boja se menja samo u ova četiri tokena u `:root` i u faviconu (vidi ispod).

Fontovi: **Archivo** (naslovi/tekst) + **JetBrains Mono** (labele, navigacija),
oba sa Google Fonts.

## 4. Dodavanje nove slike u galeriju

1. Ubacite `.webp` u `assets/img/` — dve veličine: `naziv.webp` i `naziv-640.webp`
2. U `galerija.html` kopirajte jedan `<figure class="gitem">` blok i zamenite:
   - `data-cat` — `ograde` | `gelenderi` | `kapije` | `garaze` | `nadstresnice`
   - `data-caption` — tekst ispod slike
   - `data-full` i `src`

## 5. Hero i mobilni prikaz

Hero na `index.html` zauzima **tačno prvi ekran** (`min-height:100svh` u
`.hero`), i na telefonu i na računaru. Traka sa uslugama (`.strip`, lasersko
sečenje… montaža) je ispod njega i vidi se tek kad se skroluje.

`svh`, a ne `dvh`: na telefonu je to visina ekrana sa prikazanom trakom
pregledača, pa hero pri učitavanju staje tačno u ekran. Ta visina se ne
menja dok se traka pregledača skriva u skrolu, pa strana ne poskakuje.

Fotografija se učitava u dve verzije:

- `assets/img/hero.webp` — 1529×1012, za ekrane šire od 780 px
- `assets/img/hero-640.webp` — 649×1012, uspravan isečak za telefone
  (desno krilo kapije i stub sa rotacionim svetlom)

Obe su napravljene iz `hero.png` u korenu projekta (beli rub od 25 px sa
desne strane je odsečen).

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

**Svaka fotografija na sajtu** se u svom okviru pomera sporije od strane:
hero, kartice, pločice, kartice šara, panel procesa, galerija i video iz
radionice. Izuzetak je samo lightbox u galeriji, jer je tamo skrol zaključan.

Okvir dobija klasu **`plx`**, a pomera se prvo dete, `<img>`, `<picture>` ili `<video>`:

```html
<div class="prow__media plx">
  <img src="…" …>
</div>
```

Slika je **viša od okvira** i dok okvir prolazi kroz ekran klizi kroz njega,
od donje do gornje ivice. Ne zumira se: uspravne fotografije u položenim
okvirima ionako imaju višak visine koji `object-fit:cover` odseca, a
paralaksa koristi baš taj višak.

Jačina se podešava jednom promenljivom, blok `PARALAKSA` u `site.css`:

```css
.plx > img,.plx > picture,.plx > video{
  --plx-k:.12;    /* rezerva gore i dole, u delu visine okvira; hod = 2 × k */
}
```

Ista vrednost važi i na telefonu. Ivica se nikad ne vidi, ma koliko `k`
bilo, ali što je veće, to je slika više uvećana u okvirima koji nemaju
višak visine (kvadratne i položene fotografije).

Posebni slučajevi, takođe u bloku `PARALAKSA`:

| Gde | `--plx-k` | Zašto |
|---|---|---|
| Zaglavlja strana (`.phead__banner`) | `.25` | uspravna fotografija u širokom okviru, jači hod je besplatan |
| Velika kartica (`.fcard__media`) | `.2` | |
| Panel procesa (`.ppanel__img`) | `.25` | uspravna fotografija u položenom okviru, bez uvećanja |
| Kartice šara (`.pcard__img`) | `.3` | nizak okvir; sa `.12` pomeraj se nije primećivao |
| Pločice (`.tile`) | `.25` | nizak okvir; kvadratne slike se uvećaju, zato `srcset` sa `-960` |
| CTA na početnoj (`.media-cap--low`) | `.16` | ograda je na dnu fotografije, veći hod bi otkrio plafon balkona |
| Galerija (`.gitem`) | `.1` | okvir nema svoju visinu (daje je slika), pa rezervu pravi zum |
| Hero (`.plx--top`) | — | vidi ispod |

**Hero** (`plx--top`) je na ekranu od samog učitavanja, pa ne čeka da „uđe
odozdo". Kreće od prvog piksela skrola i ide samo nadole, 30 % svoje visine
dok hero ne izađe sa ekrana (`--plx-to`). Rezerva mu ne treba, pa ostaje u
punoj oštrini.

Pomeraj ide kroz CSS svojstvo `translate` (ne kroz `transform`). Zato hover
zum na pločicama, karticama i u galeriji radi zajedno sa paralaksom i ne
poništava je.

Radi na dva načina, bez razlike u izgledu:

- **Chrome, Edge, Safari 26+**: čista CSS animacija vezana za skrol
  (`animation-timeline: view()`). Računa je GPU, glavna nit je slobodna, pa
  skrol na telefonu ostaje gladak.
- **Stariji pregledači** (i Firefox): `parallax()` u `site.js` upisuje samo
  napredak (`--plx-p`, od 0 do 1), a pomeraj iz njega računa isti CSS. Radi
  samo za slike koje su trenutno na ekranu i najviše jednom po kadru.

Uz `prefers-reduced-motion` nema ni pomeranja ni zuma, slika stoji mirno.

> **Pazite na `overflow`.** Okviri koriste `overflow:hidden;overflow:clip`.
> Samo `hidden` bi od okvira napravio sopstveni skrol kontejner i `view()` bi
> pratio njega umesto strane, pa bi se paralaksa „zamrzla". Isto važi za
> svakog **pretka** slike (zato `.ppanel` i `.pcard` imaju `clip`). Iz istog
> razloga `body` ima `overflow-x:clip`, a zaključavanje skrola (meni,
> lightbox, loader) ide **samo** preko `<html>` (klase `no-scroll` i
> `js-loading`). Da `body` dobije `overflow:hidden`, postao bi skrol
> kontejner i slike bi skočile čim se skrol otključa.
>
> Karusel šara se skroluje vodoravno, pa je on sam skrol kontejner. Kartice
> u njemu zato prate položaj celog karusela na strani, preko imenovane
> vremenske linije `--plx-car`.
>
> `.plx` ima i `min-height:0`. Okvir sa `clip` nije skrol kontejner, pa bi ga
> `aspect-ratio` inače pustio da naraste do prirodne visine uspravne slike.

---

## 7. Objavljivanje

Sajt nema backend — radi svuda:

- **Netlify / Vercel** — prevucite folder `site` u njihov drag-and-drop
- **GitHub Pages** — push foldera, uključite Pages
- **Klasičan hosting** — FTP, ceo sadržaj foldera `site` u `public_html`

---

## 8. Ime umesto znaka

Sajt nema grafički znak. U navigaciji piše samo **Lux Azur**: „Lux“ u
srednjem rezu, „Azur“ u tankom i prigušenom tonu (`.brand__name` u svakoj
`.html` datoteci).

Favicon (`<link rel="icon">`, inline SVG) je azur plavi zaobljen kvadrat sa
inicijalima **LA** u krem boji.

## 9. Loader

Prikazuje se **samo pri prvom otvaranju sajta u poseti** (pamti se u
`sessionStorage`), ne na svakom kliku kroz meni.

Minimalan je, bez znaka. Na krem tabli ime **Lux Azur** izranja iz svoje
linije, a ispod njega se plava nit iscrta s leva na desno, kao laserski
rez. Na izlazu reči odlaze nagore, nit se povlači udesno i tabla se podigne.

Ulazna animacija **čeka da stigne font** (Archivo), da se slovo ne bi
zamenilo usred pokreta. Ako font kasni, kreće posle 0,7 s i ime ostaje u
sistemskom slogu do kraja (klasa `is-sys`), pa se slovo nikad ne menja usred
animacije.

Sigurnosne granice:

- bez JavaScripta se **nikad ne pojavi** (klasa `js-loading` se dodaje skriptom)
- tvrdi prekid na 4,5 s, ne može da ostane zaglavljen
- ako se `site.js` uopšte ne učita, skripta u `<head>` sama skida loader posle 6,5 s
- uz `prefers-reduced-motion` nema pokreta, samo kratak fade

Trajanje se menja u `assets/js/site.js`:

```js
const MIN = 1350;   // od početka ulaza do početka izlaza (ms); ulaz traje ~0,9 s
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
