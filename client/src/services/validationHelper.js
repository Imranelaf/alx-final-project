export const validateField = async (field, value, setLoading, setStatus, setError, validationService) => {
  if (value) {
    setLoading(true);
    setStatus(null);
    setError('');

    try {
      const response = await validationService(value); // Call the validation service
      if (response.data.success) {
        setStatus('valid'); // Change 'available' to 'valid'
      } else {
        setStatus('invalid'); // Change 'taken' to 'invalid'
        setError(response.data.error.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setStatus('invalid'); // Change 'taken' to 'invalid'
        setError(`This ${field} is already registered.`);
      } else {
        setStatus('error');
        setError(`Error checking ${field} availability.`);
      }
    } finally {
      setLoading(false);
    }
  }
};

