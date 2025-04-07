import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const IdeaSubmissionForm = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("Strategy");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [alert, setAlert] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const ensureUserInProfiles = async (user_id: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", user_id)
      .single();

    if (!data) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ user_id, role: "user" });

      if (insertError) throw insertError;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert("");

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error("Ο χρήστης δεν είναι συνδεδεμένος");

      const user_id = authData.user.id;
      await ensureUserInProfiles(user_id);

      const uploadedPaths: string[] = [];

      for (const file of files) {
        const safeName = file.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_.()-]/g, "_")
          .toLowerCase();

        const fileName = `${uuidv4()}_${safeName}`;
        const fullPath = `ideas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("idea-file")
          .upload(fullPath, file);

        if (uploadError) throw new Error(`Αποτυχία μεταφόρτωσης: ${uploadError.message}`);
        uploadedPaths.push(fullPath);
      }

      const strategy_id = uuidv4();

      // Πρώτα insert στο marketplace (χρειάζεται να υπάρχει πριν γίνει reference από το ideaz)
      const { error: marketplaceError } = await supabase.from("marketplace").insert([
        {
          id: strategy_id,
          title,
          description,
          category: type,
          price: 0,
          approved: false,
          resale_enabled: false,
          owner_id: user_id,
          image_url: uploadedPaths[0] ?? null,
          file_url: uploadedPaths[0] ?? null,
        },
      ]);

      if (marketplaceError)
        throw new Error("Αποτυχία καταχώρησης στο Marketplace: " + marketplaceError.message);

      // Μετά insert στο ideaz
      const { error: ideazError } = await supabase.from("ideaz").insert([
        {
          user_id,
          type,
          title,
          description,
          file_urls: uploadedPaths,
          strategy_id,
        },
      ]);

      if (ideazError) throw new Error("Η ιδέα δεν αποθηκεύτηκε: " + ideazError.message);

      // Εισαγωγή notification στο admin_requests
      await supabase.from("admin_requests").insert({
        type: "New Idea",
        message: `Νέα ιδέα (${type}) με τίτλο "${title}" από χρήστη ${user_id}.`,
        seen: false,
        created_at: new Date().toISOString(),
      });

      setAlert("✅ Η ιδέα υποβλήθηκε με επιτυχία!");
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (error: any) {
      console.error("🔥 Error:", error);
      setAlert(`❌ Σφάλμα: ${error.message}`);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: "url('/assets/login-bg.png')" }}
    >
      <div className="bg-white/90 p-6 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Strategy Idea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Strategy Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>Strategy</option>
              <option>Indicator</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Strategy Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Details / Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded h-28"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Upload Files</label>
            <input
              type="file"
              accept="image/*,video/*,.txt,.pdf,.zip"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            {files.length > 0 && (
              <ul className="text-sm text-gray-700 mt-2">
                {files.map((file, idx) => (
                  <li key={idx}>
                    {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Idea
          </button>
          {alert && (
            <div className="mt-4 p-3 text-sm text-green-700 bg-green-100 rounded">{alert}</div>
          )}
        </form>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-blue-700 hover:underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default IdeaSubmissionForm;
