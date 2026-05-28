import { API, EXPLORER } from './config.mjs';

const form = document.getElementById('claim-form');
const input = document.getElementById('address');
const result = document.getElementById('result');
const button = document.getElementById('claim-btn');

function show(msg, type = 'info') {
  result.className = type;
  result.innerHTML = msg;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const address = input.value.trim();

  if (!address.startsWith('oct')) {
    show('Invalid address', 'error');
    return;
  }

  button.disabled = true;
  button.innerText = 'Processing...';

  try {
    const captcha =
      window.turnstile.getResponse();

    if (!captcha) {
      show('Complete captcha first', 'error');
      return;
    }

    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address,
        captcha
      })
    });

    const data = await res.json();

    if (!res.ok) {
      show(data.error || 'Claim failed', 'error');
      return;
    }

    show(`
      Success! 1 OCT sent.<br><br>
      <a href="${EXPLORER}${data.txHash}" target="_blank">
        View Transaction
      </a>
    `, 'success');

  } catch {
    show('Network error', 'error');
  }

  button.disabled = false;
  button.innerText = 'Claim';
});
