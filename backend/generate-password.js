import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'admin123';

console.log('\n===========================================');
console.log('Password Hash Generator');
console.log('===========================================\n');
console.log(`Password: ${password}`);
console.log(`Hashed:   ${bcrypt.hashSync(password, 10)}`);
console.log('\nCopy the hashed value to your .env file as ADMIN_PASSWORD\n');
