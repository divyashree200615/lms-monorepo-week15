"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  Search,
  Globe,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export default function UdemyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Categories list
  const categories = [
    "Development",
    "Business",
    "Finance & Accounting",
    "IT & Software",
    "Design",
    "Marketing",
    "Lifestyle",
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        setProfile(prof);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="border-b sticky top-0 bg-white z-50 shadow-sm">
      <div className="max-w-[1340px] mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo + Categories */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-3xl font-bold text-purple-700">
              Udemy
            </Link>

            {/* Categories Dropdown */}
            <div className="hidden lg:block relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-purple-700 transition">
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-4 w-[260px] bg-white border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {categories.map((cat) => (
                    <a
                      key={cat}
                      href="#"
                      className="block px-4 py-2 text-sm hover:text-purple-700 hover:bg-gray-50 transition"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-[750px] mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for anything"
                className="w-full pl-12 pr-4 py-3 border border-gray-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Right NAV */}
          <div className="flex items-center gap-4">
            <Link
              href="/courses"
              className="hidden xl:block text-sm font-medium hover:text-purple-700 transition"
            >
              Courses
            </Link>

            {/* IF USER IS LOGGED IN */}
            {user && profile ? (
              <>
                {/* Student */}
                {profile.role === "student" && (
                  <>
                    <Link
                      href="/my-learning"
                      className="hidden xl:block text-sm font-medium hover:text-purple-700 transition"
                    >
                      My Learning
                    </Link>

                    <Link
                      href="/wishlist"
                      className="hidden xl:block text-sm font-medium hover:text-purple-700 transition"
                    >
                      Wishlist
                    </Link>
                  </>
                )}

                {/* Instructor */}
                {profile.role === "instructor" && (
                  <Link
                    href="/instructor/dashboard"
                    className="hidden xl:block text-sm font-medium hover:text-purple-700 transition"
                  >
                    Instructor Dashboard
                  </Link>
                )}

                {/* Avatar Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="cursor-pointer">
                      <AvatarFallback>
                        {profile.full_name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* IF NOT LOGGED IN */}
                <Link
                  href="/login"
                  className="hidden lg:block px-4 py-2 border border-gray-900 font-bold text-sm hover:bg-gray-100 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="hidden lg:block px-4 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition"
                >
                  Sign up
                </Link>
              </>
            )}

            <button className="hidden lg:block p-2 border border-gray-900 hover:bg-gray-100 rounded transition">
              <Globe className="w-5 h-5" />
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-6 py-4 space-y-4">
            <input
              type="text"
              placeholder="Search for anything"
              className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {!user ? (
              <>
                <Link href="/login" className="block py-2 text-sm font-medium">
                  Log in
                </Link>
                <Link href="/signup" className="block py-2 text-sm font-medium">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                {profile.role === "student" && (
                  <>
                    <Link
                      href="/my-learning"
                      className="block py-2 text-sm font-medium"
                    >
                      My Learning
                    </Link>

                    <Link
                      href="/wishlist"
                      className="block py-2 text-sm font-medium"
                    >
                      Wishlist
                    </Link>
                  </>
                )}

                {profile.role === "instructor" && (
                  <Link
                    href="/instructor/dashboard"
                    className="block py-2 text-sm font-medium"
                  >
                    Instructor Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block py-2 text-sm font-medium text-left w-full"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
