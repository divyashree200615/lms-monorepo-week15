"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseReviewsProps {
  courseId: string;
  isPurchased: boolean;
}

export default function CourseReviews({
  courseId,
  isPurchased,
}: CourseReviewsProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [avgRating, setAvgRating] = useState(0);
  const [sort, setSort] = useState<"recent" | "helpful">("recent");

  /* ---------------- LOAD REVIEWS ---------------- */
  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      setCurrentUser(auth?.user ?? null);

      const { data } = await supabase
        .from("course_reviews")
        .select("*")
        .eq("course_id", courseId);

      const sorted =
        sort === "helpful"
          ? [...(data || [])].sort((a, b) => b.helpful - a.helpful)
          : [...(data || [])].sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );

      setReviews(sorted);

      if (data && data.length > 0) {
        const avg =
          data.reduce((s, r) => s + r.rating, 0) / data.length;
        setAvgRating(Number(avg.toFixed(1)));
      }

      if (auth?.user) {
        const my = data?.find((r) => r.user_id === auth.user.id);
        if (my) {
          setExistingReviewId(my.id);
          setRating(my.rating);
          setReviewText(my.review || "");
        }
      }
    };

    load();
  }, [courseId, sort]);

  /* ---------------- RATING BREAKDOWN ---------------- */
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (s) => reviews.filter((r) => r.rating === s).length
  );
  const percent = (c: number) =>
    totalReviews === 0 ? 0 : Math.round((c / totalReviews) * 100);

  /* ---------------- SUBMIT / UPDATE ---------------- */
  const submitReview = async () => {
    if (!currentUser) return alert("Login required");
    if (!isPurchased) return alert("Enroll to review");
    if (rating === 0) return alert("Select rating");

    if (existingReviewId) {
      await supabase
        .from("course_reviews")
        .update({ rating, review: reviewText })
        .eq("id", existingReviewId);
    } else {
      await supabase.from("course_reviews").insert({
        course_id: courseId,
        user_id: currentUser.id,
        rating,
        review: reviewText,
        helpful: 0,
      });
    }

    window.location.reload();
  };

  /* ---------------- DELETE ---------------- */
  const deleteReview = async () => {
    if (!existingReviewId) return;
    await supabase.from("course_reviews").delete().eq("id", existingReviewId);
    window.location.reload();
  };

  /* ---------------- HELPFUL ---------------- */
  const markHelpful = async (id: string, count: number) => {
    await supabase
      .from("course_reviews")
      .update({ helpful: count + 1 })
      .eq("id", id);
    window.location.reload();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="border-t pt-10">
      <h2 className="text-2xl font-bold mb-6">⭐ Student Reviews</h2>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="text-center border rounded p-6">
          <div className="text-5xl font-bold">{avgRating}</div>
          <div className="text-yellow-400 text-xl">
            {"★".repeat(Math.round(avgRating))}
            {"☆".repeat(5 - Math.round(avgRating))}
          </div>
          <p className="text-gray-500 text-sm">
            {totalReviews} reviews
          </p>
        </div>

        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-12">{s} ★</span>
              <div className="flex-1 bg-gray-200 h-3 rounded">
                <div
                  className="bg-yellow-400 h-3 rounded"
                  style={{ width: `${percent(ratingCounts[i])}%` }}
                />
              </div>
              <span className="w-12 text-sm">{percent(ratingCounts[i])}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* SORT */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={sort === "recent" ? "default" : "outline"}
          onClick={() => setSort("recent")}
        >
          Recent
        </Button>
        <Button
          variant={sort === "helpful" ? "default" : "outline"}
          onClick={() => setSort("helpful")}
        >
          Most Helpful
        </Button>
      </div>

      {/* WRITE REVIEW */}
      {currentUser && isPurchased && (
        <div className="bg-gray-50 border rounded p-5 mb-10">
          <h3 className="font-semibold mb-3">
            {existingReviewId ? "Edit your review" : "Write a review"}
          </h3>

          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={28}
                className={`cursor-pointer ${
                  (hover || rating) >= i
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
              />
            ))}
          </div>

          <textarea
            className="w-full border rounded p-3 mb-3"
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <div className="flex gap-3">
            <Button onClick={submitReview}>
              {existingReviewId ? "Update" : "Submit"}
            </Button>
            {existingReviewId && (
              <Button variant="destructive" onClick={deleteReview}>
                Delete
              </Button>
            )}
          </div>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="text-yellow-400">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(r.created_at).toDateString()}
              </span>
            </div>

            {r.review && (
              <p className="text-gray-700 mt-2">{r.review}</p>
            )}

            <div className="flex items-center gap-4 mt-3 text-sm">
              <button
                className="flex items-center gap-1 text-gray-600"
                onClick={() => markHelpful(r.id, r.helpful)}
              >
                <ThumbsUp size={16} /> Helpful ({r.helpful})
              </button>

              {r.is_instructor && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                  Instructor
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
