const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const loading = document.getElementById('loading');
const errorText = document.getElementById('error');
const resultBox = document.getElementById('result');

const copValue = document.getElementById('copValue');
const rateValue = document.getElementById('rateValue');
const usdValue = document.getElementById('usdValue');
const timeValue = document.getElementById('timeValue');

const BACKEND_BASE_URL = 'http://localhost:3000';

function showError(message) {
  errorText.textContent = message;
  errorText.classList.remove('hidden');
}

function clearUI() {
  errorText.classList.add('hidden');
  errorText.textContent = '';
  resultBox.classList.add('hidden');
}

convertBtn.addEventListener('click', async () => {
  clearUI();

  const amount = Number(amountInput.value);
  if (!amountInput.value || Number.isNaN(amount) || amount <= 0) {
    showError('Por favor escribe una cantidad válida en COP (número mayor que 0).');
    return;
  }

  loading.classList.remove('hidden');

  try {
    // El frontend llama a NUESTRO backend, no a la API externa directa.
    const response = await fetch(
      `${BACKEND_BASE_URL}/api/convert?amount=${encodeURIComponent(amount)}&from=COP&to=USD`
    );
    const data = await response.json();

    if (!response.ok) {
      showError(data.error || 'Hubo un error en la conversión.');
      return;
    }

    copValue.textContent = `${data.input.toLocaleString('es-CO')} COP`;
    rateValue.textContent = `${data.rate.toLocaleString('en-US')} USD por COP`;
    usdValue.textContent = `${data.result.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })}`;
    timeValue.textContent = data.rateTimestamp || 'No disponible';

    resultBox.classList.remove('hidden');
  } catch (error) {
    showError(
      'No se pudo conectar con el backend. Verifica que esté encendido en http://localhost:3000.'
    );
  } finally {
    loading.classList.add('hidden');
  }
});
