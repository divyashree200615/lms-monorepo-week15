"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function LessonPlayerWithSidebar() {
  const router = useRouter();
  const params = useParams();

  const courseId = params?.id as string;
  const lessonId = params?.lessonId as string;

  const [lesson, setLesson] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------
     ACCESS PROTECTION
  --------------------------------------------------*/
  useEffect(() => {
    const checkAccess = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        router.replace(`/course/${courseId}`);
        return;
      }

      const { data: enrolled } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", auth.user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (!enrolled) {
        router.replace(`/course/${courseId}`);
      }
    };

    if (courseId) checkAccess();
  }, [courseId, router]);

  /* -------------------------------------------------
     LOAD DATA + SAVE RESUME PROGRESS
  --------------------------------------------------*/
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 1️⃣ Load lessons
      const { data: allLessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      setLessons(allLessons ?? []);

      // 2️⃣ Load current lesson
      const { data: singleLesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .maybeSingle();

      setLesson(singleLesson);

      // 3️⃣ Auth
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;

      if (uid && singleLesson) {
        // 🔁 SAVE LAST WATCHED LESSON
        await supabase.from("course_progress").upsert({
          user_id: uid,
          course_id: courseId,
          last_lesson_id: lessonId,
          last_watched_at: new Date().toISOString(),
        });

        // ✅ Completed lessons
        const { data: completed } = await supabase
          .from("lesson_completions")
          .select("lesson_id")
          .eq("user_id", uid)
          .in(
            "lesson_id",
            (allLessons ?? []).map((l) => l.id)
          );

        setCompletedLessonIds(
          completed?.map((c) => c.lesson_id) ?? []
        );
      }

      setLoading(false);
    };

    if (courseId && lessonId) load();
  }, [courseId, lessonId]);

  /* -------------------------------------------------
     MARK COMPLETED
  --------------------------------------------------*/
  const markCompleted = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth?.user?.id;
    if (!uid) return;

    // Prevent duplicate insert
    await supabase.from("lesson_completions").upsert({
      user_id: uid,
      lesson_id: lessonId,
    });

    setCompletedLessonIds((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    );

    const currentIndex = lessons.findIndex((l) => l.id === lessonId);
    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson) {
      router.push(`/course/${courseId}/lesson/${nextLesson.id}`);
    } else {
      // 🎓 Course completed
      await supabase.from("certificates").upsert({
        user_id: uid,
        course_id: courseId,
      });

      router.push(`/course/${courseId}`);
    }
  };

  /* -------------------------------------------------
     UI
  --------------------------------------------------*/
  if (loading) return <p className="p-6">Loading...</p>;
  if (!lesson) return <p className="p-6">Lesson not found</p>;

  return (
    <div className="flex h-screen">
      {/* MAIN PLAYER */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

        {lesson.video_url && (
          <video
            src={lesson.video_url}
            controls
            controlsList="nodownload"
            className="w-full rounded mb-6"
            onEnded={markCompleted}
          />
        )}

        <div className="text-lg leading-relaxed">
          {lesson.content || "No content available."}
        </div>

        {!completedLessonIds.includes(lessonId) && (
          <Button className="mt-6" onClick={markCompleted}>
            Mark as Completed
          </Button>
        )}
      </div>

      {/* SIDEBAR */}
      <aside className="w-80 border-l bg-white overflow-y-auto">
        <div className="p-4 font-semibold text-lg border-b">
          Course Content
        </div>

        <ul className="divide-y">
          {lessons.map((l, index) => {
            const isActive = l.id === lessonId;
            const isCompleted = completedLessonIds.includes(l.id);

            return (
              <li
                key={l.id}
                onClick={() =>
                  router.push(`/course/${courseId}/lesson/${l.id}`)
                }
                className={`p-4 cursor-pointer flex items-center justify-between
                  ${
                    isActive
                      ? "bg-gray-100 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
              >
                <span>
                  {index + 1}. {l.title}
                </span>

                {isCompleted && (
                  <CheckCircle className="text-green-600 w-5 h-5" />
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
