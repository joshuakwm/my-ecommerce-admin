import { body, validationResult } from 'express-validator';
import { ApiError } from '../errors/index.js';
import { 
  createProductSchema,
  updateProductSchema,
  productFilterSchema 
} from '../validators/productSchema.js';

// Customer validation rules
export const validateCustomer = [
  // Name validation
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
    
  // Email validation
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .isLength({ max: 255 }).withMessage('Email must be less than 255 characters'),
    
  // Phone validation
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Phone must be less than 20 characters')
    .matches(/^[+]?[0-9\s-]*$/).withMessage('Invalid phone number format'),
    
  // Address validation
  body('address')
    .optional()
    .isObject().withMessage('Address must be an object')
    .custom(value => {
      if (value) {
        const allowedKeys = ['street', 'city', 'state', 'postal_code', 'country'];
        const invalidKeys = Object.keys(value).filter(key => !allowedKeys.includes(key));
        if (invalidKeys.length > 0) {
          throw new Error(`Invalid address fields: ${invalidKeys.join(', ')}`);
        }
      }
      return true;
    }),
    
  // Newsletter opt-in validation
  body('newsletter_opt_in')
    .optional()
    .isBoolean().withMessage('Newsletter opt-in must be a boolean value')
];

// Product validation middleware
export const validateCreateProduct = (req, res, next) => {
  const { error } = createProductSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return next(new ApiError(400, errorMessages.join(', ')));
  }
  next();
};

export const validateUpdateProduct = (req, res, next) => {
  const { error } = updateProductSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return next(new ApiError(400, errorMessages.join(', ')));
  }
  next();
};

// Product filter validation
export const validateProductFilter = (req, res, next) => {
  const { error } = productFilterSchema.validate(req.query, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return next(new ApiError(400, errorMessages.join(', ')));
  }
  next();
};

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new ApiError(400, errorMessages.join(', ')));
  }
  next();
};
