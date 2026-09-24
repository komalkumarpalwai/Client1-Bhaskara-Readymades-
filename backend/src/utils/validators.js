/**
 * Basic validation utility helpers for request payloads
 */

export const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidEmail = (email) => {
  if (!isNonEmptyString(email)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isPositiveNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && value > 0;
};
