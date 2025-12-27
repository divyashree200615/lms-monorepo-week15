"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex items-center justify-end pr-6">
        <Image
          src="/banners/signup-left.png"
          alt="Login Illustration"
          width={920}
          height={1020}
          priority
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-start px-4">
        <div className="w-full max-w-md space-y-5">

          <h1 className="text-3xl font-semibold">
            Log in to your account
          </h1>

          <Input
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && (
            <p className="text-sm text-red-500">{errorMsg}</p>
          )}

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleLogin}
          >
            Log in
          </Button>

          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="flex-1 h-px bg-gray-300" />
            Other login options
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* SOCIAL BUTTONS (UI only) */}
          <div className="flex gap-4">
            <button className="flex-1 border rounded-md py-3 font-medium">G</button>
            <button className="flex-1 border rounded-md py-3 font-medium">f</button>
            <button className="flex-1 border rounded-md py-3 font-medium"></button>
          </div>

          <p className="text-xs text-gray-500">
            By logging in, you agree to our{" "}
            <span className="text-purple-600 underline cursor-pointer">
              Terms of Use
            </span>{" "}
            and{" "}
            <span className="text-purple-600 underline cursor-pointer">
              Privacy Policy
            </span>.
          </p>

          <div className="bg-gray-100 text-center py-4 rounded-md text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-purple-600 font-semibold">
              Sign up
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
