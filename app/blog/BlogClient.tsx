"use client";

import Link from "next/link";
import { useState } from "react";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  created_at: string;
}

export default function BlogClient({
  posts,
  categories,
}: {
  posts: Post[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("hepsi");

  const filtered = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "hepsi" ||
      (post.category || "genel") === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-6 animate-fade-in stagger-1">
        <input
          type="text"
          placeholder="Yazılarda ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8 animate-fade-in stagger-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">
          {search ? "Aramanızla eşleşen yazı bulunamadı." : "Henüz blog yazısı yok."}
        </p>
      ) : (
        <div className="grid gap-6">
          {filtered.map((post, i) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article
                className={`bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 animate-fade-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full capitalize">
                    {post.category || "genel"}
                  </span>
                  <time className="text-sm text-gray-400">
                    {new Date(post.created_at).toLocaleDateString("tr-TR")}
                  </time>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-500 dark:text-gray-400">
                    {post.excerpt}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}