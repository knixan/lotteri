# Mjölby Idrottslotteri

Digitalt lotteri för Mjölby Idrottsförbund. Next.js + Firebase-portfolioprojekt.

## Stack

- **Next.js** (App Router, Server Actions) + TypeScript
- **Firebase**: Auth, Firestore, Admin SDK, Local Emulator Suite
- **Tailwind v4** + **shadcn/ui** (`Field`-komponenter, inte den äldre `Form`-wrappern)
- **react-hook-form** + **zod** för formulär och validering
- **date-fns** + `Intl` för datum (Europe/Stockholm, hanterar CET/CEST)

## Kom igång

```bash
npm install

# Terminal 1 - Firebase-emulatorer (Auth + Firestore)
npm run emulators

# Terminal 2 - fyll emulatorn med demo-lotterier + en admin-user
npm run seed

# Terminal 3
npm run dev
```

Appen körs mot emulatorn by default (`.env.local`, projekt-id `demo-*`), så inget riktigt
Firebase-projekt behövs för att utveckla lokalt.

**Seedat admin-konto:** `admin@mjolby-if.se` / `admin123456`

## Projektstruktur

```
src/
  app/
    page.tsx                        # startsida (hero, so-funkar-det, etc)
    logga-in/, registrera/          # auth-sidor
    lotteriet/page.tsx              # bläddra lotterier (Server Component, Admin SDK)
    lotteriet/[lotteryId]/page.tsx  # lotteridetalj + köpformulär
    mina-sidor/page.tsx             # inloggad användares köpta lotter
    admin/                          # admin-panel (skapa/redigera lotteri, dra vinnare)

  components/
    site/          # publika sajtens komponenter (header, hero, banners)
    auth/           # inloggning/registrering, RequireAuth/RequireAdmin-guards
    lotteries/      # köpformulär
    mina-sidor/     # biljettlista för inloggad användare
    admin/          # lotteriformulär, dra-vinnare-knapp
    ui/             # shadcn-genererade primitiver, rör inte manuellt
    auth-provider.tsx, theme-provider.tsx, theme-toggle.tsx  # delas av hela appen

  hooks/
    use-auth.ts     # useAuth() - user, profile (roll), loading

  lib/
    firebase/
      client.ts     # klient-SDK, kopplar mot emulator om NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
      admin.ts      # Admin SDK (server-only), för Server Components/Actions
      auth.ts       # signUpWithEmail/signInWithEmail/signOutUser (klient)
    actions/
      purchase-tickets.ts  # köp-flow: verifierar ID-token, transaktion för biljettnumrering
      admin.ts             # admin-actions: verifierar roll via Admin SDK innan skrivning
    firestore/
      lotteries.ts  # server-side reads (getLotteries, getLotteryById, getUserTickets, ...)
    types/          # zod-scheman + TS-typer (delas mellan formulär och actions)
    date.ts         # datumformatering, Europe/Stockholm-säker

scripts/
  run-emulators.mjs   # hittar en JDK 21+ även om PATH pekar på en äldre Java
  seed-emulator.mjs   # demo-lotterier + admin-user i emulatorn

firestore.rules        # säkerhetsregler - se kommentarer i filen för collection-group-gotchan
```

## Medvetna förenklingar

- **Autentiseringsskydd är klientsidan** (`RequireAuth`/`RequireAdmin` redirectar efter mount),
  inte server-side session-cookies. Bra nog för en demo, men skulle bytas ut mot
  Firebase session-cookies + middleware för produktion.
- **Biljettköp går via en Server Action**, inte en direkt klient-skrivning till Firestore -
  det är där ID-token verifieras och biljettnumreringen görs i en transaktion.
- **Admin-listning av alla biljetter går också via Server Actions** (Admin SDK), eftersom
  Firestore-regler för `list`/collectionGroup-frågor inte kan uttrycka en säker
  "ägare ELLER admin"-disjunktion statiskt.
- **Stripe är medvetet inte kopplat in än** - köpflödet skapar biljetter direkt (mockat
  "köp"). Läggs till som ett separat lager när/om det behövs.
- **E-postnotis vid vinst** är inte byggt - "Dra vinnare" markerar bara biljetten som
  vinnare i Firestore.
