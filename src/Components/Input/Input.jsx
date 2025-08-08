import React, { useState, useRef, useEffect, useCallback } from 'react';      
import classes from './Input.module.css';
import PropTypes from 'prop-types';
import { useDebounce } from '../../Hooks/useDebounce';

const Input = (props) => {
    const [isError, setIsError] = useState(false);
    // Validation states: pending/valid/invalid for each rule
    const [validationStates, setValidationStates] = useState({
        onlyNumbers: 'pending',
        noLeadingDot: 'pending',
        singleDecimal: 'pending',
        maxIntegerDigits: 'pending',
        maxDecimalDigits: 'pending'
    });
    const inputRef = useRef(null);

    // Debounce input value with loading state
    const { debouncedValue, isDebouncing } = useDebounce(props.value);

    // Validate amount input with real-time feedback
    const validateAmount = (value) => {
        if (value === '') {
            setValidationStates({
                onlyNumbers: 'pending',
                noLeadingDot: 'pending',
                singleDecimal: 'pending',
                maxIntegerDigits: 'pending',
                maxDecimalDigits: 'pending'
            });
            setIsError(false);
            return;
        }

        // Check if input contains only numbers and decimal points
        const onlyNumbersValid = /^[\d.]+$/.test(value);
        
        const states = {
            onlyNumbers: onlyNumbersValid ? 'valid' : 'invalid',
            noLeadingDot: !value.startsWith('.') ? 'valid' : 'invalid',
            singleDecimal: (value.match(/\./g) || []).length <= 1 ? 'valid' : 'invalid',
            maxIntegerDigits: 'valid',
            maxDecimalDigits: 'valid'
        };

        // If non-numeric chars exist, digit validation fails too
        if (!onlyNumbersValid) {
            states.maxIntegerDigits = 'invalid';
            states.maxDecimalDigits = 'invalid';
        } else {
            // Validate digit limits only for numeric input
            const parts = value.split('.');
            const integerPart = parts[0];
            if (integerPart.length > 9) {
                states.maxIntegerDigits = 'invalid';
            }

            const decimalPart = parts[1] || '';
            if (decimalPart.length > 2) {
                states.maxDecimalDigits = 'invalid';
            }
        }

        setValidationStates(states);
        setIsError(Object.values(states).some(state => state === 'invalid'));
    };

    useEffect(() => {
        validateAmount(props.value);
    }, [props.value]);

    // Check if current value is valid for debouncing
    const isCurrentValueValid = useCallback(() => {
        if (props.value === '') return true;
        return !Object.values(validationStates).some(state => state === 'invalid');
    }, [props.value, validationStates]);
      

    // Notify parent about debouncing state and debounced value
    useEffect(() => {
        if (props.onDebouncingChange) {
            // Keep loading if current value is invalid
            const shouldKeepLoading = isDebouncing || !isCurrentValueValid();
            props.onDebouncingChange(shouldKeepLoading);
        }
        if (props.onDebouncedValueChange) {
            // Only update debounced value if current value is valid
            if (isCurrentValueValid()) {
                props.onDebouncedValueChange(debouncedValue);
            }
            // Don't update debounced value if current value is invalid
            // This prevents showing '0' when transitioning from invalid to valid
        }
    }, [isDebouncing, debouncedValue, isCurrentValueValid, props.onDebouncingChange, props.onDebouncedValueChange, props]);

    const handleContainerClick = () => {
        inputRef.current?.focus(); 
    };

    // Get CSS class based on validation state
    const getIndicatorStyle = (state) => {
        return state === 'pending' ? classes.pending : 
               state === 'valid' ? classes.valid : classes.invalid;
    };

    // Get symbol based on validation state: ∙ for pending, ✓ for valid, ✗ for invalid
    const getIndicatorSymbol = (state) => {
        return state === 'pending' ? '∙ ' : 
               state === 'valid' ? '✓ ' : '✗ ';
    };

    return (
        <div className={`${classes.container} ${props.className}`} style={props.style} onClick={handleContainerClick}>
            {props.label && (
                <span className={`${classes.label} ${isError ? classes.errorLabel : ''}`}>
                    {isError ? 'Please enter a valid amount' : props.label}
                </span>
            )}
            <div className={`${classes.inputWrapper} ${isError ? classes.errorInputWrapper : ''}`}>
                {props.leftIcon}
                <input 
                    type='text' 
                    ref={inputRef} 
                    className={classes.input} 
                    placeholder="00.00" 
                    value={props.value} 
                    onChange={props.onChange}
                    maxLength={12} // 9 digits + 1 dot + 2 decimals
                />
                <span className={classes.currency}>{props.currency}</span>
            </div>
            
            {/* validation indicators */}
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
    )
}

Input.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onDebouncingChange: PropTypes.func,
    onDebouncedValueChange: PropTypes.func,
    style: PropTypes.object,
    label: PropTypes.string,
    currency: PropTypes.string,
    leftIcon: PropTypes.element,
}

export default Input;