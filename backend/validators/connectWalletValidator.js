const { body, validationResult } = require('express-validator');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Create a DOMPurify instance using jsdom
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Helper function to decode HTML entities
function decodeEntities(encodedString) {
    const textarea = window.document.createElement("textarea");
    textarea.innerHTML = encodedString;
    return textarea.value;
  }

// Validation middleware for addConnectWallet input
const addConnectWalletValidator = [
    // body('userData')
    //   .notEmpty().withMessage('Please fill in the required fields'),
  
    body('userData.name')
      .notEmpty().withMessage(' Wallet name is required')
      .isString().withMessage("Wallet name must be a string")
    //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
    //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
      .isLength({ max: 100 }).withMessage(' Wallet name cannot exceed 100 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error(' Wallet name contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error(' Wallet name cannot be empty or contain HTML entities')) : value;
      }),
    
  ];

// Validation middleware for updateExpertTrader input
const updateConnectWalletValidator = [
  
  body('name')
  .notEmpty().withMessage(' Wallet name is required')
  .isString().withMessage("Wallet name must be a string")
//   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
//   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
  .isLength({ max: 100 }).withMessage(' Wallet name cannot exceed 100 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error(' Wallet name contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error(' Wallet name cannot be empty or contain HTML entities')) : value;
  }),
    
  ];

// Export the validation middleware
module.exports = { addConnectWalletValidator, updateConnectWalletValidator };
