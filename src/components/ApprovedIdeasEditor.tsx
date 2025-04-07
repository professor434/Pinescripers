import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ApprovedIdeasEditor({ currentProfile }) {
  const [pendingIdeas, setPendingIdeas] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  const fetchPendingIdeas = async () => {
    let query = supabase.from("marketplace").select("*").eq("approved", false);
    if (currentProfile?.role !== "admin") {
      query = query.eq("owner_id", currentProfile?.user_id);
    }
    const { data, error } = await query;
    if (error) console.error("Error fetching ideas:", error);
    else setPendingIdeas(data || []);
  };

  const handleFileUpload = async (idea, file, type) => {
    const path = `marketplace/${idea.owner_id}/${idea.id}/${type === "image" ? "main.png" : "main.pdf"}`;
    const { error: uploadError } = await supabase.storage
      .from("idea-file")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return;
    }

    const { data: signedData } = await supabase.storage
      .from("idea-file")
      .createSignedUrl(path, 60 * 60 * 24 * 365);

    const updateField = type === "image" ? "image_url" : "file_url";
    await supabase
      .from("marketplace")
      .update({ [updateField]: signedData?.signedUrl })
      .eq("id", idea.id);

    fetchPendingIdeas();
  };

  const handleApprove = async (idea) => {
    if (currentProfile?.role !== "admin") {
      alert("Unauthorized action. Only admins can approve.");
      return;
    }

    const title = document.getElementById(`title-${idea.id}`)?.value || idea.title;
    const description = document.getElementById(`desc-${idea.id}`)?.value || idea.description;
    const price = parseFloat(document.getElementById(`price-${idea.id}`)?.value || idea.price || 0);
    const category = categoryMap[idea.id] || idea.category;

    const filePath = `marketplace/${idea.owner_id}/${idea.id}/main.pdf`;
    const imagePath = `marketplace/${idea.owner_id}/${idea.id}/main.png`;

    const { data: signedFile } = await supabase.storage
      .from("idea-file")
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);
    const { data: signedImage } = await supabase.storage
      .from("idea-file")
      .createSignedUrl(imagePath, 60 * 60 * 24 * 365);

    if (!signedFile?.signedUrl || !signedImage?.signedUrl) {
      alert("Missing uploaded files. Please upload image and PDF before approving.");
      return;
    }

    const payload = {
      title,
      description,
      price,
      category,
      image_url: signedImage.signedUrl,
      file_url: signedFile.signedUrl,
      approved: true,
    };

    const { error } = await supabase
      .from("marketplace")
      .update(payload)
      .eq("id", idea.id);

    if (error) {
      alert("Approval failed: " + error.message);
    } else {
      // Insert στο purchases
      const { error: insertError } = await supabase.from("purchases").insert({
        user_id: idea.owner_id,
        strategy_id: idea.id,
        title,
        status: "pending",
        payed: false,
      });

      if (insertError) {
        alert("Approved, but failed to create purchase entry: " + insertError.message);
      } else {
        alert("✅ You are in the marketplace!");
        setPendingIdeas((prevIdeas) => prevIdeas.filter((item) => item.id !== idea.id));
      }
    }
  };

  const handleReject = async (idea) => {
    if (currentProfile?.role !== "admin") {
      alert("Unauthorized action. Only admins can reject.");
      return;
    }

    try {
      await supabase.from("marketplace").delete().eq("id", idea.id);
      await supabase.from("ideaz").delete().eq("strategy_id", idea.id);
      setPendingIdeas((prevIdeas) => prevIdeas.filter((item) => item.id !== idea.id));
      alert("🗑 Idea successfully rejected and removed.");
    } catch (error) {
      alert("Deletion failed: " + error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentProfile?.user_id) fetchPendingIdeas();
  }, [currentProfile]);

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">🛠 Pending Marketplace Approvals</h2>
      <div className="space-y-4">
        {pendingIdeas.map((idea) => (
          <Card key={idea.id}>
            <CardContent className="space-y-3 p-4">
              <Label>Title</Label>
              <Input id={`title-${idea.id}`} defaultValue={idea.title} />
              <Label>Description</Label>
              <Input id={`desc-${idea.id}`} defaultValue={idea.description} />
              <Label>Price ($)</Label>
              <Input id={`price-${idea.id}`} type="number" defaultValue={idea.price || 0} />
              <Label>Category</Label>
              <Select
                value={categoryMap[idea.id] || idea.category || ""}
                onValueChange={(val) =>
                  setCategoryMap((prev) => ({ ...prev, [idea.id]: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
               <SelectContent>
 	   <SelectItem value="Strategy">Strategy</SelectItem>
  	   <SelectItem value="Indicator">Indicator</SelectItem>
  	   <SelectItem value="Indices">Indices</SelectItem>
	  </SelectContent>

              </Select>

              <Label>Upload Image (PNG/JPG)</Label>
              <Input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => e.target.files[0] && handleFileUpload(idea, e.target.files[0], "image")}
              />

              <Label>Upload File (PDF or TXT)</Label>
              <Input
                type="file"
                accept="application/pdf,text/plain"
                onChange={(e) => e.target.files[0] && handleFileUpload(idea, e.target.files[0], "file")}
              />

              <div className="flex gap-4 mt-2">
                <Button onClick={() => handleApprove(idea)}>✅ Approve</Button>
                <Button variant="destructive" onClick={() => handleReject(idea)}>🗑 Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
