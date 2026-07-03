#!/usr/bin/env node
// Populates the local Firebase emulators with demo data so the app has
// something to show without needing a real project. Run the emulators
// first (`npm run emulators`), then in another terminal: `npm run seed`.
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";

const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "demo-mjolby-idrottslotteri";

const app = initializeApp({ projectId });
const db = getFirestore(app);
const auth = getAuth(app);

function daysFromNow(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(17, 0, 0, 0); // 18:00 or 19:00 Swedish time depending on DST
  return date.toISOString();
}

const lotteries = [
  {
    id: "veckans-lotteri",
    title: "Veckans lotteri",
    description:
      "Köp en lott och var med i veckans dragning. Hela överskottet går till barn- och ungdomsverksamheten i Mjölby Idrottsförbund.",
    ticketPriceSek: 50,
    prizeTitle: "Presentkort ICA",
    prizeValueSek: 10000,
    status: "open",
    drawAt: daysFromNow(7),
    ticketsSold: 128,
    createdAt: new Date().toISOString(),
  },
  {
    id: "storslammen",
    title: "Storslammen",
    description:
      "Vårt största lotteri för året, med chans att vinna resecheckar och sportutrustning.",
    ticketPriceSek: 100,
    prizeTitle: "Resecheck",
    prizeValueSek: 25000,
    status: "open",
    drawAt: daysFromNow(30),
    ticketsSold: 42,
    createdAt: new Date().toISOString(),
  },
];

async function seedLotteries() {
  for (const { id, ...data } of lotteries) {
    await db.collection("lotteries").doc(id).set(data, { merge: true });
    console.log(`Seeded lottery: ${id}`);
  }
}

async function seedAdminUser() {
  const email = "admin@mjolby-if.se";
  const password = "admin123456";

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch {
    user = await auth.createUser({
      email,
      password,
      displayName: "Mjölby Admin",
    });
  }

  await db.collection("users").doc(user.uid).set(
    {
      uid: user.uid,
      displayName: "Mjölby Admin",
      email,
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );

  console.log(`Seeded admin user: ${email} / ${password}`);
}

await seedLotteries();
await seedAdminUser();
console.log("Done.");
process.exit(0);
