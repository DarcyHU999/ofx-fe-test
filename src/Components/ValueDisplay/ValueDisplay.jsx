import PropTypes from 'prop-types';
import classes from './ValueDisplay.module.css';

const ValueDisplay = (props) => {
    return (
        <div className={classes.valueDisplayContainer}>
            <span>{props.title}</span>
            <div className={classes.valueDisplayContent}>
                {props.leftIcon}
                <span>{props.amount}</span>
                <span>{props.currency}</span>
            </div>
        </div>
    )
}

ValueDisplay.propTypes = {
    title: PropTypes.string,
    amount: PropTypes.string,
    currency: PropTypes.string,
    leftIcon: PropTypes.element,
}

export default ValueDisplay;