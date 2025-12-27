"use client";

import { Star } from "lucide-react";
import Link from "next/link";

export default function CourseCard({ course }) {
  return (
    <Link href={`/course/${course.id}`} className="group cursor-pointer block">
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded mb-2">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Bestseller badge */}
        {course.is_bestseller && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            Bestseller
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-base mb-1 line-clamp-2">{course.title}</h3>

      {/* Instructor */}
      <p className="text-sm text-gray-600 mb-1">{course.instructor || "Instructor"}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-1">
        <span className="font-bold text-sm">{course.rating || "4.7"}</span>

        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(course.rating || 4.7)
                  ? "fill-orange-400 text-orange-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <span className="text-xs text-gray-600">
          ({course.reviews_count?.toLocaleString() || "10,000"})
        </span>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">₹{course.price || 499}</span>
        <span className="text-sm text-gray-500 line-through">
          ₹{course.original_price || 3499}
        </span>
      </div>
    </Link>
  );
}
