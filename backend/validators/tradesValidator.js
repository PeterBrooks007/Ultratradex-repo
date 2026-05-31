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

  
   // Validation middleware for addTrade input with messages array
const addTradeValidator = [
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



    body('tradeData.tradingMode')
    .notEmpty().withMessage('tradingMode is required')
    .isString().withMessage("tradingMode must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('tradingMode contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('tradingMode cannot be empty or contain HTML entities')) : value;
    }),

    body('tradeData.exchangeType')
    .notEmpty().withMessage('exchangeType is required')
    .isString().withMessage("exchangeType must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('exchangeType contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('exchangeType cannot be empty or contain HTML entities')) : value;
    }),

    body('tradeData.exchangeTypeIcon')
    .notEmpty().withMessage('exchangeTypeIcon is required')
    .isString().withMessage("exchangeTypeIcon must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('exchangeTypeIcon contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('exchangeTypeIcon cannot be empty or contain HTML entities')) : value;
    }),

    body('tradeData.symbols')
    .notEmpty().withMessage('symbols is required')
    .isString().withMessage("symbols must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('symbols contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('symbols cannot be empty or contain HTML entities')) : value;
    }),

    body('tradeData.type')
    .notEmpty().withMessage('type is required')
    .isString().withMessage("type must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('type contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('type cannot be empty or contain HTML entities')) : value;
    }),

    body('tradeData.buyOrSell')
    .notEmpty().withMessage('buyOrSell is required')
    .isString().withMessage("buyOrSell must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('buyOrSell contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('buyOrSell cannot be empty or contain HTML entities')) : value;
    }),

  body('tradeData.price')
  .isFloat().withMessage('price must be a valid number')
  .notEmpty().withMessage('price is required'),


  body('tradeData.units')
  .isFloat().withMessage('units must be a valid number')
  .notEmpty().withMessage('units is required'),


  body('tradeData.ticks')
  .notEmpty().withMessage('ticks is required')
  .isString().withMessage("ticks must be a string")
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value);

    if (sanitizedValue !== decodedValue) {
      throw new Error('ticks contains invalid or malicious content');
    }
    return value.trim() === '' ? 
      Promise.reject(new Error('ticks cannot be empty or contain HTML entities')) : value;
  }),

    
  body('tradeData.risk')
    .notEmpty().withMessage('risk is required')
    .isString().withMessage("risk must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('risk contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('risk cannot be empty or contain HTML entities')) : value;
    }),
  




  body('tradeData.riskPercentage')
    .notEmpty().withMessage('riskPercentage is required')
    .isString().withMessage("riskPercentage must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('riskPercentage contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('riskPercentage cannot be empty or contain HTML entities')) : value;
    }),

      
  body('tradeData.amount')
  .isFloat().withMessage('amount must be a valid number')
  .notEmpty().withMessage('amount is required'),

  body('tradeData.profitOrLossAmount')
  .isFloat().withMessage('profitOrLossAmount must be a valid number')
  .notEmpty().withMessage('profitOrLossAmount is required'),



  body('tradeData.open')
    .notEmpty().withMessage('open is required')
    .isString().withMessage("open must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('open contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('open cannot be empty or contain HTML entities')) : value;
    }),

  body('tradeData.close')
    .notEmpty().withMessage('close is required')
    .isString().withMessage("close must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('close contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('close cannot be empty or contain HTML entities')) : value;
    }),

  body('tradeData.longOrShortUnit')
    .notEmpty().withMessage('longOrShortUnit is required')
    .isString().withMessage("longOrShortUnit must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('longOrShortUnit contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('longOrShortUnit cannot be empty or contain HTML entities')) : value;
    }),

  body('tradeData.roi')
    .notEmpty().withMessage('roi is required')
    .isString().withMessage("roi must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('roi contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('roi cannot be empty or contain HTML entities')) : value;
    }),

    body('tradeData.status')
    .notEmpty().withMessage('status is required')
    .isString().withMessage("status must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error('status contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('status cannot be empty or contain HTML entities')) : value;
    }),

    

  body('tradeData.expireTime')
  .notEmpty().withMessage('expireTime is required')
  .isString().withMessage("expireTime must be a string")
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value);

    if (sanitizedValue !== decodedValue) {
      throw new Error('expireTime contains invalid or malicious content');
    }
    return value.trim() === '' ? 
      Promise.reject(new Error('expireTime cannot be empty or contain HTML entities')) : value;
  }),




 
    
  ];






// Export the validation middleware
module.exports = { addTradeValidator };
