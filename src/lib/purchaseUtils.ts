import { supabase } from "@/lib/supabaseClient";

export async function createPurchase({ userId, strategyId }) {
  const expires = new Date(Date.now() + 3600 * 1000);
  return await supabase.from("purchases").insert({
    user_id: userId,
    strategy_id: strategyId,
    status: "pending",
    expires_at: expires.toISOString(),
  });
}
