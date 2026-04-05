/**
 * Usage: npx tsx scripts/hash-password.ts "your-secure-password"
 * Paste the printed hash into ADMIN_PASSWORD_HASH in .env
 */
import bcrypt from "bcryptjs";

const pwd = process.argv[2];
if (!pwd || pwd.length < 8) {
  console.error('Usage: npx tsx scripts/hash-password.ts "your-password" (min 8 chars)');
  process.exit(1);
}

const hash = bcrypt.hashSync(pwd, 12);
console.log("ADMIN_PASSWORD_HASH=" + hash);
