const RPC =
  'https://devnet-rpc.octra.network/rpc';

export async function rpc(method, params=[]) {

  const res = await fetch(RPC, {
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      jsonrpc:'2.0',
      method,
      params,
      id:1
    })
  });

  return res.json();
}
