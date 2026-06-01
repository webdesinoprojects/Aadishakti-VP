import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║         ENVIRONMENT VARIABLES CHECK                      ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
console.log('ADMIN_PASSWORD (hash):', process.env.ADMIN_PASSWORD);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not set');
console.log('JWT_EXPIRY:', process.env.JWT_EXPIRY);

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║         PASSWORD VERIFICATION                            ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

const testPassword = 'admin123';
const storedHash = process.env.ADMIN_PASSWORD;

if (storedHash) {
  const isValid = bcrypt.compareSync(testPassword, storedHash);
  console.log(`Testing password: "${testPassword}"`);
  console.log(`Against hash: ${storedHash}`);
  console.log(`Result: ${isValid ? '✓ MATCH' : '✗ NO MATCH'}`);
  
  if (!isValid) {
    console.log('\n⚠️  PASSWORD DOES NOT MATCH!');
    console.log('Generating correct hash for "admin123"...\n');
    const correctHash = bcrypt.hashSync(testPassword, 10);
    console.log('Use this hash in your .env file:');
    console.log(`ADMIN_PASSWORD=${correctHash}`);
  } else {
    console.log('\n✓ Password is correctly configured!');
  }
} else {
  console.log('✗ ADMIN_PASSWORD not found in .env file');
}

console.log('\n');
