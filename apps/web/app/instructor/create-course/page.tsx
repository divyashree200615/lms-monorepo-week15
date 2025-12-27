"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateCoursePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleThumbnailChange = (file: File) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const uploadThumbnail = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error } = await supabase.storage
      .from("course-thumbnails")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("course-thumbnails")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleCreateCourse = async () => {
    if (!title || !description || !thumbnailFile) {
      alert("Title, description, and thumbnail are required");
      return;
    }

    setLoading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) throw new Error("Not authenticated");

      // 1️⃣ Upload thumbnail
      const thumbnailUrl = await uploadThumbnail(thumbnailFile);

      // 2️⃣ Insert course
      const { error } = await supabase.from("courses").insert({
        title,
        description,
        thumbnail_url: thumbnailUrl,
        instructor_id: user.id,
        price: Number(price) || 0,
        original_price: Number(originalPrice) || 0,
      });

      if (error) throw error;

      router.push("/instructor/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>

      <div className="space-y-4">
        <Input
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* THUMBNAIL UPLOAD */}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleThumbnailChange(e.target.files[0])
          }
        />

        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="w-full h-48 object-cover rounded-md border"
          />
        )}

        <Input
          type="number"
          placeholder="Price (₹). Enter 0 for FREE"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Original Price (₹)"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
        />

        <Button
          className="w-full"
          disabled={loading}
          onClick={handleCreateCourse}
        >
          {loading ? "Creating Course..." : "Create Course"}
        </Button>
      </div>
    </div>
  );
}
