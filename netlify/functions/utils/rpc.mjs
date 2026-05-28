const RPC =
'http://165.227.225.79:8080';

export async function rpc(
  method,
  params = []
){

  const res = await fetch(
    RPC,
    {

      method:'POST',

      headers:{
        'Content-Type':
        'application/json'
      },

      body:JSON.stringify({

        jsonrpc:'2.0',

        id:1,

        method,

        params

      })

    }
  );

  return await res.json();

}
