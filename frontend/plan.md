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

## Redosled kreiranja foldera i fajlova (backend) – objašnjenje za početnike

1. **Kreiranje osnovnog projekta i package.json**

   - Prvo smo inicijalizovali Node.js projekat i napravili `package.json` fajl. Ovo je osnova svakog Node projekta i omogućava nam da instaliramo i pratimo sve potrebne pakete (zavisnosti).

2. **Kreiranje glavnog ulaznog fajla (`index.js`)**

   - Napravili smo `index.js` kao ulaznu tačku aplikacije. U njemu pokrećemo Express server i kasnije povezujemo sve ostale delove aplikacije.

3. **Kreiranje foldera `config/` i fajla za konekciju sa bazom (`config/db.js`)**

   - Ovaj folder služi za sve konfiguracije. Prvo smo napravili konekciju sa MongoDB bazom koristeći Mongoose, jer je povezivanje sa bazom osnova za rad sa podacima.

4. **Kreiranje foldera `models/` i modela za sve entitete**

   - U folderu `models/` smo napravili fajlove za svaki entitet: `User.model.js`, `EdcItem.model.js`, `Backpack.model.js`, `ItemUsage.model.js`, `HealthLog.model.js`.
   - Svaki model opisuje strukturu podataka za jednu kolekciju u bazi. Ovo je važno jer backend mora znati kako izgledaju podaci koje čuva i obrađuje.

5. **Kreiranje foldera `controllers/` i kontrolera za svaki model**

   - U `controllers/` folderu smo napravili po jedan fajl za svaki model (npr. `User.controller.js`).
   - Kontroleri sadrže logiku za obradu zahteva (npr. kreiranje, čitanje, izmena, brisanje podataka). To je "mozak" aplikacije koji povezuje rute i modele.

6. **Kreiranje foldera `routes/` i ruta za svaki model**

   - U `routes/` folderu smo napravili po jedan fajl za svaku grupu ruta (npr. `user.routes.js`).
   - Rute su "ulazna vrata" u aplikaciju – definišu koji URL-ovi postoje i koju logiku (kontroler) treba pozvati za svaki zahtev.

7. **Kreiranje foldera `middleware/` i auth middleware-a**

   - U `middleware/` folderu smo napravili `auth.js` za autentikaciju korisnika preko JWT tokena.
   - Middleware je "čuvar" koji proverava da li korisnik ima pravo pristupa određenim rutama.

8. **Dodavanje i povezivanje svih delova u `index.js`**

   - U glavnom fajlu (`index.js`) smo importovali i povezali sve rute, konekciju sa bazom i error handler.
   - Ovo je završni korak koji "spaja" sve delove aplikacije u jednu celinu.

9. **Dodavanje i korišćenje jsonwebtoken (JWT) za autentikaciju**
   - Instalirali smo i koristili paket `jsonwebtoken` kako bismo omogućili sigurnu autentikaciju korisnika.
   - JWT se koristi za generisanje tokena prilikom login-a (u kontroleru za korisnika), a zatim za proveru tokena u auth middleware-u na zaštićenim rutama.
   - Ovaj korak je važan jer omogućava da samo prijavljeni korisnici mogu pristupiti i menjati svoje podatke, čime se povećava sigurnost aplikacije.

---

**Zašto smo radili ovim redom?**

- Prvo pravimo osnovu (projekat, server, konekciju sa bazom), jer bez toga ništa drugo ne može da radi.
- Zatim definišemo modele, jer moramo znati kako izgledaju naši podaci pre nego što pišemo logiku za njihovu obradu.
- Kontroleri i rute dolaze posle modela, jer koriste modele za rad sa podacima i omogućavaju korisnicima da pristupe tim podacima preko API-ja.
- Middleware dodajemo kada želimo da zaštitimo određene rute (npr. da samo prijavljeni korisnici mogu da menjaju podatke).
- Na kraju sve povezujemo u glavnom fajlu, da bi aplikacija radila kao celina.

Ovakav redosled je logičan i olakšava razvoj, jer svaki sledeći korak zavisi od prethodnog. Tako se izbegavaju greške i lakše se razume kako aplikacija funkcioniše.

---

## Napomene

- Za sada je fokus samo na virtuelnom rancu i izboru predmeta.
- Kasnije se mogu dodati: korisnički profili, statistika, aktivnosti, podešavanja, čuvanje/loadout-a, itd.

---

## Entity Relationship Diagram (ERD) za EDC aplikaciju

**Opis:**
Korisnik ima svoju kolekciju predmeta (Moj EDC), gde svaki predmet ima naziv (npr. "Nitecore p20ix") i tip (npr. lampa, multitool, nož, itd.), kao i izabranu ikonicu prema tipu. Korisnik može imati više predmeta istog tipa (npr. više lampi). Kada pakuje ranac za dan, bira koje tačno predmete iz svoje kolekcije koristi tog dana (npr. bira jednu od lampi). Za predmete u rancu može pratiti koliko puta ih je koristio tokom dana (opciono, samo ako je prethodno definisao broj korišćenja). Sekcija Zdravlje omogućava korisniku da prati unos vode, hrane, treninga i suplemenata/lekova, sa brojačem upotreba za svaki od ovih aspekata.

**ERD (tekstualni prikaz):**

- **User**

  - \_id
  - username
  - email
  - password
  - [mojEdc] → lista referenci na **EdcItem**
  - [backpacks] → lista referenci na **Backpack**
  - [healthLogs] → lista referenci na **HealthLog**

- **EdcItem** (predmet u kolekciji korisnika)

  - \_id
  - userId (referenca na User)
  - name (npr. "Nitecore p20ix")
  - type (npr. "lampa", "nož", "multitool")
  - icon (npr. "lampa")
  - usageLimit (opciono, koliko puta dnevno može da se koristi)

- **Backpack** (EDC za određeni dan)

  - \_id
  - userId (referenca na User)
  - date
  - [items] → lista referenci na **EdcItem** (predmeti koje je korisnik izabrao za taj dan)

- **ItemUsage** (opciono, praćenje korišćenja predmeta u rancu)

  - \_id
  - backpackId (referenca na Backpack)
  - edcItemId (referenca na EdcItem)
  - usedCount (koliko puta je predmet korišćen tog dana)

- **HealthLog**
  - \_id
  - userId (referenca na User)
  - date
  - water (broj unosa vode)
  - food (broj obroka)
  - training (broj treninga)
  - supplements (broj unosa suplemenata/lekova)

**Opis odnosa:**

- Jedan korisnik ima svoju kolekciju predmeta (Moj EDC) i može imati više predmeta istog tipa.
- Svaki dan korisnik pakuje ranac i bira koje tačno predmete iz kolekcije koristi tog dana.
- Za predmete u rancu može pratiti korišćenje (koliko puta je predmet upotrebljen tog dana).
- Zdravlje se prati kroz posebne HealthLog zapise za svaki dan, sa brojačem upotreba za vodu, hranu, trening i suplemente/lekove.

---

## MongoDB Aggregation Pipeline

**Šta je Aggregation Pipeline?**

Aggregation Pipeline je moćan alat u MongoDB-u koji omogućava da obradiš, filtriraš, grupišeš i transformišeš podatke iz kolekcija kroz niz koraka ("stage-ova").

**Kada se koristi?**

- Kada želiš da izvučeš statistiku (npr. koliko puta je korisnik popio vodu u poslednjih 7 dana)
- Kada treba da grupišeš, sortiraš, filtriraš ili računaš podatke iz više dokumenata

**Kako izgleda?**
Aggregation pipeline je niz objekata (koraka), npr:

```js
const result = await HealthLog.aggregate([
  { $match: { userId: someUserId } },
  { $group: { _id: "$date", totalWater: { $sum: "$water" } } },
  { $sort: { _id: -1 } },
]);
```

Ovo filtrira logove za korisnika, grupiše po datumu i sabira unos vode.

**Zašto je važno?**
Omogućava naprednu analizu i izveštavanje bez potrebe da sve podatke "ručno" obrađuješ u aplikaciji.

---

## Asinhroni Handler (asyncHandler)

**Šta je asyncHandler?**

U Express-u, kada koristiš async/await u rutama, moraš da hvataš greške (try/catch) da server ne bi "pao". Da ne bi u svaku rutu pisao try/catch, koristi se helper funkcija asyncHandler.

**Kako radi?**
asyncHandler "uvija" tvoju async funkciju i automatski prosleđuje greške Express error handleru.

**Primer asyncHandler-a:**

```js
import asyncHandler from "express-async-handler";

app.get(
  "/api/items",
  asyncHandler(async (req, res) => {
    const items = await Item.find();
    res.json(items);
  })
);
```

**Zašto je važno?**

- Kod je čistiji i kraći
- Greške se automatski hvataju i prosleđuju error handleru

**Kako implementirati?**

- Instaliraj paket `express-async-handler` ili napiši svoj helper
- Sve async rute "uvij" u asyncHandler

---

## Testiranje API ruta u Postman-u – detaljan vodič

Evo kako možeš da testiraš sve rute svog backend-a koristeći Postman. Prikazani su primeri za najvažnije operacije, sa objašnjenjem i JSON telom zahteva.

### 1. Registracija korisnika

- **Ruta:** `POST /api/users`
- **Body (JSON):**

```json
{
  "username": "pera",
  "email": "pera@example.com",
  "password": "tajna123"
}
```

- **Headers:**
  - Content-Type: application/json

### 2. Login korisnika (dobijanje JWT tokena)

- **Ruta:** `POST /api/users/login`
- **Body (JSON):**

```json
{
  "email": "pera@example.com",
  "password": "tajna123"
}
```

- **Headers:**
  - Content-Type: application/json
- **Odgovor:**
  - Dobijaš `token` koji koristiš za sve zaštićene rute.

### 3. Dodavanje EDC predmeta korisniku

- **Ruta:** `POST /api/items`
- **Body (JSON):**

```json
{
  "userId": "<USER_ID>",
  "name": "Nitecore p20ix",
  "type": "lampa",
  "icon": "lampa",
  "usageLimit": 5
}
```

- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer <TOKEN>

### 4. Prikaz svih EDC predmeta

- **Ruta:** `GET /api/items`
- **Headers:**
  - Content-Type: application/json

### 5. Kreiranje ranca za dan

- **Ruta:** `POST /api/backpacks`
- **Body (JSON):**

```json
{
  "userId": "<USER_ID>",
  "date": "2024-06-01",
  "items": ["<EDC_ITEM_ID1>", "<EDC_ITEM_ID2>"]
}
```

- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer <TOKEN>

### 6. Prikaz svih rančeva

- **Ruta:** `GET /api/backpacks`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer <TOKEN>

### 7. Praćenje korišćenja predmeta (ItemUsage)

- **Ruta:** `POST /api/item-usage`
- **Body (JSON):**

```json
{
  "backpackId": "<BACKPACK_ID>",
  "edcItemId": "<EDC_ITEM_ID>",
  "usedCount": 2
}
```

- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer <TOKEN>

### 8. Praćenje zdravlja (HealthLog)

- **Ruta:** `POST /api/health`
- **Body (JSON):**

```json
{
  "userId": "<USER_ID>",
  "date": "2024-06-01",
  "water": 5,
  "food": 3,
  "training": 1,
  "supplements": 2
}
```

- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer <TOKEN>

---

### Napomene za testiranje

- Uvek koristi `Content-Type: application/json` u headerima.
- Za zaštićene rute koristi i `Authorization: Bearer <TOKEN>` (token dobijaš iz login odgovora).
- Zameni `<USER_ID>`, `<EDC_ITEM_ID>`, `<BACKPACK_ID>`, `<TOKEN>` sa stvarnim vrednostima iz tvoje baze/odgovora.
- Možeš koristiti Postman "environment variables" da olakšaš testiranje.

Ovim redosledom možeš testirati sve osnovne funkcionalnosti aplikacije i proveriti da li backend radi ispravno!

---
