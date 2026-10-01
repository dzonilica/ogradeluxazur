# Pregled teksta i SEO osnove — Lux Azur

Pregledane i dorađene stranice: početna, proizvodi, galerija, proces izrade, o nama i kontakt, uključujući tekstove dugmadi, opise slika i poruke forme.

Tekst je sada direktniji, sa konkretnim informacijama o proizvodima, izboru šare, merenju i montaži. Ujednačeno je obraćanje posetiocu. Uklonjena su nepotkrepljena obećanja o rokovima, besplatnim uslugama i otpornosti premaza, kao i podatak „14,2 m“ bez izvora u projektu.

Primeri izmena:

- „Montaža do ključa“ → „Montaža ograde“.
- „Pošaljite meru, vratimo ponudu“ → „Zatražite ponudu za svoj objekat“.
- „Najlakša šara za održavanje“ → opis kružnih otvora i njihovog rasporeda.
- „Dvadeset izvedenih radova“ → opis fotografija po kategorijama, jer više fotografija može prikazivati isti rad.

Svih šest stranica dobilo je zaseban naslov i meta opis, usklađen sa sadržajem i Open Graph oznakama. Uređena je hijerarhija naslova na proizvodima i procesu izrade. Nazivi proizvoda koriste se prirodno, bez nabrajanja gradova ili ponavljanja ključnih reči radi pretrage. Pristup prati [Google Search Essentials](https://developers.google.com/search/docs/essentials).

Kontakt forma nema podešen servis za slanje. Sada se umesto nje prikazuje direktan poziv za kontakt putem Instagrama. Forma će se prikazati kada se popuni `formEndpoint` u `site/assets/js/site.js`. Uklonjeno je obećanje o odgovoru tokom istog radnog dana.

## Podaci potrebni za dovršetak lokalnog SEO-a

- Grad, stvarna adresa i područje na kojem firma radi.
- Telefon i e-mail, uz potvrdu prikazanog radnog vremena.
- Konačni domen: zatim postaviti apsolutne canonical i Open Graph URL-ove i pripremiti sitemap.
- Dopuniti strukturirane podatke stvarnim kontaktom i lokacijom.

Specifikacije konkretnih proizvoda i komercijalne uslove treba potvrditi podacima firme. Nisu dodavane cene, garancije, reference ili gradovi bez potvrde. Ovo je pregled lokalnih fajlova; indeksiranje i pozicije objavljenog sajta nisu proveravani u Search Console-u.

## Provera

Prošli su provera jedinstvenih naslova i opisa, jednog H1 po stranici, JSON-LD zapisa, lokalnih linkova, slika i sidara, kao i JavaScript sintakse. Ponašanje kontakta provereno je sa simuliranim odgovorima servisa; nijedan upit nije poslat. Vizuelna provera u pregledaču nije bila dostupna u ovoj sesiji.

Originalni fajlovi sačuvani su u `.work/copy-review-before/`.
