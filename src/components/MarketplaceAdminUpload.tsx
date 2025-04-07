import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const MarketplaceAdminUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9.()_\-Α-Ωα-ωίϊΐόάέύϋΰήώ ]/g, "_");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: auth } = await supabase.auth.getUser();
      const user_id = auth?.user?.id;

      if (!user_id) throw new Error("User not authenticated");

      let imagePath = null;
      const uploadedFilePaths: string[] = [];

      if (image) {
        const imageName = `${uuidv4()}_${sanitizeFileName(image.name)}`;
        const imageFullPath = `marketplace/images/${imageName}`;
        const { error } = await supabase.storage
          .from("idea-file")
          .upload(imageFullPath, image);

        if (error) throw new Error("Image upload failed");
        imagePath = imageFullPath;
      }

      for (const file of files) {
        const fileName = `${uuidv4()}_${sanitizeFileName(file.name)}`;
        const fullPath = `marketplace/files/${fileName}`;
        const { error } = await supabase.storage
          .from("idea-file")
          .upload(fullPath, file);

        if (error) throw new Error(`Upload failed for ${file.name}`);
        uploadedFilePaths.push(fullPath);
      }

      const { error: insertError } = await supabase.from("marketplace").insert({
        id: uuidv4(),
        title,
        description,
        price,
        approved: true,
        resale_enabled: true,
        owner_id: user_id,
        image_url: imagePath,
        file_url: uploadedFilePaths[0] || null,
      });

      if (insertError) throw insertError;

      setAlert("✅ Strategy uploaded successfully!");
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err: any) {
      console.error("🔥 Upload error:", err);
      setAlert(`❌ Σφάλμα: ${err.message}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/assets/login-bg.png')" }}
    >
      <form
        onSubmit={handleUpload}
        className="bg-white/90 p-6 rounded-xl shadow-lg max-w-xl w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">📤 Upload Strategy</h2>

        <input
          type="text"
          placeholder="Strategy Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Strategy Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Price €"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />

        <div>
          <label className="block font-semibold mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Attach Files</label>
          <input
            type="file"
            multiple
            accept=".zip,.pdf,.txt,image/*,video/*"
            onChange={handleFilesChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Upload Strategy
        </button>

        {alert && (
          <div className="mt-2 p-2 text-sm bg-green-100 text-green-700 rounded">
            {alert}
          </div>
        )}
      </form>
    </div>
  );
};

export default MarketplaceAdminUpload;
