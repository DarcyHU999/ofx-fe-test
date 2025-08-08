import PropTypes from 'prop-types';
import Loader from '../Loader/Loader';
import ValueDisplay from '../ValueDisplay';
import classes from './ConversionResult.module.css';

const ConversionResult = (props) => {
    
    // Use external loading state or internal state
    const isLoading = props.isLoading !== undefined ? props.isLoading : false;
    
    return (
        <div className={classes.conversionResultContainer}>
            <div className={classes.conversionResultHeader}>
                <span>Conversion Result</span>
                
            </div>
            <div className={classes.conversionResultContent}>
                {isLoading ? <div className={classes.loadingCover}><Loader width={'25px'} height={'25px'} /></div> : null}
                <ValueDisplay title={'True Amount'} isLoading={isLoading} leftIcon={props.leftIcon} amount={props.trueAmount} currency={props.currency}/>
                <ValueDisplay title={'Amount After Markup'} isLoading={isLoading} leftIcon={props.leftIcon} amount={props.amountAfterMarkup} currency={props.currency}/>
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