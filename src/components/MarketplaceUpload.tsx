import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const MarketplaceUploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Strategy");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [resaleEnabled, setResaleEnabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      alert("User not authenticated");
      return;
    }

    const { error } = await supabase.from("ideas.marketplace").insert([
      {
        title,
        description,
        category,
        price: parseFloat(price),
        image_url: imageUrl,
        file_url: fileUrl,
        resale_enabled: resaleEnabled,
        approved: false,
        created_at: new Date().toISOString(),
        owner_id: userId,
      },
    ]);

    if (error) {
      console.error("Error inserting record:", error);
      alert("Υπήρξε σφάλμα στην υποβολή. Δοκιμάστε ξανά.");
    } else {
      alert("Η στρατηγική υποβλήθηκε για έλεγχο επιτυχώς!");
      navigate("/UserDashboard");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-bold mb-4">Upload Strategy</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full mb-3 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full mb-3 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="Strategy">Strategy</option>
          <option value="Indicator">Indicator</option>
        </select>

        <input
          type="number"
          placeholder="Price (USDT)"
          className="w-full mb-3 p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          className="w-full mb-3 p-2 border rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="File URL (pine script .txt/.pdf)"
          className="w-full mb-3 p-2 border rounded"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />

        <label className="block mb-3">
          <input
            type="checkbox"
            className="mr-2"
            checked={resaleEnabled}
            onChange={() => setResaleEnabled(!resaleEnabled)}
          />
          Enable resale for this strategy
        </label>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Submit for Review
        </button>
      </form>
    </div>
  );
};

export default MarketplaceUploadForm;
