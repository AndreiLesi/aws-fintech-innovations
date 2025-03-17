/**
 * Validates if a string is a valid email address
 * @param {string} email - The email to validate
 * @returns {Object} - Object with isValid and message properties
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validates if a string is a valid email address (alternative name)
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a value is a valid amount (positive number)
 * @param {string|number} amount - The amount to validate
 * @returns {Object} - Object with isValid and message properties
 */
export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, message: 'Please enter a valid number' };
  }
  if (numAmount <= 0) {
    return { isValid: false, message: 'Amount must be greater than zero' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validates if a password meets security requirements
 * @param {string} password - The password to validate
 * @returns {Object} - Object with isValid and message properties
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validates if required fields are present in an object
 * @param {Object} data - The data object to validate
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Object} - Object with isValid and errors properties
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  let isValid = true;

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors[field] = `This field is required`;
      isValid = false;
    }
  });

  return { isValid, errors };
}; 