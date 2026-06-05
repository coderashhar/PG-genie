const { validateProfileUpdate } = require('./src/lib/validation');

const body = {
  name: 'Aryan Patel',
  email: 'aryan@vitstudent.ac.in',
  phone: '+919988776655',
  batch: '2026'
};

const result = validateProfileUpdate(body, 'student');
console.log(result);
