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

// Validation middleware for addTradingBots input
const addTradingSignalsValidator = [
    // body('userData')
    //   .notEmpty().withMessage('Please fill in the required fields'),
  
    body('userData.name')
      .notEmpty().withMessage(' Signal name is required')
      .isString().withMessage("Signal name must be a string")
    //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
    //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
      .isLength({ max: 50 }).withMessage(' Signal name cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error(' Signal name contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error(' Signal name cannot be empty or contain HTML entities')) : value;
      }),
    body('userData.price')
      .notEmpty().withMessage(' price is required')
      .isNumeric().withMessage(" price must be a number")
      // .isFloat({ min: 0, max: 99999 }).withMessage('Price must be between 0 and 99999') // Min and Max value check
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error(' price contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error(' price cannot be empty or contain HTML entities')) : value;
      }),
  
    body('userData.dailyTrades')
    .notEmpty().withMessage('dailyTrades is required')
    .isNumeric().withMessage("dailyTrades must be a number")
    .isFloat({ min: 0, max: 1000 }).withMessage('dailyTrades must be between 0 and 1000') // Min and Max value check
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
    
        if (sanitizedValue !== decodedValue) {
          throw new Error('dailyTrades invalid or malicious content');
        }
    
        return value.trim() === '' ? 
          Promise.reject(new Error('dailyTrades cannot be empty or contain HTML entities')) : value;
      }),


      body('userData.winRate')
      .notEmpty().withMessage('Win Rate is required')
      .isString().withMessage("Win Rate must be a string")
      .isLength({ max: 10 }).withMessage('Win Rate cannot exceed 10 characters')
      .matches(/^[0-9%]+$/).withMessage('Win rate must contain only numbers, or the "%" symbol ')
      .custom((value) => {
        // Check if the value contains the "%" symbol
        const hasPercentage = value.includes('%');
        
        // Parse the numeric part (ignore the "%" for parsing)
        const numericValue = parseFloat(value.replace('%', '').trim());
   
        // If "%" is included, ensure it's only at the end of the string
        if (hasPercentage && value.indexOf('%') !== value.length - 1) {
          throw new Error('The "%" symbol must be at the end if included in the win rate');
        }
    
        return true; // Return true if all checks pass
      })
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
    
        if (sanitizedValue !== decodedValue) {
          throw new Error('Win Rate contains invalid or malicious content');
        }
    
        return value.trim() === '' ? 
          Promise.reject(new Error('Win Rate cannot be empty or contain HTML entities')) : value;
      }),
      
  
    body('userData.comment')
      .notEmpty().withMessage('Short Info is required')
      .isString().withMessage("Short Info must be a string")
      .isLength({ max: 200 }).withMessage('Comment cannot exceed 200 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
    
        if (sanitizedValue !== decodedValue) {
          throw new Error('Short Info contains invalid or malicious content');
        }
    
        return value.trim() === '' ? 
          Promise.reject(new Error('Short Info cannot be empty or contain HTML entities')) : value;
      }),
  ];

// Validation middleware for updateExpertTrader input
const updateTradingSignalsValidator = [
  
  body('name')
  .notEmpty().withMessage('Signal name is required')
  .isString().withMessage("Signal name must be a string")
//   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
//   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
  .isLength({ max: 50 }).withMessage(' Signal name cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error(' Signal name contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error(' Signal name cannot be empty or contain HTML entities')) : value;
  }),
  
  body('price')
  .isFloat().withMessage('price must be a valid number')
  .notEmpty().withMessage('price is required'),

  body('dailyTrades')
  .isFloat().withMessage('dailyTrades must be a valid number')
  .notEmpty().withMessage('dailyTrades is required'),


  body('winRate')
  .notEmpty().withMessage('Win Rate is required')
  .isString().withMessage("Win Rate must be a string")
  .isLength({ max: 10 }).withMessage('Win Rate cannot exceed 10 characters')
  .matches(/^[0-9%]+$/).withMessage('Win rate must contain only numbers, or the "%" symbol ')
  .custom((value) => {
    // Check if the value contains the "%" symbol
    const hasPercentage = value.includes('%');
    
    // Parse the numeric part (ignore the "%" for parsing)
    const numericValue = parseFloat(value.replace('%', '').trim());

    // If "%" is included, ensure it's only at the end of the string
    if (hasPercentage && value.indexOf('%') !== value.length - 1) {
      throw new Error('The "%" symbol must be at the end if included in the win rate');
    }

    return true; // Return true if all checks pass
  })
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('Win Rate contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('Win Rate cannot be empty or contain HTML entities')) : value;
  }),
  

body('comment')
  .notEmpty().withMessage('Short Info is required')
  .isString().withMessage("Short Info must be a string")
  .isLength({ max: 200 }).withMessage('Comment cannot exceed 200 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('Short Info contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('Short Info cannot be empty or contain HTML entities')) : value;
  }),
    
  ];

// Export the validation middleware
module.exports = { addTradingSignalsValidator, updateTradingSignalsValidator };
