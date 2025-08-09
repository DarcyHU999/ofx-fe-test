import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import ValueDisplay from '../ValueDisplay';
import classes from './ConversionResult.module.css';

const ConversionResult = (props) => {
    // Use external loading state or internal state
    const isLoading = props.isLoading !== undefined ? props.isLoading : false;

    // Preserve last known values while loading
    const [displayTrueAmount, setDisplayTrueAmount] = useState(props.trueAmount);
    const [displayAmountAfterMarkup, setDisplayAmountAfterMarkup] = useState(props.amountAfterMarkup);
    const [displayCurrency, setDisplayCurrency] = useState(props.currency);
    const [displayLeftIcon, setDisplayLeftIcon] = useState(props.leftIcon);

    useEffect(() => {
        if (!isLoading) {
            setDisplayTrueAmount(props.trueAmount);
            setDisplayAmountAfterMarkup(props.amountAfterMarkup);
            setDisplayCurrency(props.currency);
            setDisplayLeftIcon(props.leftIcon);
        }
    }, [props.trueAmount, props.amountAfterMarkup, props.currency, props.leftIcon, isLoading]);

    return (
        <div className={classes.conversionResultContainer}>
            <div className={classes.conversionResultHeader}>
                <span>Conversion Result</span>
                
            </div>
            <div className={classes.conversionResultContent}>
                {isLoading ? <div className={classes.loadingCover}><Loader width={'25px'} height={'25px'} /></div> : null}
                <ValueDisplay title={'True Amount'} isLoading={isLoading} leftIcon={displayLeftIcon} amount={displayTrueAmount} currency={displayCurrency}/>
                <ValueDisplay title={'Amount After Markup'} isLoading={isLoading} leftIcon={displayLeftIcon} amount={displayAmountAfterMarkup} currency={displayCurrency}/>
            </div>
        </div>
    )
}

ConversionResult.propTypes = {
    trueAmount: PropTypes.string,
    amountAfterMarkup: PropTypes.string,
    currency: PropTypes.string,
    leftIcon: PropTypes.element,
    isLoading: PropTypes.bool, // External loading state for debouncing
}

export default ConversionResult;