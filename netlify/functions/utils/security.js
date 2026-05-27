export function getIP(event) {
  return (
    event.headers['x-forwarded-for'] ||
    'unknown'
  ).split(',')[0];
}

export function validAddress(addr) {
  return /^oct[a-zA-Z0-9]{44}$/.test(addr);
}
