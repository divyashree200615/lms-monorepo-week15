"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) return;

      // Fetch all wishlist items with course details
      const { data } = await supabase
        .from("wishlist")
        .select("id, course_id, courses(*)")
        .eq("user_id", userId);

      setWishlist(data || []);
      setLoading(false);
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = async (wishlistId: string) => {
    await supabase.from("wishlist").delete().eq("id", wishlistId);

    // Update UI
    setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
  };

  if (loading) return <p className="p-6">Loading wishlist...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">My Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">No courses in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const course = item.courses;

            return (
              <div
                key={item.id}
                className="border rounded p-4 shadow-sm hover:shadow"
              >
                <img
                  src={course.thumbnail_url}
                  className="w-full h-40 object-cover rounded mb-3"
                />

                <h2 className="font-semibold text-lg mb-1">{course.title}</h2>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {course.description}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <Link
                    href={`/course/${course.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Course
                  </Link>

                  <Button
                    variant="destructive"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
