document.addEventListener("DOMContentLoaded", () => {
  // Get HTML elements
  const fromCurrency = document.getElementById("from-currency");
  const fromAmount = document.getElementById("from-amount");
  const toCurrency = document.getElementById("to-currency");
  const toAmount = document.getElementById("to-amount");
  const convertBtn = document.getElementById("convert-btn");
  const swapBtn = document.getElementById("swap-btn");
  const resultDiv = document.getElementById("result");
  const resultText = document.getElementById("result-text");

  let rates = {};

  // Fetch exchange rates for base currency
  async function getExchangeRates(baseCurrency) {
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency.toLowerCase()}.json`
    );
    const data = await response.json();
    rates = data[baseCurrency.toLowerCase()];
  }

  // Convert currency
  function convert() {
    const amount = parseFloat(fromAmount.value);
    const from = fromCurrency.value.toLowerCase();
    const to = toCurrency.value.toLowerCase();

    if (!amount || !rates[to]) {
      resultDiv.classList.remove("hidden");
      resultText.textContent = "Please enter an amount and select currencies.";
      return;
    }

    const rate = rates[to]; // Rate from base (fromCurrency) to target (toCurrency)
    const converted = (amount * rate).toFixed(2);
    toAmount.value = converted;
    resultDiv.classList.remove("hidden");
    resultText.textContent = `${amount} ${from.toUpperCase()} = ${converted} ${to.toUpperCase()}`;
  }

  // Swap currencies
  function swap() {
    const tempCurrency = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCurrency;
    const tempAmount = fromAmount.value;
    fromAmount.value = toAmount.value;
    toAmount.value = tempAmount;
    resultDiv.classList.add("hidden");
  }

  // Update rates when currency changes
  async function updateRates() {
    await getExchangeRates(fromCurrency.value);
  }

  // Event listeners
  convertBtn.addEventListener("click", async () => {
    await updateRates();
    convert();
  });

  swapBtn.addEventListener("click", swap);

  fromCurrency.addEventListener("change", updateRates);

  // Initial fetch for default currency (USD)
  updateRates();
});
