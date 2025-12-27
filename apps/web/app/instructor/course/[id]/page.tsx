"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function CourseDetailPage() {
  const { id: courseId } = useParams();

  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [lessonType, setLessonType] = useState<"video" | "text">("video");
const [lessonContent, setLessonContent] = useState("");



  /* ---------------- LOAD COURSE + SECTIONS + LESSONS ---------------- */
  const loadData = async () => {
    setLoading(true);

    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    setCourse(courseData);

    const { data: sectionsData } = await supabase
      .from("sections")
      .select(
        `
        *,
        lessons (
          id,
          title,
          video_url,
          duration,
          order_index
        )
      `
      )
      .eq("course_id", courseId)
      .order("order_index")
      .order("order_index", { foreignTable: "lessons" });

    setSections(sectionsData || []);
    setLoading(false);
  };

  useEffect(() => {
    if (courseId) loadData();
  }, [courseId]);

  /* ---------------- ADD SECTION ---------------- */
  const addSection = async () => {
    if (!sectionTitle.trim()) return;

    await supabase.from("sections").insert({
      course_id: courseId,
      title: sectionTitle,
      order_index: sections.length + 1,
    });

    setSectionTitle("");
    loadData();
  };

  /* ---------------- ADD LESSON ---------------- */
  const addLesson = async () => {
  if (!lessonTitle || !activeSectionId) {
    alert("Lesson title required");
    return;
  }

  let videoUrl = null;
  let duration = 0;

  /* ---------- VIDEO LESSON ---------- */
  if (lessonType === "video") {
    if (!videoFile) {
      alert("Video is required");
      return;
    }

    setUploading(true);

    const filePath = `courses/${courseId}/${Date.now()}-${videoFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("lesson-videos")
      .upload(filePath, videoFile);

    if (uploadError) {
      alert("Video upload failed");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("lesson-videos")
      .getPublicUrl(filePath);

    videoUrl = urlData.publicUrl;

    duration = await new Promise<number>((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);
      video.onloadedmetadata = () =>
        resolve(Math.floor(video.duration));
    });
  }

  /* ---------- TEXT LESSON ---------- */
  if (lessonType === "text" && !lessonContent.trim()) {
    alert("Text content required");
    return;
  }

  /* ---------- INSERT LESSON ---------- */
  await supabase.from("lessons").insert({
    course_id: courseId,
    section_id: activeSectionId,
    title: lessonTitle,
    video_url: videoUrl,
    duration,
    content: lessonType === "text" ? lessonContent : null,
    order_index: 1,
  });

  /* ---------- RESET ---------- */
  setLessonTitle("");
  setLessonContent("");
  setVideoFile(null);
  setLessonType("video");
  setActiveSectionId(null);
  setUploading(false);

  loadData();
};



  /* ---------------- DELETE LESSON + VIDEO ---------------- */
  const deleteLesson = async (lesson: any) => {
    if (!window.confirm("Delete lesson and video?")) return;

    if (lesson.video_url) {
      const path = lesson.video_url.split(
        "/storage/v1/object/public/lesson-videos/"
      )[1];

      if (path) {
        await supabase.storage.from("lesson-videos").remove([path]);
      }
    }

    await supabase.from("lessons").delete().eq("id", lesson.id);
    loadData();
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!course) return <p className="p-6">Course not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-600 mt-2">{course.description}</p>

      {/* ADD SECTION */}
      <div className="mt-6 flex gap-2">
        <Input
          placeholder="New section title"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
        />
        <Button onClick={addSection}>Add Section</Button>
      </div>

      {/* SECTIONS */}
      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="border rounded">
            <div className="p-4 font-semibold bg-gray-100">
              {section.title} (
              {section.lessons.length} lectures •{" "}
              {Math.floor(
                section.lessons.reduce(
                  (s: number, l: any) => s + (l.duration || 0),
                  0
                ) / 60
              )}{" "}
              min)
            </div>

            {/* LESSONS */}
            <ul>
              {section.lessons.map((l: any, i: number) => (
                <li
                  key={l.id}
                  className="flex justify-between items-center px-4 py-3 border-t"
                >
                  <span>
                    {i + 1}. {l.title}
                  </span>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteLesson(l)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>

            {/* ADD LESSON */}
            <div className="p-4 flex flex-col gap-3 border-t">
  <Input
    placeholder="Lesson title"
    value={activeSectionId === section.id ? lessonTitle : ""}
    onChange={(e) => {
      setLessonTitle(e.target.value);
      setActiveSectionId(section.id);
    }}
  />

  {/* LESSON TYPE */}
  <div className="flex gap-4 text-sm">
    <label className="flex items-center gap-1">
      <input
        type="radio"
        checked={lessonType === "video"}
        onChange={() => setLessonType("video")}
      />
      Video
    </label>

    <label className="flex items-center gap-1">
      <input
        type="radio"
        checked={lessonType === "text"}
        onChange={() => setLessonType("text")}
      />
      Text
    </label>
  </div>

  {/* VIDEO INPUT */}
  {lessonType === "video" && (
    <Input
      type="file"
      accept="video/*"
      onChange={(e) =>
        setVideoFile(e.target.files?.[0] || null)
      }
    />
  )}

  {/* TEXT INPUT */}
  {lessonType === "text" && (
    <textarea
      className="border rounded p-2 text-sm"
      placeholder="Write lesson content here..."
      rows={5}
      value={lessonContent}
      onChange={(e) => setLessonContent(e.target.value)}
    />
  )}

  <Button onClick={addLesson} disabled={uploading}>
    {uploading ? "Uploading..." : "Add Lesson"}
  </Button>
</div>


          </div>
        ))}
      </div>
    </div>
  );
}
