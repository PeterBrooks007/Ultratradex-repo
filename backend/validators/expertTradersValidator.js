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
const addExpertTradersValidator = [
    // body('userData')
    //   .notEmpty().withMessage('Please fill in the required fields'),
  
    body('userData.firstname')
      .notEmpty().withMessage('First name is required')
      .isString().withMessage("Firstname must be a string")
    //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
    //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
      .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('First name contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('First name cannot be empty or contain HTML entities')) : value;
      }),
  
    body('userData.lastname')
      .notEmpty().withMessage('Last name is required')
      .isString().withMessage("Lastname must be a string")
    //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
      .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('Lastname contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('Lastname cannot be empty or contain HTML entities')) : value;
      }),
  
    body('userData.email')
      .notEmpty().withMessage('Email is required')
      .isString().withMessage("Email must be a string")
      .isEmail().withMessage('Email is not valid')
      .isLength({ max: 100 }).withMessage('Email cannot exceed 100 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('Email contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('Email cannot be empty or contain HTML entities')) : value;
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
        
        // Validate that it's a number and falls within the range
        // if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
        //   throw new Error('Win rate must be a number between 0 and 100');
        // }
    
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
      
  
    body('userData.profitShare')
    .notEmpty().withMessage('profit Share is required')
    .isString().withMessage("profit Share must be a string")
    .isLength({ max: 10 }).withMessage('Profit Share cannot exceed 10 characters')
    .matches(/^[0-9%]+$/).withMessage('Profit Share must contain only numbers, or the "%" symbol ')
    .custom((value) => {
      // Check if the value contains the "%" symbol
      const hasPercentage = value.includes('%');
      // Parse the numeric part (ignore the "%" for parsing)
      const numericValue = parseFloat(value.replace('%', '').trim());
  
      // If "%" is included, ensure it's only at the end of the string
      if (hasPercentage && value.indexOf('%') !== value.length - 1) {
        throw new Error('The "%" symbol must be at the end if included in the profit Share');
      }
  
      return true; // Return true if all checks pass
    }).customSanitizer(value => purify.sanitize(value))
    .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
    
        if (sanitizedValue !== decodedValue) {
          throw new Error('Profit contains invalid or malicious content');
        }
    
        return value.trim() === '' ? 
          Promise.reject(new Error('Profit cannot be empty or contain HTML entities')) : value;
      }),

    body('userData.comment')
      .notEmpty().withMessage('Comment is required')
      .isString().withMessage("Comment must be a string")
      .isLength({ max: 200 }).withMessage('Comment cannot exceed 200 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
    
        if (sanitizedValue !== decodedValue) {
          throw new Error('Comment contains invalid or malicious content');
        }
    
        return value.trim() === '' ? 
          Promise.reject(new Error('Comment cannot be empty or contain HTML entities')) : value;
      }),
  ];

// Validation middleware for updateExpertTrader input
const updateExpertTraderValidator = [
    // body('userData')
    //   .notEmpty().withMessage('Please fill in the required fields'),
  
    body('firstname')
      .notEmpty().withMessage('First name is required')
      .isString().withMessage("Firstname must be a string")
    //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
      .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('First name contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('First name cannot be empty or contain HTML entities')) : value;
      }),
  
    body('lastname')
      .notEmpty().withMessage('Last name is required')
      .isString().withMessage("Lastname must be a string")
    //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
      .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('Lastname contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('Lastname cannot be empty or contain HTML entities')) : value;
      }),
  
    body('email')
      .notEmpty().withMessage('Email is required')
      .isString().withMessage("Email must be a string")
      .isEmail().withMessage('Email is not valid')
      .isLength({ max: 100 }).withMessage('Email cannot exceed 100 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('Email contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('Email cannot be empty or contain HTML entities')) : value;
      }),
  
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
        
        // Validate that it's a number and falls within the range
        // if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
        //   throw new Error('Win rate must be a number between 0 and 100');
        // }
    
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
    
      
  
    body('profitShare')
    .notEmpty().withMessage('profit Share is required')
    .isString().withMessage("profit Share must be a string")
    .isLength({ max: 10 }).withMessage('Profit Share cannot exceed 10 characters')
    .matches(/^[0-9%]+$/).withMessage('Profit Share must contain only numbers, or the "%" symbol ')
    .custom((value) => {
      // Check if the value contains the "%" symbol
      const hasPercentage = value.includes('%');
      // Parse the numeric part (ignore the "%" for parsing)
      const numericValue = parseFloat(value.replace('%', '').trim());
  
      // If "%" is included, ensure it's only at the end of the string
      if (hasPercentage && value.indexOf('%') !== value.length - 1) {
        throw new Error('The "%" symbol must be at the end if included in the profit Share');
      }
  
      return true; // Return true if all checks pass
    }).customSanitizer(value => purify.sanitize(value))
    .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
    
        if (sanitizedValue !== decodedValue) {
          throw new Error('Profit Share contains invalid or malicious content');
        }
    
        return value.trim() === '' ? 
          Promise.reject(new Error('Profit Share cannot be empty or contain HTML entities')) : value;
      }),
    

    body('comment')
      .notEmpty().withMessage('Comment is required')
      .isString().withMessage("Comment must be a string")
      .isLength({ max: 200 }).withMessage('Comment cannot exceed 200 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
    
        if (sanitizedValue !== decodedValue) {
          throw new Error('Comment contains invalid or malicious content');
        }
    
        return value.trim() === '' ? 
          Promise.reject(new Error('Comment cannot be empty or contain HTML entities')) : value;
      }),
    
  ];

// Export the validation middleware
module.exports = { addExpertTradersValidator, updateExpertTraderValidator };



    // body('userData.winRate')
    //   .isNumeric().withMessage('Win rate must be a number')
    //   .isFloat({ min: 0, max: 100 }).withMessage('Win rate must be between 0 and 100'),