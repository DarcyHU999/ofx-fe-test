import { useState, useEffect } from 'react';
import DropDown from '../../Components/DropDown';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';
import Input from '../../Components/Input';
import ConversionResult from '../../Components/ConversionResult';
import { useAnimationFrame } from '../../Hooks/useAnimationFrame';
import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';
import { DropdownProvider } from '../../Providers/DropdownProvider';
import { convertAmount, convertAmountWithMarkup } from '../../Utils/currencyConvertUtil';
import { useExchangeRate } from '../../Hooks/useExchangeRate';

let countries = CountryData.CountryCodes;
const MARKUP_PERCENTAGE = 0.005;

const Rates = () => {
    const [fromCurrency, setFromCurrency] = useState('AU');
    const [toCurrency, setToCurrency] = useState('US');
    const [amount, setAmount] = useState('');
    const [debouncedAmount, setDebouncedAmount] = useState(''); // Store debounced value
    const [progression, setProgression] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isDebouncing, setIsDebouncing] = useState(false); // Track debouncing state
    const [freezeDisplay, setFreezeDisplay] = useState(false);
    const { exchangeRate, error, refetch } = useExchangeRate(countryToCurrency[fromCurrency], countryToCurrency[toCurrency], setLoading);
    const Flag = ({ code }) => (
        <img alt={code || ''} src={`/img/flags/${code || ''}.svg`} width="20px" className={classes.flag} />
    );

    // Demo progress bar moving :)
    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                refetch();
                return 0;
            }
            if(error){
                setLoading(true);
                return 0;
            }
            return (prevState + deltaTime * 0.0001) % 1;
        });
    });

    // Handle debouncing state from Input component
    const handleDebouncingChange = (debouncing) => {
        setIsDebouncing(debouncing);
    };

    // Handle debounced value from Input component
    const handleDebouncedValueChange = (debouncedValue) => {
        // Only update if we receive a valid debounced value
        if (debouncedValue !== undefined) {
            setDebouncedAmount(debouncedValue);
        }
    };

    // Reset progression when fromCurrency or toCurrency changes
    useEffect(() => {
        setProgression(0);
      }, [fromCurrency, toCurrency]);

    // freeze immediately on currency change
    const onFromChange = (key) => {
      setFreezeDisplay(true);
      setFromCurrency(key);
    };
    const onToChange = (key) => {
      setFreezeDisplay(true);
      setToCurrency(key);
    };

    //freeze display when loading, debouncing, or error
    useEffect(() => {
      const shouldFreeze = loading || isDebouncing || !!error;
      setFreezeDisplay(shouldFreeze);
    }, [loading, isDebouncing, error]);
    
    return (
        <DropdownProvider>
        <div className={classes.container}>
            <div className={classes.content}>
                <div className={classes.heading}>Currency Conversion</div>

                <div className={classes.rowWrapper}>
                    <div>
                        <DropDown
                            id="from-currency"
                            leftIcon={<Flag code={fromCurrency} />}
                            label={'From'}
                            selected={countryToCurrency[fromCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryToCurrency[code],
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={onFromChange}
                            style={{ marginRight: '20px' }}
                        />
                    </div>

                    <div className={classes.exchangeWrapper}>
                        <div className={classes.transferIcon}>
                            <Transfer height={'19px'} />
                        </div>
                        <div className={classes.rateDescription}>OFX Rate</div>

                        
                        {error||loading ? <Loader width={'25px'} height={'25px'} /> : <div className={classes.rate}>{exchangeRate}</div>}
                    </div>

                    <div>
                        <DropDown
                            id="to-currency"
                            leftIcon={<Flag code={toCurrency} />}
                            label={'To'}
                            selected={countryToCurrency[toCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryToCurrency[code],
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={onToChange}
                            style={{ marginLeft: '20px' }}
                        />
                    </div>
                </div>

                <ProgressBar
                    progress={progression}
                    animationClass={loading ? classes.slow : ''}
                    style={{ marginTop: '20px' }}
                />

                <div className={classes.rowWrapper} style={{marginTop: '20px', justifyContent: 'space-between'}}>
                    <Input
                        label={'Amount'}
                        placeholder={'00.00'}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onDebouncingChange={handleDebouncingChange} // Pass debouncing callback
                        onDebouncedValueChange={handleDebouncedValueChange} // Pass debounced value callback
                        leftIcon={<Flag code={fromCurrency} />}
                        currency={countryToCurrency[fromCurrency]}
                    />
                    <ConversionResult
                        trueAmount={convertAmount(debouncedAmount, exchangeRate, MARKUP_PERCENTAGE)} // Use debounced value
                        amountAfterMarkup={convertAmountWithMarkup(debouncedAmount, exchangeRate)} // Use debounced value
                        currency={countryToCurrency[toCurrency]}
                        leftIcon={<Flag code={toCurrency} />}
                        isLoading={freezeDisplay}
                    />
                </div>
            </div>
        </div>
        </DropdownProvider>
    );
};

export default Rates;
