import { supabase }
from '../utils/supabase.js';

export async function checkCooldown(
  wallet,
  ip
){

  const since =
    new Date(
      Date.now() - 86400000
    ).toISOString();

  const { data } =
    await supabase
    .from('claims')
    .select('*')
    .or(
      `wallet.eq.${wallet},ip.eq.${ip}`
    )
    .gte(
      'created_at',
      since
    );

  if(data.length > 0){
    return false;
  }

  await supabase
    .from('claims')
    .insert({
      wallet,
      ip
    });

  return true;
}
