import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function DownloadButton({ strategy_id }: { strategy_id: string }) {
  const handleDownload = async () => {
    const { data: marketplaceData, error } = await supabase
      .from("marketplace")
      .select("owner_id")
      .eq("id", strategy_id)
      .single();

    if (error || !marketplaceData) {
      alert("Failed to fetch strategy details");
      return;
    }

    const owner_id = marketplaceData.owner_id;
    const extensions = ["pdf", "txt"];
    let signedUrl = null;

    for (const ext of extensions) {
      const path = `marketplace/${owner_id}/${strategy_id}/main.${ext}`;
      const { data } = await supabase.storage
        .from("idea-file")
        .createSignedUrl(path, 60 * 60 * 24 * 7);

      if (data?.signedUrl) {
        signedUrl = data.signedUrl;
        break;
      }
    }

    if (!signedUrl) {
      alert("File not available yet. Please contact support.");
      return;
    }

    window.open(signedUrl, "_blank");
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleDownload}>
      📥 Download
    </Button>
  );
}
