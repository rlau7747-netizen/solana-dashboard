const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));  // Untuk file HTML/CSS/JS

app.get('/data', async (req, res) => {
    try {
        // Fetch real-time dari Jupiter API untuk SOL/USDC (tambah pair lain jika perlu)
        const quote = await axios.get('https://quote-api.jup.ag/v6/quote', {
            params: {
                inputMint: 'So11111111111111111111111111111111111111112', // SOL
                outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
                amount: 100 * 1e9, // 100 SOL
                slippageBps: 50  // 0.5% slippage
            }
        });
        const data = quote.data;
        const buyPrice = data.inAmount / 1e9;
        const sellPrice = data.outAmount / 1e9;
        const fees = buyPrice * 0.003 * 100;  // 0.3% fees
        const slippageAmount = buyPrice * 0.005 * 100;  // 0.5% slippage
        const gas = 0.01;
        const profit = (sellPrice - buyPrice) * 100 - fees - slippageAmount - gas;
        const profitPct = ((profit / (buyPrice * 100)) * 100).toFixed(2);

        res.json({
            portfolioValue: 24856.32,
            profit24h: 1234.56,
            return24h: 5.23,
            activeTrades: [{ pair: 'ORCA/SOL', profit: 1.34, status: 'Executing...' }],
            watchlist: [],  // Tambah manual via JS
            recentExecutions: [
                { pair: 'PYTH/SOL', time: '12:16:34 AM', profit: 10.69, status: 'Executed' },
                { pair: 'WIF/SOL', time: '11:16:34 PM', profit: 10.79, status: 'Executed' },
                { pair: 'ORCA/USDC', time: '10:16:34 PM', profit: 5.36, status: 'Executed' },
                { pair: 'JTO/SOL', time: '9:16:34 PM', profit: 7.85, status: 'Executed' },
                { pair: 'ORCA/USDC', time: '8:16:34 PM', profit: 2.41, status: 'Executed' }
            ],
            currentOpportunity: {
                pair: 'SOL/USDC',
                buyPrice: buyPrice.toFixed(2),
                sellPrice: sellPrice.toFixed(2),
                profit: profit.toFixed(2),
                profitPct: profitPct
            }
        });
    } catch (error) {
        res.json({ error: 'Error fetching data' });
    }
});

app.listen(port, () => console.log(`Dashboard at http://localhost:${port}`));