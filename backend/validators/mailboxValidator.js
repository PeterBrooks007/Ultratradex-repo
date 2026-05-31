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

  
   // Validation middleware for addmail input with messages array
const addmailValidator = [
  body('userId')
    .notEmpty().withMessage('userId is required')
    .isString().withMessage("userId must be a string")
    .isLength({ max: 254 }).withMessage('userId cannot exceed 254 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('userId contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('userId cannot be empty or contain HTML entities')) : value;
    }),

  body('messages').isArray({ min: 1 }).withMessage('Messages must be an array and contain at least one message'),

  body('messages.*.from')
    .notEmpty().withMessage('from is required')
    .isString().withMessage("from must be a string")
    .isLength({ max: 254 }).withMessage('from cannot exceed 254 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('from contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('from cannot be empty or contain HTML entities')) : value;
    }),

  body('messages.*.to')
    .notEmpty().withMessage('to is required')
    .isString().withMessage("to must be a string")
    .isLength({ max: 254 }).withMessage('Sender cannot exceed 254 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('to contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('to cannot be empty or contain HTML entities')) : value;
    }),

  body('messages.*.subject')
    .optional() // Subject is optional
    .isString().withMessage("Subject must be a string")
    .isLength({ max: 255 }).withMessage('Subject cannot exceed 255 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('Subject contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('Subject cannot be empty or contain HTML entities')) : value;
    }),

  body('messages.*.content')
    .notEmpty().withMessage('Content is required')
    .isString().withMessage("Content must be a string")
    .isLength({ max: 1000 }).withMessage('Content cannot exceed 1000 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('Content contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('Content cannot be empty or contain HTML entities')) : value;
    }),
  
    
  ];




 // Validation middleware for StarredMail input with messages array
const adminStarredMailValidator = [
  // Validate messageData
  body('messageData.messageData')
  .isArray({ min: 1 }).withMessage('messageData must be an array and contain at least one message'),

body('messageData.messageData.*.messageId')
  .notEmpty().withMessage('messageId is required')
  .isString().withMessage('messageId must be a string')
  .isLength({ max: 254 }).withMessage('messageId cannot exceed 254 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value);

    if (sanitizedValue !== decodedValue) {
      throw new Error('messageId contains invalid or malicious content');
    }
    return value.trim() === '' ? 
      Promise.reject(new Error('messageId cannot be empty or contain HTML entities')) : value;
  }),

body('messageData.messageData.*.userId')
  .notEmpty().withMessage('userId is required')
  .isString().withMessage('userId must be a string')
  .isLength({ max: 254 }).withMessage('userId cannot exceed 254 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value);

    if (sanitizedValue !== decodedValue) {
      throw new Error('userId contains invalid or malicious content');
    }
    return value.trim() === '' ? 
      Promise.reject(new Error('userId cannot be empty or contain HTML entities')) : value;
  }),

body('messageData.from')
  .notEmpty().withMessage('from is required')
  .isString().withMessage('from must be a string')
  .isLength({ max: 254 }).withMessage('from cannot exceed 254 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value);

    if (sanitizedValue !== decodedValue) {
      throw new Error('from contains invalid or malicious content');
    }
    return value.trim() === '' ? 
      Promise.reject(new Error('from cannot be empty or contain HTML entities')) : value;
  }),
];


// Export the validation middleware
module.exports = { addmailValidator, adminStarredMailValidator };
