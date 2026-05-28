import * as nacl
from 'tweetnacl';

function b64(bytes){

  return Buffer
    .from(bytes)
    .toString('base64');

}

export async function signTx(message){

  const seed = Buffer.from(

    process.env
    .FAUCET_PRIVATE_KEY,

    'base64'

  );

  const pair =
    nacl.sign.keyPair
    .fromSeed(seed);

  const sig =
    nacl.sign.detached(

      Buffer.from(message),

      pair.secretKey

    );

  return b64(sig);

}
