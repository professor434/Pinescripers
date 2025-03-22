import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function IdeaSubmissionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isPaid, setIsPaid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Idea submitted!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto grid gap-6">
      <h1 className="text-2xl font-bold">Submit Your Strategy Idea</h1>
      <Card>
        <CardContent className="p-4 grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label>Your Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
            </div>
            <div>
              <Label>Upload Image or Video</Label>
              <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className="flex items-center gap-4">
              <Label>Paid Request?</Label>
              <Switch checked={isPaid} onCheckedChange={setIsPaid} />
            </div>
            <Button type="submit">Submit Idea</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}