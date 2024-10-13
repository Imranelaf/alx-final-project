import React from 'react';

const ErrorDisplay = ({ errors }) => {
  // Check if there are no errors or if errors is not an array
  if (!errors || !Array.isArray(errors) || errors.length === 0) {
    return null; // Don't render anything if there are no errors
  }

  // Group errors by field
  const groupedErrors = errors.reduce((acc, error) => {
    const field = error.field || 'general'; // Use 'general' if field is not specified
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(error.message);
    return acc;
  }, {});

  return (
    <div className="error-display">
      {Object.entries(groupedErrors).map(([field, messages]) => (
        <div key={field} className="error-category">
          <h4>{field.charAt(0).toUpperCase() + field.slice(1)}:</h4>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ErrorDisplay;

