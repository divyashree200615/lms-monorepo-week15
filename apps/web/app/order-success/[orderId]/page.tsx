'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const processOrder = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return router.push("/login");

      const userId = auth.user.id;

      /* 1️⃣ Fetch order items */
      const { data: items } = await supabase
        .from("order_items")
        .select("course_id")
        .eq("order_id", orderId);

      if (!items || items.length === 0) {
        setLoading(false);
        return;
      }

      /* 2️⃣ Enroll user to each course */
      for (const item of items) {
        await supabase.from("enrollments").insert({
          user_id: userId,
          course_id: item.course_id,
        });
      }

      /* 3️⃣ Clear cart */
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);

      /* 4️⃣ Load purchased courses */
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .in(
          "id",
          items.map((i) => i.course_id)
        );

      setCourses(courseData || []);
      setLoading(false);
    };

    processOrder();
  }, [orderId, router]);

  if (loading) {
    return <p className="p-6 text-center">Processing your order...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Purchase Successful!
      </h1>

      <p className="text-gray-600 mb-8">
        You now have full access to your course(s)
      </p>

      <div className="grid gap-4">
        {courses.map((c) => (
          <div
            key={c.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <span className="font-medium">{c.title}</span>

            <Link href={`/course/${c.id}`}>
              <Button>Start Learning</Button>
            </Link>
          </div>
        ))}
      </div>

      <Link href="/my-learning">
        <Button className="mt-8">Go to My Learning</Button>
      </Link>
    </div>
  );
}
