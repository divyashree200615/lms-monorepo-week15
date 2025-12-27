"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async () => {
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const userId = data.user?.id;

    await supabase.from("profiles").insert({
      id: userId,
      full_name: fullName,
      role,
    });

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex items-center justify-end pr-6">
        <Image
          src="/banners/signup-left.png"
          alt="Signup Illustration"
          width={920}
          height={1020}
          priority
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-start px-4">
        <div className="w-full max-w-md space-y-5">

          <h1 className="text-3xl font-semibold">
            Sign up with email
          </h1>

          <Input
            placeholder="Full name"
            onChange={(e) => setFullName(e.target.value)}
          />

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

          <select
            className="w-full border rounded-md p-3 text-sm"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" defaultChecked className="mt-1" />
            Send me special offers, personalized recommendations, and learning tips.
          </label>

          {errorMsg && (
            <p className="text-sm text-red-500">{errorMsg}</p>
          )}

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleSignup}
          >
            Continue
          </Button>

          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="flex-1 h-px bg-gray-300" />
            Other sign up options
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* SOCIAL BUTTONS (UI only) */}
          <div className="flex gap-4">
            <button className="flex-1 border rounded-md py-3 font-medium">G</button>
            <button className="flex-1 border rounded-md py-3 font-medium">f</button>
            <button className="flex-1 border rounded-md py-3 font-medium"></button>
          </div>

          <p className="text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <span className="text-purple-600 underline cursor-pointer">
              Terms of Use
            </span>{" "}
            and{" "}
            <span className="text-purple-600 underline cursor-pointer">
              Privacy Policy
            </span>.
          </p>

          <div className="bg-gray-100 text-center py-4 rounded-md text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 font-semibold">
              Log in
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
