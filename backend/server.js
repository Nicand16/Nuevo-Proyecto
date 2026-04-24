const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const EXCHANGE_API_KEY = process.env.EXCHANGE_API_KEY;

app.use(cors());
app.use(express.json());

// Ruta de salud para verificar que el backend está funcionando.
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Backend activo' });
});

app.get('/api/convert', async (req, res) => {
  const { amount, from = 'COP', to = 'USD' } = req.query;

  // Validación básica de parámetros de entrada.
  const parsedAmount = Number(amount);
  if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({
      error:
        'El parámetro "amount" es obligatorio y debe ser un número mayor que 0.'
    });
  }

  if (!from || !to || from.length !== 3 || to.length !== 3) {
    return res.status(400).json({
      error:
        'Los parámetros "from" y "to" deben existir y tener formato de moneda de 3 letras (ej: COP, USD).'
    });
  }

  if (!EXCHANGE_API_KEY) {
    return res.status(500).json({
      error:
        'Falta la API key del servidor. Configura EXCHANGE_API_KEY en el archivo .env del backend.'
    });
  }

  try {
    // Llamada a API externa (en este ejemplo: ExchangeRate-API).
    const providerUrl = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/${from.toUpperCase()}/${to.toUpperCase()}`;
    const providerResponse = await fetch(providerUrl);

    if (!providerResponse.ok) {
      return res.status(502).json({
        error: 'La API externa respondió con error.',
        providerStatus: providerResponse.status
      });
    }

    const providerData = await providerResponse.json();

    if (providerData.result !== 'success' || typeof providerData.conversion_rate !== 'number') {
      return res.status(502).json({
        error: 'La API externa no devolvió una tasa válida.',
        providerResponse: providerData
      });
    }

    const rate = providerData.conversion_rate;
    const result = parsedAmount * rate;

    return res.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      input: parsedAmount,
      rate,
      result,
      rateTimestamp: providerData.time_last_update_utc || null,
      provider: 'ExchangeRate-API'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'No se pudo completar la conversión por un problema interno.',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});
