import { firstNameValidator, lastNameValidator, usernameValidator, emailValidator, passwordValidator } from './validators.js';

// Combine all sign-up validations in one middleware array
export const validateSignUpFields = [
  firstNameValidator(),              // Validates firstName from body
  lastNameValidator(),               // Validates lastName from body
  ...usernameValidator('body'),      // Use `body` for username validation
  ...emailValidator('body'),         // Use `body` for email validation
  passwordValidator(),               // Validates password from body
];
