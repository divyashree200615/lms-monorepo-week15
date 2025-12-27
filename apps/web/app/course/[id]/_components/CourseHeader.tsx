"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CourseHeader() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();

      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      setCourse(courseData);

      if (!auth?.user) return;

      const { data: enrolled } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", auth.user.id)
        .eq("course_id", id)
        .maybeSingle();

      setIsPurchased(!!enrolled);
    };

    load();
  }, [id]);

  if (!course) return null;

  return (
    <div className="bg-[#1c1d1f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-300 mb-4">{course.description}</p>

          <p className="text-sm text-gray-400">
            Created by <span className="text-purple-400">{course.instructor_name}</span>
          </p>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-white text-black rounded-lg shadow-lg p-4 sticky top-6">
          <img
            src={course.thumbnail_url}
            className="w-full h-40 object-cover rounded mb-4"
          />

          <p className="text-3xl font-bold mb-4">
            {course.price === 0 ? "FREE" : `₹${course.price}`}
          </p>

          {!isPurchased ? (
            <Button className="w-full mb-2">Enroll Now</Button>
          ) : (
            <Button
              className="w-full bg-green-600"
              onClick={() => router.push(`/learning/${id}`)}
            >
              Go to course
            </Button>
          )}

          <p className="text-xs text-center mt-3 text-gray-500">
            30-Day Money-Back Guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
