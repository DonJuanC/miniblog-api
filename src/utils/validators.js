const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (value) =>
  typeof value === "string" && EMAIL_REGEX.test(value);

const isPositiveInteger = (value) => {
  if (typeof value === "string" && !/^\d+$/.test(value.trim())) return false;
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

module.exports = { isNonEmptyString, isValidEmail, isPositiveInteger };
