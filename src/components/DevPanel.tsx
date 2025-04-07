import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ApprovedIdeasEditor from "./ApprovedIdeasEditor";
import AdminDownloadButton from "./Downloadbuttonadmin";
import AdminUsersLoader from "./AdminUsersLoader";

export default function DevPanel() {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [marketplacePurchases, setMarketplacePurchases] = useState([]);
  const [legacyPurchases, setLegacyPurchases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);

    const { data: session } = await supabase.auth.getUser();
    const userId = session?.user?.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    setCurrentProfile(profile);

    const { data: reqs } = await supabase
      .from("admin_requests")
      .select("*")
      .eq("seen", false)
      .order("created_at", { ascending: false });

    setRequests(reqs || []);

    const { data: marketplace } = await supabase
      .from("purchases")
      .select("*, profiles(email)")
      .eq("status", "pending");

    const { data: legacy } = await supabase
      .from("purchases")
      .select("*")
      .eq("payed", false);

    setMarketplacePurchases(marketplace || []);
    setLegacyPurchases(legacy || []);
    setLoading(false);
  };

  const markAsSeen = async (id) => {
    await supabase.from("admin_requests").update({ seen: true }).eq("id", id);
    fetchData();
  };

  const updateRole = async (user_id, newRole) => {
    await supabase.from("profiles").update({ role: newRole }).eq("user_id", user_id);
    fetchData();
  };

  const markAsPayed = async (id) => {
    await supabase.from("purchases").update({ payed: true }).eq("id", id);
    fetchData();
  };

  const markAsPaid = async (id) => {
    await supabase.from("purchases").update({ status: "paid" }).eq("id", id);
    fetchData();
  };

  const deletePurchase = async (id) => {
    await supabase.from("purchases").delete().eq("id", id);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-lg">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center p-8 text-white" style={{ backgroundImage: "url('/assets/login-bg.png')" }}>
      <div className="bg-white/90 text-black rounded-xl p-6 max-w-6xl mx-auto shadow-xl space-y-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Admin Panel</h1>
          <div className="flex gap-4">
            <Button variant="secondary" size="sm" onClick={() => navigate("/admin-upload")}>➕ Upload Strategy</Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* 🔔 Requests */}
        <section>
          <h2 className="text-xl font-bold mb-2">🔔 Admin Requests</h2>
          <div className="space-y-2">
            {requests.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{r.message}</p>
                    <p className="text-xs text-gray-600">Type: {r.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">New</Badge>
                    <Button size="sm" onClick={() => markAsSeen(r.id)}>Mark as Seen</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 💰 Marketplace Approvals */}
        <section>
          <h2 className="text-xl font-bold mb-2">💰 Marketplace Approvals</h2>
          <div className="space-y-2">
            {marketplacePurchases.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p>Purchase ID: {p.id}</p>
                    <p>User: {p.user_id}</p>
                    <p>Strategy ID: {p.strategy_id}</p>
                    <p>Email: {p.profiles?.email || "N/A"}</p>
                    <p>Title: {p.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => markAsPaid(p.id)}>✅ Paid</Button>
                    <AdminDownloadButton strategy_id={p.strategy_id} />
                    <Button size="sm" variant="destructive" onClick={() => deletePurchase(p.id)}>🗑 Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 💸 Legacy Payment Approvals */}
        <section>
          <h2 className="text-xl font-bold mb-2">💸 Payment Approvals (Pre-Marketplace)</h2>
          <div className="space-y-2">
            {legacyPurchases.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p>Purchase ID: {p.id}</p>
                    <p>User: {p.user_id}</p>
                    <p>Strategy ID: {p.strategy_id}</p>
                    <p>Title: {p.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => markAsPayed(p.id)}>✅ Confirm Payment</Button>
                    <AdminDownloadButton strategy_id={p.strategy_id} />
                    <Button size="sm" variant="destructive" onClick={() => deletePurchase(p.id)}>🗑 Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ✍️ Editor */}
        <ApprovedIdeasEditor currentProfile={currentProfile} />

        {/* 👥 Manage Users */}
        {currentProfile?.role === "admin" && (
          <>
            <AdminUsersLoader onLoad={setUsers} />
            <section>
              <h2 className="text-xl font-bold mb-2">👥 Manage Users</h2>
              <div className="space-y-2">
                {users.map((user) => (
                  <Card key={user.user_id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">User ID: {user.user_id}</p>
                        <p className="text-sm text-gray-700">Role: {user.role}</p>
                        <p className="text-sm text-gray-700">Email: {user.email || "N/A"}</p>
                        <p className="text-sm text-gray-700">Wallet: {user.wallet || "N/A"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateRole(user.user_id, "pro")}>Pro</Button>
                        <Button size="sm" onClick={() => updateRole(user.user_id, "plus")}>Plus</Button>
                        <Button size="sm" onClick={() => updateRole(user.user_id, "admin")}>Admin</Button>
                        <Button size="sm" onClick={() => updateRole(user.user_id, "user")}>Revoke</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
