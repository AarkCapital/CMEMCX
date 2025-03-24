async function fetchLatestPrices() {
    try {
        document.getElementById('result').innerText = 'Fetching prices...';

        // Fetch USD/INR exchange rate (USDINR=X) via Yahoo Finance
        const exchangeResponse = await fetch('https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X');
        if (!exchangeResponse.ok) throw new Error(`Exchange API failed: ${exchangeResponse.status}`);
        const exchangeData = await exchangeResponse.json();
        console.log('Exchange Data:', exchangeData);
        const usdInrRate = exchangeData.chart?.result?.[0]?.meta?.regularMarketPrice ?? throw new Error('USD/INR rate not found');

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

        // Calculate results
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

// Fetch initially
fetchLatestPrices();

// Auto-update every 60 seconds
setInterval(fetchLatestPrices, 60000);
