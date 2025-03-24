// Set a default USD/INR rate (you can change this manually)
let usdInrRate = 86.10; // Hardcoded default value, update as needed

async function fetchLatestPrices() {
    try {
        document.getElementById('result').innerText = 'Fetching prices...';

        // Fetch Crude Oil futures price (CL=F) via Yahoo Finance
        const oilResponse = await fetch('https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/CL=F');
        if (!oilResponse.ok) throw new Error(`Oil API failed: ${oilResponse.status}`);
        const oilData = await oilResponse.json();
        console.log('Oil Data:', oilData);
        const oilPrice = oilData.chart?.result?.[0]?.meta?.regularMarketPrice ?? throw new Error('Oil price not found');

        // Fetch Natural Gas futures price (NG=F) via Yahoo Finance
        const gasResponse = await fetch('https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/NG=F');
        if (!gasResponse.ok) throw new Error(`Gas API failed: ${gasResponse.status}`);
        const gasData = await gasResponse.json();
        console.log('Gas Data:', gasData);
        const gasPrice = gasData.chart?.result?.[0]?.meta?.regularMarketPrice ?? throw new Error('Gas price not found');

        // Calculate results using the manual USD/INR rate
        const oilResult = usdInrRate * oilPrice;
        const gasResult = usdInrRate * gasPrice;

        // Update the page
        document.getElementById('result').innerText = 
            `Crude Oil (CL): $${oilPrice.toFixed(2)} x USD/INR ${usdInrRate.toFixed(2)} = ₹${oilResult.toFixed(2)}\n` +
            `Natural Gas (NG): $${gasPrice.toFixed(2)} x USD/INR ${usdInrRate.toFixed(2)} = ₹${gasResult.toFixed(2)}`;
    } catch (error) {
        console.error('Error fetching prices:', error.message);
        document.getElementById('result').innerText = `Error fetching latest prices: ${error.message}`;
    }
}

// Optional: Function to update USD/INR rate from an HTML input
function updateExchangeRate() {
    const inputRate = document.getElementById('usdInrInput')?.value;
    if (inputRate && !isNaN(inputRate) && inputRate > 0) {
        usdInrRate = parseFloat(inputRate);
        fetchLatestPrices(); // Refresh prices with new rate
    } else {
        console.error('Invalid USD/INR rate entered');
    }
}

// Fetch initially
fetchLatestPrices();

// Auto-update every 60 seconds
setInterval(fetchLatestPrices, 60000);

// Optional: Add event listener for manual rate updates (if using an input field)
document.getElementById('usdInrInput')?.addEventListener('change', updateExchangeRate);
