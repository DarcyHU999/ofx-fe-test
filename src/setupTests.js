// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Silence console.error across tests to avoid noisy logs from intentional failure paths
// If you need to debug locally, comment out the line below.
jest.spyOn(console, 'error').mockImplementation(() => {});
