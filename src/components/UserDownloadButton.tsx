import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function DownloadButton({ strategyId }: { strategyId: string }) {
  const [canDownload, setCanDownload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("purchases")
        .select("payed, status")
        .eq("strategy_id", strategyId)
        .eq("user_id", user.id)
        .maybeSingle();

      const access = data?.payed || data?.status === "paid";
      setCanDownload(access);
      setLoading(false);
    };

    const fetchOwner = async () => {
      const { data } = await supabase
        .from("marketplace")
        .select("owner_id")
        .eq("id", strategyId)
        .maybeSingle();

      setOwnerId(data?.owner_id || null);
    };

    checkAccess();
    fetchOwner();
  }, [strategyId]);

  const handleDownload = async () => {
    if (!ownerId) return alert("❌ Owner not found.");

    const filePath = `marketplace/${ownerId}/${strategyId}/main.pdf`;

    const { data: signedUrlData, error } = await supabase.storage
      .from("idea-file")
      .createSignedUrl(filePath, 60 * 10); // 10 minutes

    if (error || !signedUrlData?.signedUrl) {
      alert("❌ Unable to generate download link.");
      return;
    }

    window.open(signedUrlData.signedUrl, "_blank");
  };

  if (loading) return <p>Loading access...</p>;

  return (
    <Button
      onClick={() =>
        canDownload
          ? handleDownload()
          : alert("🚫 You need to purchase this strategy to access the file.")
      }
    >
      📥 Download PDF
    </Button>
  );
}
