"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [otherCourses, setOtherCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        router.push("/login");
        return;
      }

      setUser(auth.user);

      // Cart items
      const { data: cart } = await supabase
        .from("cart_items")
        .select("id, course_id, courses(*)")
        .eq("user_id", auth.user.id);

      setCartItems(cart || []);

      // Other courses (for add more)
      const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .limit(6);

      setOtherCourses(courses || []);
    };

    load();
  }, [router]);

  /* ---------------- TOTAL ---------------- */
  const total = cartItems.reduce(
    (sum, i) => sum + (i.courses.price || 0),
    0
  );

  /* ---------------- REMOVE FROM CART ---------------- */
  const removeFromCart = async (cartId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartId);

    setCartItems((prev) => prev.filter((c) => c.id !== cartId));
  };

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (course: any) => {
    const exists = cartItems.some(
      (c) => c.course_id === course.id
    );
    if (exists) return;

    const { data } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        course_id: course.id,
      })
      .select("id, course_id, courses(*)")
      .single();

    if (data) {
      setCartItems((prev) => [...prev, data]);
    }
  };

  /* ---------------- CHECKOUT ---------------- */
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);

    // Create enrollments
    const enrollments = cartItems.map((item) => ({
      user_id: user.id,
      course_id: item.course_id,
    }));

    await supabase.from("enrollments").insert(enrollments);

    // Clear cart
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    router.push("/my-learning");
  };

  /* ---------------- EMPTY CART ---------------- */
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT – CART */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border rounded p-4 bg-white"
            >
              <img
                src={item.courses.thumbnail_url}
                alt={item.courses.title}
                className="w-32 h-20 rounded object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold">
                  {item.courses.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.courses.instructor}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  ₹{item.courses.price}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm text-red-600 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD MORE COURSES */}
        <h2 className="text-xl font-bold mt-10 mb-4">
          You might also like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherCourses.map((course) => (
            <div
              key={course.id}
              className="border rounded p-3 flex gap-3 bg-white"
            >
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-24 h-16 rounded object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {course.instructor}
                </p>

                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-sm">
                    ₹{course.price}
                  </span>
                  <button
                    onClick={() => addToCart(course)}
                    className="text-purple-600 text-sm font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT – SUMMARY */}
      <div className="border rounded p-5 h-fit sticky top-24 bg-white shadow">
        <h2 className="text-xl font-bold mb-4">
          Order Summary
        </h2>

        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span className="font-bold">₹{total}</span>
        </div>

        <Button
          className="w-full bg-purple-600 text-white mt-4"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Complete Checkout"}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-3">
          30-Day Money-Back Guarantee
        </p>
      </div>
    </div>
  );
}
