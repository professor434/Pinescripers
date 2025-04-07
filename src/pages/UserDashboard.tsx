import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import MarketplaceUpload from "@/components/MarketplaceUpload";
import UserDownloadButton from "@/components/UserDownloadButton";

export default function UserDashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("user");
  const [wallet, setWallet] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || "");
        setUserId(user.id);

        // Get full profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profile?.role) setRole(profile.role);
        if (profile?.wallet) setWallet(profile.wallet);

        const { data: purchasesData } = await supabase
          .from("purchases")
          .select("created_at, title, status, strategy_id, payed")
          .eq("user_id", user.id);

        if (purchasesData) setPurchases(purchasesData);

        const { data: submissionData } = await supabase
          .from("ideaz")
          .select("title, description, created_at, strategy_id")
          .eq("user_id", user.id);

        if (submissionData) setSubmissions(submissionData);

        const { data: uploadData } = await supabase
          .from("marketplace")
          .select("title, created_at, approved")
          .eq("owner_id", user.id);

        if (uploadData) setUploads(uploadData);
      }

      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  const saveWallet = async () => {
    if (!wallet) return;
    await supabase.from("profiles").update({ wallet }).eq("user_id", userId);
    alert("✅ Wallet saved.");
  };

  if (loading) return <div className="text-white text-center mt-20">Loading dashboard...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 text-white"
      style={{ backgroundImage: "url('/assets/login-bg.png')" }}
    >
      <div className="bg-white text-black p-8 rounded-2xl shadow-xl max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Welcome{userEmail ? `, ${userEmail}` : ""}
          </h1>
          <Button
            variant="destructive"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Button className="w-full" onClick={() => navigate("/builder")}>
            Access Strategy Builder
          </Button>
          <Button className="w-full" onClick={() => navigate("/submit-idea")}>
            Submit a Strategy Idea
          </Button>
          <Button className="w-full" onClick={() => navigate("/marketplace")}>
            Go to Marketplace
          </Button>
          {role === "pro" && (
            <Button className="w-full col-span-3" onClick={() => navigate("/upload-strategy")}>
              Upload Strategy to Marketplace (Blind Address)
            </Button>
          )}
        </div>

        {role === "pro" && (
          <div className="mb-6 space-y-2">
            <label className="text-sm font-medium text-zinc-700">Your Wallet Address:</label>
            <div className="flex gap-2">
              <Input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Enter BEP-20 wallet address"
                className="bg-white text-black"
              />
              <Button onClick={saveWallet}>Save</Button>
            </div>
            {wallet && <MarketplaceUpload />}
          </div>
        )}

        <Tabs defaultValue="purchases">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="purchases">My Purchases</TabsTrigger>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
          </TabsList>

          {/* Tab 1: Purchases */}
          <TabsContent value="purchases">
            <div className="grid gap-4">
              {purchases.length > 0 ? (
                purchases.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h2 className="font-semibold">{item.title || `Strategy #${item.strategy_id}`}</h2>
                        <p className="text-sm text-muted-foreground">
                          Purchased on {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline">
                          {item.payed || item.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                        {(item.payed || item.status === "paid") && (
                          <UserDownloadButton strategyId={item.strategy_id} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-600 text-center">No purchases yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Submissions */}
          <TabsContent value="submissions">
            <div className="grid gap-4">
              {submissions.length > 0 ? (
                submissions.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4">
                      <h2 className="font-semibold">{item.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-700 mt-2">{item.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-600 text-center">No submissions yet.</p>
              )}
            </div>
          </TabsContent>

          {/* Tab 3: Uploads */}
          <TabsContent value="uploads">
            <div className="grid gap-4">
              {uploads.length > 0 ? (
                uploads.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h2 className="font-semibold">{item.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={item.approved ? "success" : "outline"}>
                        {item.approved ? "Approved" : "Pending"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-600 text-center">No uploads yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
