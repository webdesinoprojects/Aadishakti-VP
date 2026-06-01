import bcrypt from 'bcryptjs';

const password = 'admin123';
const hash = '$2a$10$N9qo8uLOickgx2ZtsYvAeOv3cy3pjzZXrKUIkI7mXJuEH7qQbZqm6';

console.log('\n===========================================');
console.log('Testing Password Hash');
console.log('===========================================\n');
console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
console.log(`Match: ${bcrypt.compareSync(password, hash)}`);
console.log('\n===========================================');
console.log('Generating Fresh Hash');
console.log('===========================================\n');
const freshHash = bcrypt.hashSync(password, 10);
console.log(`Fresh Hash: ${freshHash}`);
console.log(`Fresh Match: ${bcrypt.compareSync(password, freshHash)}`);
console.log('\n');
