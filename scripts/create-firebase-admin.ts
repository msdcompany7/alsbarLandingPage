/**
 * Creates or updates the Firebase Authentication admin user.
 *
 * This is separate from PostgreSQL business-data migration.
 * Passwords from PostgreSQL AdminUser (bcrypt) are NOT copied to Firebase Auth.
 *
 * Run manually:
 *   npm run firebase:create-admin
 */
import "./load-env";
import { getAdminAuth } from "../src/lib/firebase/admin";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
  }

  const auth = getAdminAuth();
  let user;

  try {
    user = await auth.getUserByEmail(adminEmail);
    await auth.updateUser(user.uid, {
      password: adminPassword,
      displayName: "מנהל מערכת",
      emailVerified: true,
    });
    console.log(`Updated existing Firebase admin user: ${adminEmail}`);
  } catch {
    user = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: "מנהל מערכת",
      emailVerified: true,
    });
    console.log(`Created Firebase admin user: ${adminEmail}`);
  }

  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log("Admin custom claim set: { admin: true }");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
