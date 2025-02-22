import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("KZT");
  const [toCurrency, setToCurrency] = useState("USD");

  const [exchangeRate, setExchangeRate] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();

  const apiKey = import.meta.env.VITE_CURRENCY_KEY;

  //fetching from exchange api
  useEffect(
    function () {
      async function fetchExchangeRate() {
        setIsLoading(true);
        setIsError("");
        try {
          const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`
          );
          if (!response.ok) {
            throw new Error("failed to fetch exchange rates");
          }
          const data = await response.json();
          console.log(data);

          if (data && data.conversion_rates) {
            setCurrencies(Object.keys(data.conversion_rates));
            setExchangeRate(data.conversion_rates);
            setFromCurrency(Object.keys(data.conversion_rates)[0]);
          } else {
            console.error("Rates data is missing:", data);
          }

          // setCurrencies(Object.keys(data.rates));

          // setExchangeRate(data.rates);
          // setToCurrency(Object.keys(data.rates)[0]);
        } catch (error) {
          console.log(error.message);
          setIsError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchExchangeRate();
    },
    [fromCurrency, apiKey]
  );

  useEffect(
    function () {
      if (!amount || !exchangeRate[toCurrency]) return;
      const result = amount * exchangeRate[toCurrency];
      setConvertedAmount(result);
    },
    [amount, toCurrency, exchangeRate]
  );

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSetFromCurrency = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };
  return (
    <div className="currency-converter">
      <h2 className="converter-title">Currency Converter</h2>
      {isError && <p className="error">Error: {isError}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form
          className="converter-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="form-group">
            <label className="form-label">Enter Amount</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group form-currency-group">
            <div className="form-section">
              <label className="form-label">From</label>
              <div className="currency-select">
                {/* <img src={flags[fromCurrency]} alt="from flag" /> */}
                <select
                  className="currency-dropdown"
                  value={fromCurrency}
                  onChange={handleSetFromCurrency}
                >
                  {currencies.map((currency) => (
                    <option value={currency} key={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="swap-icon">
              <svg
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                fill="#fff"
              >
                <path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
              </svg>
            </div>

            <div className="form-section">
              <label className="form-label">To</label>
              <div className="currency-select">
                {/* <img src={flags[toCurrency]} alt="to flag" /> */}
                <select
                  className="currency-dropdown"
                  onChange={handleToCurrencyChange}
                  value={toCurrency}
                >
                  {currencies.map((currency) => (
                    <option value={currency} key={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <p className="exchange-rate-result">{convertedAmount.toFixed(2)}</p>
        </form>
      )}
    </div>
  );
}

export default App;
