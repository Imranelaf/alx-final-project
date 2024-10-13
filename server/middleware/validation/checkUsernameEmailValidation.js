import { usernameValidator, emailValidator } from './validators.js';

// Validation for checking username in URL param
export const validateUsernameParam = usernameValidator('param'); // for api/auth/check-username/:username

// Validation for checking email in URL param
export const validateEmailParam = emailValidator('param');  // for api/auth/check-email/:email
