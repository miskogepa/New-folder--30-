# EDC (Everyday Carry) App – Plan funkcionalnosti

## Osnovna ideja

Aplikacija omogućava korisniku da virtuelno "spakuje" svoj EDC za taj dan, koristeći vizuelni prikaz ranca (grid) i ikonice predmeta. Fokus je na osećaju kao u igrici (inventory sistem).

---

## Glavne funkcionalnosti (MVP)

1. **Virtuelni ranac (grid inventar)**

   - Prikaz ranca kao mreže (npr. 4x4 ili 5x5 grid).
   - Svaka ćelija može biti prazna ili sadržati predmet (ikonicu).

2. **Lista EDC predmeta (sidebar)**

   - Prikaz svih dostupnih EDC predmeta kao ikonice sa strane.
   - Predmeti: lampa, multitool, sat, prva pomoć, ključevi, novčanik, notes, olovka, flašica vode, itd.

3. **Dodavanje predmeta u ranac (drag & drop)**

   - Korisnik može prevući (drag & drop) predmet iz liste u grid ranca.
   - Predmet zauzima jednu ćeliju (ili više, ako je veći predmet).

4. **Izbor varijante predmeta**

   - Kada korisnik ubaci predmet u ranac (npr. lampa), može da izabere koju tačno varijantu tog predmeta želi (ako ima više lampi u kolekciji).
   - Prikaz modala ili dropdowna sa izborom varijante.

5. **Vizuelni identitet**

   - Tamna tema, stilizacija kao u igricama (jasne granice grid ćelija, efekti na hover, pixel font ili sličan gaming font).
   - Ikonice iz react-icons ili custom SVG/PNG.

6. **Sekcija Zdravlje i univerzalna logika korišćenja predmeta**

   - Posebna sekcija "Zdravlje" sa ikonicama za: vodu, hranu, trening i suplemente/lekove.
   - Svaka od ovih ikonica ima brojač upotreba: korisnik može da podesi koliko puta dnevno može da koristi (npr. 3 obroka, 5 čaša vode, 2 treninga, 4 suplementa/lekova).
   - Oko plus dugmeta na ikoni prikazuje se onoliko crtica u krugu koliko je maksimalan broj upotreba za taj dan.
   - Svaki put kada korisnik pritisne plus, jedna crtica se popunjava (vizuelni feedback da je upotreba zabeležena).
   - Ove ikonice se takođe mogu ubaciti u ranac i u rancu korisnik može da vodi evidenciju o korišćenju (npr. popio je vodu, pojeo obrok, odradio trening, uzeo suplement/lek).
   - Logika sa plus dugmetom i crticama u krugu može se koristiti i za druge EDC predmete (npr. baterijska lampa, multitool, itd.), gde korisnik može da zabeleži koliko puta je predmet upotrebljen tog dana.
   - Prikaz trenutnog stanja (broj preostalih upotreba) je uvek vidljiv korisniku, kako u sekciji Zdravlje, tako i u rancu.
   - Vizuelni prikaz: plus dugme u sredini ikonice, crte u krugu oko plusa (broj crtica = broj mogućih upotreba), popunjene crte označavaju koliko puta je predmet iskorišćen.
   - Ova funkcionalnost omogućava korisniku da lako prati i evidentira korišćenje svih važnih EDC predmeta tokom dana, na intuitivan i "game-like" način.

---

## Backend – Struktura i zavisnosti

### Predložena struktura foldera za backend:

- `config/` – konfiguracije (npr. konekcija na bazu, environment promenljive)
- `controllers/` – logika za obradu zahteva (npr. korisnici, predmeti, ranac)
- `middleware/` – custom middleware (npr. autentikacija, error handling, validacija)
- `models/` – definicije modela (npr. User, Item, Backpack, HealthLog)
- `routes/` – definicije API ruta (npr. /api/users, /api/items, /api/backpack)
- `utils/` – pomoćne funkcije (npr. validacija, helperi za datume, slanje mejlova)
- `services/` – poslovna logika (npr. servis za korisnike, servis za predmete)
- `tests/` – testovi (unit i integration)
- `app.js` ili `server.js` – ulazna tačka aplikacije

### Osnovne developer dependencies koje treba instalirati:

- `express` – backend framework
- `dotenv` – za environment promenljive
- `cors` – za CORS podršku
- `mongoose` ili `sequelize` – za rad sa bazom (MongoDB ili SQL)
- `bcrypt` – za heširanje lozinki
- `jsonwebtoken` – za JWT autentikaciju
- `nodemon` – za automatski restart servera tokom razvoja
- `jest` i `supertest` – za testiranje
- `eslint` i `prettier` – za stil i lintovanje koda
- `morgan` – za logovanje zahteva
- `body-parser` – za parsiranje body-ja (ako nije deo express-a)

---

## Napomene

- Za sada je fokus samo na virtuelnom rancu i izboru predmeta.
- Kasnije se mogu dodati: korisnički profili, statistika, aktivnosti, podešavanja, čuvanje/loadout-a, itd.
