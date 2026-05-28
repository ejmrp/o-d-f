export async function verifyCaptcha(
  token
){

  const body =
    new URLSearchParams();

  body.append(
    'secret',
    process.env.TURNSTILE_SECRET
  );

  body.append(
    'response',
    token
  );

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method:'POST',
      body
    }
  );

  const data =
    await res.json();

  return data.success === true;
}
