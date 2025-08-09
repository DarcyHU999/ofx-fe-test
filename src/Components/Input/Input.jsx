import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './Input.module.css';
import { useDebounce } from '../../Hooks/useDebounce';

const Input = (props) => {
  const {
    className,
    style,
    label,
    value,
    onChange,
    onDebouncingChange,
    onDebouncedValueChange,
    currency,
    leftIcon,
  } = props;

  const [isError, setIsError] = useState(false);
  const [validationStates, setValidationStates] = useState({
    onlyNumbers: 'pending',
    noLeadingDot: 'pending',
    singleDecimal: 'pending',
    maxIntegerDigits: 'pending',
    maxDecimalDigits: 'pending',
  });
  const inputRef = useRef(null);

  // Debounced value + debouncing flag
  const { debouncedValue, isDebouncing } = useDebounce(value);

  // Check if current input is valid
  const isValid = value === '' || 
    (validationStates.onlyNumbers !== 'invalid' && 
    validationStates.noLeadingDot !== 'invalid' && 
    validationStates.singleDecimal !== 'invalid' && 
    validationStates.maxIntegerDigits !== 'invalid' && 
    validationStates.maxDecimalDigits !== 'invalid');

  // Validate current input value
  const validateAmount = (nextValue) => {
    if (nextValue === '') {
      setValidationStates({
        onlyNumbers: 'pending',
        noLeadingDot: 'pending',
        singleDecimal: 'pending',
        maxIntegerDigits: 'pending',
        maxDecimalDigits: 'pending',
      });
      setIsError(false);
      return;
    }

    const onlyNumbersValid = /^[\d.]+$/.test(nextValue);
    const next = {
      onlyNumbers: onlyNumbersValid ? 'valid' : 'invalid',
      noLeadingDot: !nextValue.startsWith('.') ? 'valid' : 'invalid',
      singleDecimal: (nextValue.match(/\./g) || []).length <= 1 ? 'valid' : 'invalid',
      maxIntegerDigits: 'valid',
      maxDecimalDigits: 'valid',
    };

    if (!onlyNumbersValid) {
      next.maxIntegerDigits = 'invalid';
      next.maxDecimalDigits = 'invalid';
    } else {
      const [integerPart, decimalPart = ''] = nextValue.split('.');
      if (integerPart.length > 9) next.maxIntegerDigits = 'invalid';
      if (decimalPart.length > 2) next.maxDecimalDigits = 'invalid';
    }

    setValidationStates(next);
    // Check if any validation rule failed
    const hasErrors = next.onlyNumbers === 'invalid' || 
      next.noLeadingDot === 'invalid' || 
      next.singleDecimal === 'invalid' || 
      next.maxIntegerDigits === 'invalid' || 
      next.maxDecimalDigits === 'invalid';
    setIsError(hasErrors);
  };

  useEffect(() => {
    validateAmount(value);
  }, [value]);

  // Notify parent only when values truly change (prevents render-effect loops)
  const prevDebouncingRef = useRef();
  const prevDebouncedRef = useRef();

  useEffect(() => {
    const nextDebouncing = isDebouncing || !isValid;

    if (
      onDebouncingChange &&
      nextDebouncing !== prevDebouncingRef.current
    ) {
      prevDebouncingRef.current = nextDebouncing;
      onDebouncingChange(nextDebouncing);
    }

    if (
      onDebouncedValueChange &&
      isValid &&
      debouncedValue !== prevDebouncedRef.current
    ) {
      prevDebouncedRef.current = debouncedValue;
      onDebouncedValueChange(debouncedValue);
    }
  }, [isDebouncing, debouncedValue, isValid, onDebouncingChange, onDebouncedValueChange]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const getIndicatorStyle = (state) =>
    state === 'pending' ? classes.pending : state === 'valid' ? classes.valid : classes.invalid;

  const getIndicatorSymbol = (state) =>
    state === 'pending' ? '∙ ' : state === 'valid' ? '✓ ' : '✗ ';

  return (
    <div
      className={`${classes.container} ${className}`}
      style={style}
      onClick={handleContainerClick}
    >
      {label && (
        <span className={`${classes.label} ${isError ? classes.errorLabel : ''}`}>
          {isError ? 'Please enter a valid amount' : label}
        </span>
      )}

      <div className={`${classes.inputWrapper} ${isError ? classes.errorInputWrapper : ''}`}>
        {leftIcon}
        <input
          type="text"
          ref={inputRef}
          className={classes.input}
          placeholder="00.00"
          value={value}
          onChange={onChange}
          maxLength={12}
        />
        <span className={classes.currency}>{currency}</span>
      </div>

      {/* compact validation indicators */}
      <div className={classes.validationIndicators}>
        <div className={`${classes.indicator} ${getIndicatorStyle(validationStates.onlyNumbers)}`}>
          <span className={classes.symbol}>{getIndicatorSymbol(validationStates.onlyNumbers)}</span>
          Only numbers and decimal point
        </div>
        <div className={`${classes.indicator} ${getIndicatorStyle(validationStates.noLeadingDot)}`}>
          <span className={classes.symbol}>{getIndicatorSymbol(validationStates.noLeadingDot)}</span>
          No leading decimal point
        </div>
        <div className={`${classes.indicator} ${getIndicatorStyle(validationStates.singleDecimal)}`}>
          <span className={classes.symbol}>{getIndicatorSymbol(validationStates.singleDecimal)}</span>
          Single decimal point
        </div>
        <div className={`${classes.indicator} ${getIndicatorStyle(validationStates.maxIntegerDigits)}`}>
          <span className={classes.symbol}>{getIndicatorSymbol(validationStates.maxIntegerDigits)}</span>
          Max 9 integer digits
        </div>
        <div className={`${classes.indicator} ${getIndicatorStyle(validationStates.maxDecimalDigits)}`}>
          <span className={classes.symbol}>{getIndicatorSymbol(validationStates.maxDecimalDigits)}</span>
          Max 2 decimal digits
        </div>
      </div>
    </div>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onDebouncingChange: PropTypes.func,
  onDebouncedValueChange: PropTypes.func,
  currency: PropTypes.string,
  leftIcon: PropTypes.element,
};

export default Input;