import "dotenv/config";
import bcrypt from "bcrypt";
import { db, pool } from "./index.js";
import { users, wallets, categories } from "./schema.js";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const [user] = await db
    .insert(users)
    .values({
      username: "devuser",
      email: "dev@mail.com",
      password: passwordHash,
    })
    .onConflictDoNothing()
    .returning();

  const finalUser =
    user ??
    (await db.select().from(users).where((u) => u.email.eq("dev@mail.com"))).at(0);

  if (!finalUser) throw new Error("Failed to create/find seed user");

  await db
    .insert(wallets)
    .values({
      userId: finalUser.userId,
      walletName: "Cash",
      balance: "0.0000",
    })
    .onConflictDoNothing();

  const seedCats = [
    { name: "Gaji", type: "INCOME" },
    { name: "Makanan", type: "EXPENSE" },
    { name: "Transport", type: "EXPENSE" },
  ];

  for (const c of seedCats) {
    await db
      .insert(categories)
      .values({ userId: finalUser.userId, name: c.name, type: c.type })
      .onConflictDoNothing();
  }

  console.log("Seed done");
}

main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
