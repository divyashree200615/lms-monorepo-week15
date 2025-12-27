"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const processOrder = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;

      if (!userId) {
        router.push("/login");
        return;
      }

      /* 1️⃣ Get cart items */
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("course_id")
        .eq("user_id", userId);

      if (!cartItems || cartItems.length === 0) {
        router.push("/my-learning");
        return;
      }

      /* 2️⃣ Enroll user in each course */
      const enrollments = cartItems.map((item) => ({
        user_id: userId,
        course_id: item.course_id,
      }));

      await supabase.from("enrollments").insert(enrollments);

      /* 3️⃣ Clear cart */
      await supabase.from("cart_items").delete().eq("user_id", userId);

      /* 4️⃣ Fetch enrolled courses for UI */
      const { data: enrolledCourses } = await supabase
        .from("courses")
        .select("id, title, thumbnail_url")
        .in(
          "id",
          cartItems.map((c) => c.course_id)
        );

      setCourses(enrolledCourses || []);
      setLoading(false);
    };

    processOrder();
  }, [router]);

  if (loading) {
    return <p className="p-6 text-center">Processing your order...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Order Successful!
      </h1>

      <p className="text-gray-600 mb-8">
        You are now enrolled in the following courses:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border rounded-lg p-4 flex items-center gap-4"
          >
            {course.thumbnail_url && (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-24 h-16 object-cover rounded"
              />
            )}

            <div className="text-left">
              <h3 className="font-semibold">{course.title}</h3>
              <Link
                href={`/course/${course.id}`}
                className="text-blue-600 text-sm underline"
              >
                Go to course
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={() => router.push("/my-learning")}>
        Go to My Learning
      </Button>
    </div>
  );
}
