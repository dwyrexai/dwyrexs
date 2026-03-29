"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Dwyrex
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/blog"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
            >
              Blog
            </Link>
            <Link
              href="/hakkimda"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
            >
              Hakkımda
            </Link>
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                Giriş
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col gap-3 animate-fade-in">
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition py-2"
            >
              Blog
            </Link>
            <Link
              href="/hakkimda"
              onClick={() => setMenuOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition py-2"
            >
              Hakkımda
            </Link>
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition py-2"
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-red-400 py-2"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition py-2"
              >
                Giriş
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}