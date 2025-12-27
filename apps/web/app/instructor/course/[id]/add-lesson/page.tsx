"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AddLessonPage() {
  const { id } = useParams(); // course ID

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // 🔥 Upload Video to Supabase
  // ---------------------------
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 🔒 Size limit (example: 200MB)
  const MAX_SIZE = 200 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    alert("Video too large. Max 200MB allowed.");
    return;
  }

  setUploading(true);

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `courses/${id}/${fileName}`;

    const { error } = await supabase.storage
      .from("lesson-videos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("lesson-videos")
      .getPublicUrl(filePath);

    setVideoUrl(data.publicUrl);
  } catch (err) {
    console.error(err);
    alert("Video upload failed. Check bucket policy or file size.");
  } finally {
    setUploading(false);
  }
};

  // ---------------------------
  // Add Lesson
  // ---------------------------
  const handleAddLesson = async () => {
    if (!title) return alert("Title is required");

    setLoading(true);

    const { error } = await supabase.from("lessons").insert({
      course_id: id,
      title,
      content,
      video_url: videoUrl, // URL auto-filled
    });

    setLoading(false);

    if (error) {
      alert("Failed to add lesson");
      return;
    }

    alert("Lesson added successfully!");
    window.location.href = `/instructor/course/${id}`;
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Add Lesson</h1>

      <div className="space-y-4">
        <Input
          placeholder="Lesson Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Lesson Content (text)"
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Upload Video File */}
        <div>
          <label className="block mb-1 font-semibold">Upload Lesson Video</label>
          <Input type="file" accept="video/*" onChange={handleVideoUpload} />
          {uploading && (
            <p className="text-sm text-blue-600 mt-1">Uploading video...</p>
          )}
          {videoUrl && (
            <p className="text-sm text-green-600 mt-1">
              Video uploaded successfully!
            </p>
          )}
        </div>

        <Button className="w-full" disabled={loading} onClick={handleAddLesson}>
          {loading ? "Adding..." : "Add Lesson"}
        </Button>
      </div>
    </div>
  );
}
