"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id || null;
      setUserId(uid);

      if (uid) {
        const { data } = await supabase
          .from("courses")
          .select("*")
          .eq("instructor_id", uid)
          .order("created_at", { ascending: false });

        setCourses(data || []);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  /* ---------------- DELETE COURSE ---------------- */
  const deleteCourse = async (course: any) => {
    const confirmDelete = window.confirm(
      "⚠️ This will permanently delete the course, all lessons, videos, enrollments and progress. Continue?"
    );
    if (!confirmDelete) return;

    try {
      /* 1️⃣ Fetch lesson videos */
      const { data: lessons } = await supabase
        .from("lessons")
        .select("video_url")
        .eq("course_id", course.id);

      /* 2️⃣ Delete lesson videos from storage */
      if (lessons?.length) {
        const videoPaths = lessons
          .map((l) => l.video_url)
          .filter(Boolean)
          .map((url) => {
            const parts = url.split("/lesson-videos/");
            return parts[1];
          });

        if (videoPaths.length) {
          await supabase.storage
            .from("lesson-videos")
            .remove(videoPaths);
        }
      }

      /* 3️⃣ Delete course thumbnail */
      if (course.thumbnail_url) {
        const thumbPath =
          course.thumbnail_url.split("/course-thumbnails/")[1];

        if (thumbPath) {
          await supabase.storage
            .from("course-thumbnails")
            .remove([thumbPath]);
        }
      }

      /* 4️⃣ Delete course (CASCADE deletes lessons, completions, enrollments) */
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", course.id);

      if (error) throw error;

      /* 5️⃣ Update UI */
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Instructor Dashboard</h1>

      <Link
        href="/instructor/create-course"
        className="bg-black text-white px-4 py-2 rounded inline-block"
      >
        + Create Course
      </Link>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Courses</h2>

      {courses.length === 0 && (
        <p>You have not created any courses yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border p-4 rounded shadow relative"
          >
            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteCourse(course)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800"
              title="Delete Course"
            >
              <Trash2 size={18} />
            </button>

            {course.thumbnail_url && (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            <h3 className="font-bold text-lg">{course.title}</h3>
            <p className="text-sm mt-2 line-clamp-3">
              {course.description}
            </p>

            <Link
              href={`/instructor/course/${course.id}`}
              className="text-blue-600 underline block mt-3"
            >
              View Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
