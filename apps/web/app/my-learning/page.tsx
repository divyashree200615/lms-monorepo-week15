"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function MyLearningPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [resumeLesson, setResumeLesson] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) return;

      // Enrolled courses
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", userId);

      if (!enrollments || enrollments.length === 0) {
        setCourses([]);
        return;
      }

      const courseIds = enrollments.map((e: any) => e.course_id);

      const { data: coursesData } = await supabase
        .from("courses")
        .select("*")
        .in("id", courseIds);

      const courseList = coursesData ?? [];
      setCourses(courseList);

      const progressMap: Record<string, number> = {};
      const resumeMap: Record<string, string> = {};
      const ratingMap: Record<string, number> = {};

      for (const course of courseList) {
        const { data: lessons } = await supabase
          .from("lessons")
          .select("id, order_index")
          .eq("course_id", course.id)
          .order("order_index", { ascending: true });

        const lessonList = lessons ?? [];
        const lessonIds = lessonList.map((l: any) => l.id);

        const { data: completed } = await supabase
          .from("lesson_completions")
          .select("lesson_id")
          .eq("user_id", userId)
          .in("lesson_id", lessonIds);

        const completedIds = completed?.map((c: any) => c.lesson_id) ?? [];

        const total = lessonList.length;
        const done = completedIds.length;
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;

        progressMap[course.id] = percent;

        const nextLesson =
          lessonList.find((l: any) => !completedIds.includes(l.id)) ?? null;

        resumeMap[course.id] =
          nextLesson?.id || lessonList[0]?.id || "";

        const { data: ratingRows } = await supabase
          .from("course_reviews")
          .select("rating")
          .eq("course_id", course.id);

        if (ratingRows && ratingRows.length > 0) {
          const validRatings = ratingRows
            .map((r) => r.rating)
            .filter((r) => typeof r === "number");

          ratingMap[course.id] =
            validRatings.length > 0
              ? Math.round(
                  (validRatings.reduce((a, r) => a + r, 0) /
                    validRatings.length) *
                    10
                ) / 10
              : 0;
        } else {
          ratingMap[course.id] = 0;
        }
      }

      setProgress(progressMap);
      setResumeLesson(resumeMap);
      setRatings(ratingMap);
    };

    loadData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">My Learning</h1>

      {courses.length === 0 ? (
        <p className="text-gray-600">
          You haven't enrolled in any courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => {
            const percent = progress[course.id] ?? 0;
            const rating = ratings[course.id] ?? 0;
            const resumeId = resumeLesson[course.id] ?? "";

            return (
              <div
                key={course.id}
                className="border rounded p-4 shadow-sm hover:shadow"
              >
                {/* ✅ SAFE IMAGE RENDER */}
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500 text-sm">
                    No thumbnail
                  </div>
                )}

                <h2 className="font-semibold text-lg mb-1">
                  {course.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {course.description}
                </p>

                <p className="text-sm text-yellow-600 mb-2">
                  ⭐ {rating}/5
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-sm font-medium text-gray-700 mb-4">
                  {percent}% completed
                </p>


                {percent === 100 ? (
  <>
    <Link
      href={`/course/${course.id}`}
      className="bg-purple-600 text-white px-4 py-2 rounded block text-center mb-2"
    >
      Review Course
    </Link>

  </>
) : (
  <Link
    href={`/course/${course.id}/lesson/${resumeId}`}
    className="bg-blue-600 text-white px-4 py-2 rounded block text-center"
  >
    Resume Course
  </Link>
)}              
              </div>
            );
          })}
        </div>
      )}
      
    </div>
  );
}
