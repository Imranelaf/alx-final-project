// InputField.jsx
import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../assets/styles/inputField.css';

const InputField = ({ type, placeholder, value, onChange, onBlur, status, loading }) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`input-field ${status ? status : ''}`}
      />
      <div className="icon-container">
        {loading && <div className="loading-icon"></div>}
        {!loading && status === 'valid' && <FaCheck className="valid-icon" />}
        {!loading && status === 'invalid' && <FaTimes className="invalid-icon" />}
      </div>
    </div>
  );
};

export default InputField;
