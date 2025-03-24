async function fetchLatestPrices() {
    try {
        // Fetch USD/INR exchange rate
        const exchangeApiKey = '7c3e23c342f6fe539c747039'; // Replace with your ExchangeRate-API key
        const exchangeResponse = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeApiKey}/latest/USD`);
        const exchangeData = await exchangeResponse.json();
        const usdInrRate = exchangeData.conversion_rates.INR;

        // Fetch Crude Oil futures price (CL=F) via Yahoo Finance
        const oilResponse = await fetch('https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/CL=F');
        const oilData = await oilResponse.json();
        const oilPrice = oilData.chart.result[0].meta.regularMarketPrice;

        // Fetch Natural Gas futures price (NG=F) via Yahoo Finance
        const gasResponse = await fetch('https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/NG=F');
        const gasData = await gasResponse.json();
        const gasPrice = gasData.chart.result[0].meta.regularMarketPrice;

        // Calculate results
        const oilResult = usdInrRate * oilPrice;
        const gasResult = usdInrRate * gasPrice;

        // Update the page with the latest prices
        document.getElementById('result').innerText = 
            `Crude Oil (CL): $${oilPrice.toFixed(2)} x USD/INR ${usdInrRate.toFixed(2)} = ₹${oilResult.toFixed(2)}\n` +
            `Natural Gas (NG): $${gasPrice.toFixed(2)} x USD/INR ${usdInrRate.toFixed(2)} = ₹${gasResult.toFixed(2)}`;
    } catch (error) {
        console.error('Error fetching prices:', error);
        document.getElementById('result').innerText = 'Error fetching latest prices';
    }
}

// Fetch initially
fetchLatestPrices();

// Auto-update every 60 seconds
setInterval(fetchLatestPrices, 60000);