import { rpc }
from './utils/rpc.mjs';

import { signTx }
from './utils/signer.mjs';

import {
  validAddress,
  getIP
}
from './utils/security.mjs';

import {
  rateLimit
}
from './middleware/ratelimit.mjs';

import {
  verifyCaptcha
}
from './middleware/captcha.mjs';

import {
  checkCooldown
}
from './middleware/cooldown.mjs';

const MICRO = 1_000_000;

export async function handler(event){

  try{

    if(event.httpMethod !== 'POST'){

      return res(
        405,
        'method not allowed'
      );

    }

    const ip =
      getIP(event);

    const allowed =
      await rateLimit(ip);

    if(!allowed){

      return res(
        429,
        'too many requests'
      );

    }

    const body =
      JSON.parse(event.body);

    const address =
      body.address?.trim();

    const captcha =
      body.captcha;

    const captchaOk =
      await verifyCaptcha(captcha);

    if(!captchaOk){

      return res(
        403,
        'captcha failed'
      );

    }

    if(!validAddress(address)){

      return res(
        400,
        'invalid address'
      );

    }

    const cooldown =
      await checkCooldown(
        address,
        ip
      );

    if(!cooldown){

      return res(
        429,
        '24h cooldown'
      );

    }

    const bal =
      await rpc(
        'octra_balance',
        [address]
      );

    const balance =
      parseFloat(
        bal?.result?.balance || 0
      );

    if(balance >= 15){

      return res(
        403,
        'balance too high'
      );

    }

    const faucet =
      process.env
      .FAUCET_ADDRESS;

    const nonceRes =
      await rpc(
        'octra_account',
        [faucet]
      );

    const nonce =
      nonceRes?.result?.nonce || 0;

    const tx = {

      from: faucet,

      to_: address,

      amount:
        String(1 * MICRO),

      nonce,

      timestamp:
        Math.floor(
          Date.now()/1000
        ),

      ou:'10000',

      op_type:'standard'

    };

    const msg =
      JSON.stringify(tx);

    const signature =
      await signTx(msg);

    tx.signature =
      signature;

    tx.public_key =
      process.env
      .FAUCET_PUBLIC_KEY;

    const submit =
      await rpc(
        'octra_submit',
        [tx]
      );

    if(submit.error){

      return {

        statusCode:500,

        body:JSON.stringify({
          rpcError:
            submit.error
        })

      };

    }

    return {

      statusCode:200,

      body:JSON.stringify({

        success:true,

        txHash:
          submit.result.tx_hash

      })

    };

  }catch(err){

    return {

      statusCode:500,

      body:JSON.stringify({

        realError:
          err.message

      })

    };

  }

}

function res(code,msg){

  return {

    statusCode:code,

    body:JSON.stringify({
      error:msg
    })

  };

}
