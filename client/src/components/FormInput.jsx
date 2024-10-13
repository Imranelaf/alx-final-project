import React from 'react';
import '../assets/styles/formInput.css';

const FormInput = ({ type, placeholder, value, onChange, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      required
      className={className}
      value={value}
      onChange={onChange}
    />
  );
};

export default FormInput;

