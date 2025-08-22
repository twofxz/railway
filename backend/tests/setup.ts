import { beforeAll } from 'vitest';
import dotenv from 'dotenv';

// Load test environment variables
beforeAll(() => {
  dotenv.config({ path: '.env.test' });
});