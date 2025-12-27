'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

/* ---------------- HELPERS ---------------- */
const formatPrice = (price: number) =>
  price === 0 ? "FREE" : `₹${price.toLocaleString("en-IN")}`;

/* ---------------- COMPONENT ---------------- */
export default function CartPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  /* ---------------- LOAD CART ---------------- */
  useEffect(() => {
    const loadCart = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;

      if (!uid) {
        setLoading(false);
        return;
      }

      setUserId(uid);

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          courses (
            id,
            title,
            price,
            thumbnail_url
          )
        `)
        .eq("user_id", uid);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setItems(data || []);

      const totalPrice =
        data?.reduce((sum: number, item: any) => {
          return sum + (item.courses?.price || 0);
        }, 0) || 0;

      setTotal(totalPrice);
      setLoading(false);
    };

    loadCart();
  }, []);

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = async (cartItemId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId);

    const updated = items.filter((i) => i.id !== cartItemId);
    setItems(updated);

    const newTotal = updated.reduce(
      (sum, i) => sum + (i.courses?.price || 0),
      0
    );
    setTotal(newTotal);
  };

  if (loading) return <p className="p-6">Loading cart...</p>;

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT - CART ITEMS */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6">
          Shopping Cart ({items.length} courses)
        </h1>

        {items.length === 0 ? (
          <div className="border rounded p-6 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <Link href="/courses" className="text-blue-600 underline">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border rounded p-4 items-center"
              >
                <img
                  src={item.courses.thumbnail_url}
                  className="w-28 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.courses.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.courses.price)}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT - SUMMARY */}
      <div className="border rounded-lg p-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-4">Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Total:</span>
          <span className="text-xl font-bold">
            {formatPrice(total)}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          By completing your purchase you agree to our terms.
        </p>

        <Button
          className="w-full bg-purple-600 text-white"
          disabled={items.length === 0}
          asChild
        >
          <Link href="/checkout">
            Proceed to Checkout
          </Link>
        </Button>
      </div>
    </div>
  );
}
