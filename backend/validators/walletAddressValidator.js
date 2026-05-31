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

// Validation middleware for addExpertTraders input
const addWalletAddressValidator = [
    // body('userData')
    //   .notEmpty().withMessage('Please fill in the required fields'),
  
    body('userData.walletName')
      .notEmpty().withMessage('walletName is required')
      .isString().withMessage("walletName must be a string")
    //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
    //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
      .isLength({ max: 100 }).withMessage('walletName cannot exceed 100 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('walletName contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('walletName cannot be empty or contain HTML entities')) : value;
      }),
  
    body('userData.walletSymbol')
      .notEmpty().withMessage('walletSymbol is required')
      .isString().withMessage("walletSymbol must be a string")
    //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
      .isLength({ max: 50 }).withMessage('walletSymbol cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('walletSymbol contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('walletSymbol cannot be empty or contain HTML entities')) : value;
      }),
  
    body('userData.walletAddress')
      .notEmpty().withMessage('walletAddress is required')
      .isString().withMessage("walletAddress must be a string")
    //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
      .isLength({ max: 200 }).withMessage('walletAddress cannot exceed 200 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('walletAddress contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('walletAddress cannot be empty or contain HTML entities')) : value;
      }),
      
    body('userData.walletPhoto')
      .notEmpty().withMessage('walletPhoto is required')
      .isString().withMessage("walletPhoto must be a string")
    //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
      .isLength({ max: 100 }).withMessage('walletPhoto cannot exceed 100 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('walletPhoto contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('walletPhoto cannot be empty or contain HTML entities')) : value;
      }),
  
    
  ];

// Validation middleware for updateWalletAddress input
const updateWalletAddressValidator = [
  // body('userData')
  //   .notEmpty().withMessage('Please fill in the required fields'),

  body('walletName')
    .notEmpty().withMessage('walletName is required')
    .isString().withMessage("walletName must be a string")
  //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
  //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ max: 100 }).withMessage('walletName cannot exceed 100 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('walletName contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('walletName cannot be empty or contain HTML entities')) : value;
    }),

  body('walletSymbol')
    .notEmpty().withMessage('walletSymbol is required')
    .isString().withMessage("walletSymbol must be a string")
  //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
    .isLength({ max: 50 }).withMessage('walletSymbol cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('walletSymbol contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('walletSymbol cannot be empty or contain HTML entities')) : value;
    }),

  body('walletAddress')
    .notEmpty().withMessage('walletAddress is required')
    .isString().withMessage("walletAddress must be a string")
  //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
    .isLength({ max: 200 }).withMessage('walletAddress cannot exceed 200 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('walletAddress contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('walletAddress cannot be empty or contain HTML entities')) : value;
    }),
    
  
];

// Export the validation middleware
module.exports = { addWalletAddressValidator, updateWalletAddressValidator };



    // body('userData.winRate')
    //   .isNumeric().withMessage('Win rate must be a number')
    //   .isFloat({ min: 0, max: 100 }).withMessage('Win rate must be between 0 and 100'),