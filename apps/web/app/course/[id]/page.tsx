"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import CourseReviews from "./_components/CourseReviews";
import jsPDF from "jspdf";

/* ---------------- HELPERS ---------------- */
const formatPrice = (price?: number | null) => {
  if (!price || price === 0) return "FREE";
  return `₹${price.toLocaleString("en-IN")}`;
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const safeText = (value: any) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

export default function StudentCoursePage() {
  const params = useParams();
  const courseId = String(params?.id);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [studentsCount, setStudentsCount] = useState(0);

  const [isPurchased, setIsPurchased] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);

  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const u = auth?.user ?? null;
      setUser(u);

      const { data: c } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      setCourse(c);

      const { data: l } = await supabase
        .from("lessons")
        .select("id, duration")
        .eq("course_id", courseId);
      setLessons(l || []);

      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);

      setStudentsCount(count || 0);

      if (!u) return;

      const { data: enrolled } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", u.id)
        .eq("course_id", courseId)
        .maybeSingle();
      setIsPurchased(!!enrolled);

      if (l && l.length > 0) {
        const { data: completed } = await supabase
          .from("lesson_completions")
          .select("lesson_id")
          .eq("user_id", u.id)
          .in("lesson_id", l.map((x) => x.id));

        if (completed?.length === l.length) {
          setIsCourseCompleted(true);
        }
      }

      const { data: wish } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", u.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (wish) {
        setInWishlist(true);
        setWishlistId(wish.id);
      }
    };

    load();
  }, [courseId]);

  /* ---------------- WISHLIST ---------------- */
  const toggleWishlist = async () => {
    if (!user) return alert("Login first");

    if (inWishlist) {
      await supabase.from("wishlist").delete().eq("id", wishlistId);
      setInWishlist(false);
    } else {
      const { data } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, course_id: courseId })
        .select()
        .single();

      setWishlistId(data.id);
      setInWishlist(true);
    }
  };

  const handleEnroll = async () => {
  // 1️⃣ Not logged in → login
  if (!user) {
    router.push(`/login?redirect=/course/${courseId}`);
    return;
  }

  // 2️⃣ Already enrolled → go to course
  if (isPurchased) {
    router.push(`/learn/${courseId}`);
    return;
  }

  // 3️⃣ Free course → auto-enroll
  if (!course.price || course.price === 0) {
    await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: courseId,
    });

    router.push(`/learn/${courseId}`);
    return;
  }

  // 4️⃣ Paid course → ADD TO CART → checkout
const { error } = await supabase.from("cart_items").insert({
  user_id: user.id,
  course_id: courseId,
});

if (error) {
  console.error("Add to cart failed:", error);
  alert("Failed to add course to cart");
  return;
}

router.push("/checkout");
  }

  /* ---------------- CERTIFICATE ---------------- */
  const downloadCertificate = () => {
    if (!user || !course) return;

    const doc = new jsPDF("landscape", "pt", "a4");

    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 842, 595, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("udemy", 60, 70);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Certificate ID: ${course.id}`, 620, 60);

    doc.setFont("times", "bold");
    doc.setFontSize(34);
    doc.text("Certificate of Completion", 60, 150);

    doc.setFontSize(40);
    doc.text(course.title, 60, 210, { maxWidth: 720 });

    doc.setFontSize(14);
    doc.text(
      `Instructor: ${course.instructor || "Course Instructor"}`,
      60,
      260
    );

    doc.setFontSize(28);
    doc.text(
      safeText(user.user_metadata?.full_name || user.email),
      60,
      360
    );

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toDateString()}`, 60, 420);
    doc.text(`Lessons: ${lessons.length}`, 60, 440);

    doc.save("certificate.pdf");
  };

  if (!course) return <p className="p-6">Loading...</p>;

  const totalDuration = lessons.reduce(
    (sum, l) => sum + (l.duration || 0),
    0
  );

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* HEADER */}
      <div className="bg-black text-white py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold">{course.title}</h1>
          <p className="text-gray-300 mt-3 max-w-3xl">
            {course.description}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              What you'll learn
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li>✔ Understand core concepts</li>
              <li>✔ Build real-world projects</li>
              <li>✔ Gain practical experience</li>
              <li>✔ Improve problem solving</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Requirements
            </h2>
            <ul className="list-disc ml-6">
              <li>Basic computer knowledge</li>
              <li>Willingness to learn</li>
            </ul>
          </section>

          <CourseReviews
            courseId={courseId}
            isPurchased={isPurchased}
          />
        </div>

        {/* RIGHT – UDEMY STYLE CARD */}
        <div className="border rounded-lg p-5 sticky top-24 h-fit bg-white shadow">
          {course.thumbnail_url && (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-44 object-cover rounded mb-4"
            />
          )}

          <div className="flex justify-between items-center mb-2">
            <span className="text-3xl font-bold">
              {formatPrice(course.price)}
            </span>
            <button onClick={toggleWishlist}>
              {inWishlist ? (
                <Heart className="text-red-600" />
              ) : (
                <HeartOff />
              )}
            </button>
          </div>

          <div className="text-sm text-gray-700 mb-4">
            ⭐ {course.rating || "4.6"} (
            {course.reviews_count || "1,240"} ratings) •{" "}
            {studentsCount.toLocaleString()} students
          </div>

          {!isPurchased ? (
            <Button
  className="w-full bg-purple-600 text-white mb-2"
  onClick={handleEnroll}
>
  Enroll Now
</Button>
          ) : (
            <Button className="w-full bg-green-600 text-white mb-2">
              Go to Course
            </Button>
          )}

          <p className="text-xs text-center text-gray-500 mb-4">
            30-Day Money-Back Guarantee
          </p>

          <div className="text-sm space-y-2">
            <p className="font-semibold">This course includes:</p>
            <p>⏱ {formatDuration(totalDuration)} on-demand video</p>
            <p>📄 {lessons.length} lessons</p>
            <p>📱 Access on mobile & TV</p>
            <p>♾ Full lifetime access</p>
            <p>🏆 Certificate of completion</p>
          </div>

          {isPurchased && isCourseCompleted && (
            <div className="mt-5">
              <Button
                className="w-full bg-black text-white"
                onClick={downloadCertificate}
              >
                🎓 Download Certificate
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
