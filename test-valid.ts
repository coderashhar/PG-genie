import { validateProfileUpdate } from './src/lib/validation';

const result = validateProfileUpdate({ batch: '2026' }, 'student');
console.log(result);
