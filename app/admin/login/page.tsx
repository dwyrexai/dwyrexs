"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email veya şifre hatalı");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-lg border border-gray-800 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Giriş</h1>

        {error && (
          <p className="bg-red-900/50 text-red-400 p-3 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}