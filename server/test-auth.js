const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Test password hashing
const testPassword = 'testpassword123';
const saltRounds = 10;

bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) throw err;
  bcrypt.hash(testPassword, salt, (err, hash) => {
    if (err) throw err;
    console.log('Original password:', testPassword);
    console.log('Hashed password:', hash);
    
    // Test password verification
    bcrypt.compare(testPassword, hash, (err, isMatch) => {
      if (err) throw err;
      console.log('Password match:', isMatch);
    });
    
    // Test JWT token generation
    const userId = 'test-user-id-123';
    const token = jwt.sign({ userId }, 'test-secret', { expiresIn: '1h' });
    console.log('JWT Token:', token);
    
    // Test JWT token verification
    jwt.verify(token, 'test-secret', (err, decoded) => {
      if (err) throw err;
      console.log('Decoded token:', decoded);
    });
  });
});