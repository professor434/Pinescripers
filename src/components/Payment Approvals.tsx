import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminDownloadButton from "./Downloadbuttonadmin";

export default function PaymentApprovals({ purchases = [], fetchData }) {
  const markAsPayed = async (purchase) => {
    const { error: updateError } = await supabase
      .from("purchases")
      .update({ payed: true })
      .eq("id", purchase.id);

    if (updateError) {
      alert("❌ Failed to confirm payment.");
      return;
    }

    // Check if the creator is pro or plus
    const { data: creatorProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", purchase.user_id)
      .maybeSingle();

    if (creatorProfile?.role === "pro" || creatorProfile?.role === "plus") {
      alert(`ℹ️ Creator is ${creatorProfile.role}. Send fixed fee manually.`);
    }

    alert("✅ Payment confirmed.");
    fetchData();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("purchases").delete().eq("id", id);
    if (error) {
      alert("❌ Failed to delete purchase request.");
    } else {
      alert("🗑 Request deleted.");
      fetchData();
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-2">💸 Payment Approvals</h2>
      <div className="space-y-2">
        {purchases.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
              <div>
                <p>Purchase ID: {p.id}</p>
                <p>User: {p.user_id}</p>
                <p>Strategy: {p.strategy_id}</p>
                <p>Title: {p.title}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => markAsPayed(p)}>✅ Confirm Payment</Button>
                <AdminDownloadButton strategy_id={p.strategy_id} />
                <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                  🗑 Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
