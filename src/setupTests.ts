/**
 * Test setup for React components using Vitest and Testing Library.
 */

import '@testing-library/jest-dom';

// Mock environment variables for tests
Object.defineProperty(import.meta.env, 'VITE_API_BASE_URL', {
  value: 'http://localhost:8000',
  writable: true
});