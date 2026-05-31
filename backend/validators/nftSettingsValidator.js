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

// Validation middleware for addNft input
const addNftValidator = [
    // body('userData')
    //   .notEmpty().withMessage('Please fill in the required fields'),
  
    body('userData.nftName')
      .notEmpty().withMessage('nftName is required')
      .isString().withMessage("nftName must be a string")
      .isLength({ max: 50 }).withMessage('nftName cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('nftName contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('nftName cannot be empty or contain HTML entities')) : value;
      }),
  
    body('userData.nftPrice')
    .isFloat().withMessage('nftPrice must be a valid number')
    .notEmpty().withMessage('nftPrice is required'),
  
    body('userData.nftCode')
      .notEmpty().withMessage('nftCode is required')
      .isString().withMessage("nftCode must be a string")
      .isLength({ max: 50 }).withMessage('nftCode cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('nftCode contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('nftCode cannot be empty or contain HTML entities')) : value;
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


// Validation middleware for updateNft input
const updateNftValidator = [
    // body('userData')
    //   .notEmpty().withMessage('Please fill in the required fields'),
  
    body('nftName')
      .notEmpty().withMessage('nftName is required')
      .isString().withMessage("nftName must be a string")
      .isLength({ max: 50 }).withMessage('nftName cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('nftName contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('nftName cannot be empty or contain HTML entities')) : value;
      }),
  
    body('nftPrice')
    .isFloat().withMessage('nftPrice must be a valid number')
    .notEmpty().withMessage('nftPrice is required'),
  
    body('nftCode')
      .notEmpty().withMessage('nftCode is required')
      .isString().withMessage("nftCode must be a string")
      .isLength({ max: 50 }).withMessage('nftCode cannot exceed 50 characters')
      .customSanitizer(value => purify.sanitize(value))
      .custom(value => {
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('nftCode contains invalid or malicious content');
        }
  
        return value.trim() === '' ? 
          Promise.reject(new Error('nftCode cannot be empty or contain HTML entities')) : value;
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
module.exports = { addNftValidator, updateNftValidator };



    // body('userData.winRate')
    //   .isNumeric().withMessage('Win rate must be a number')
    //   .isFloat({ min: 0, max: 100 }).withMessage('Win rate must be between 0 and 100'),