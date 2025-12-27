"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Star } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      const { data } = await supabase
        .from("courses")
        .select("*, instructor:profiles(full_name)");

      setCourses(data || []);
    };

    loadCourses();
  }, []);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "FREE";
    return `₹${price}`;
  };

  const getDiscountPercent = (price: number, originalPrice: number) => {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">All Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => {
          const discount = getDiscountPercent(
            course.price,
            course.original_price
          );

          // ✅ SAFE IMAGE SRC (NO EMPTY STRING)
          const thumbnail =
            course.thumbnail_url && course.thumbnail_url.trim() !== ""
              ? course.thumbnail_url
              : "/course-placeholder.png"; // put image in /public

          return (
            <Link
              key={course.id}
              href={`/course/${course.id}`}
              className="group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden rounded mb-2 bg-gray-100">
                <img
                  src={thumbnail}
                  alt={course.title}
                  className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <h3 className="font-bold text-base mb-1 line-clamp-2">
                {course.title}
              </h3>

              {/* Instructor */}
              <p className="text-sm text-gray-600 mb-1">
                {course.instructor?.full_name || "Unknown Instructor"}
              </p>

              {/* Rating (static for now) */}
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-sm">4.7</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < 4
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">(1,234)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold text-lg ${
                    course.price === 0 ? "text-green-600" : "text-black"
                  }`}
                >
                  {formatPrice(course.price)}
                </span>

                {course.original_price > course.price &&
                  course.price !== 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{course.original_price}
                    </span>
                  )}

                {discount && (
                  <span className="text-xs font-bold text-red-600">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
