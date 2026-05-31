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
const addTradingSettingsValidator = [
    // body('userData')
    //   .notEmpty().withMessage('Please fill in the required fields'),
  
    body('userData.exchangeType')
      .notEmpty().withMessage('exchangeType is required')
      .isString().withMessage("exchangeType must be a string")
    //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
    //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
      .isLength({ max: 100 }).withMessage('exchangeType cannot exceed 100 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('exchangeType contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('exchangeType cannot be empty or contain HTML entities')) : value;
      }),
    
  ];

// Validation middleware for updateExpertTrader input
const updateTradingSettingsValidator = [
  
  body('exchangeType')
  .notEmpty().withMessage(' exchangeType is required')
  .isString().withMessage("ExchangeType must be a string")
//   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
//   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
  .isLength({ max: 100 }).withMessage(' ExchangeType cannot exceed 100 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error(' ExchangeType contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error(' ExchangeType cannot be empty or contain HTML entities')) : value;
  }),
    
  ];


// Validation and sanitization middleware for addTradingPairs input
const addTradingPairsValidator = [
  body('tradingPairsArray')
    .isArray({ min: 1 }).withMessage('tradingPairsArray must be an array and contain at least one element')
    .custom((value) => value.every(item => typeof item === 'string'))
    .withMessage('Each element in tradingPairsArray must be a string')
    .customSanitizer((value) => 
      value.map(item => purify.sanitize(item)) // Sanitize each item in the array
    )
    .custom((value) => {
      value.forEach(item => {
        const decodedValue = decodeEntities(item); // Decode any HTML entities
        const sanitizedValue = purify.sanitize(item); // Re-sanitize to remove any malicious code

        if (sanitizedValue !== decodedValue) {
          throw new Error('tradingPairsArray contains invalid or malicious content');
        }

        if (item.trim() === '') {
          throw new Error('tradingPairsArray cannot contain empty values or HTML entities');
        }
      });
      return true;
    }),
];

// Export the validation middleware
module.exports = { addTradingSettingsValidator, updateTradingSettingsValidator, addTradingPairsValidator };
