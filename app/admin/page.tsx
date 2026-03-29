"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  published: boolean;
  created_at: string;
};

const CATEGORIES = ["genel", "teknoloji", "yazilim", "tasarim", "gunluk"];

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("genel");
  const [editingId, setEditingId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/admin/login");
        return;
      }

      setUser(data.user);

      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      setPosts((postsData as Post[]) ?? []);
      setLoading(false);
    };

    checkUserAndFetch();
  }, [router]);

  const refreshPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setCategory("genel");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const postData = {
      title,
      slug: slugify(title),
      content,
      excerpt,
      category,
      published: false,
    };

    if (editingId) {
      await supabase.from("posts").update(postData).eq("id", editingId);
    } else {
      await supabase.from("posts").insert(postData);
    }

    resetForm();
    refreshPosts();
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt ?? "");
    setCategory(post.category ?? "genel");
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const ok = confirm("Bu yazıyı silmek istediğinize emin misiniz?");
    if (!ok) return;
    await supabase.from("posts").delete().eq("id", id);
    refreshPosts();
  };

  const togglePublish = async (id: number, current: boolean) => {
    await supabase.from("posts").update({ published: !current }).eq("id", id);
    refreshPosts();
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <button
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white transition hover:from-blue-700 hover:to-purple-700"
        >
          {showForm ? "İptal" : "Yeni Yazı"}
        </button>
      </div>

      {/* İstatistik - Sadece yazılar */}
      <div className="mb-8 rounded-xl bg-gray-100 p-4 dark:bg-gray-800 inline-block">
        <div className="text-2xl font-bold">{posts.length}</div>
        <div className="text-sm text-gray-500">Toplam Yazı</div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/60">
          <h2 className="mb-6 text-xl font-semibold">{editingId ? "Yazıyı Düzenle" : "Yeni Yazı Ekle"}</h2>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-500">Başlık</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800" 
              required 
            />
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-500">Özet</label>
              <input 
                type="text" 
                value={excerpt} 
                onChange={(e) => setExcerpt(e.target.value)} 
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800" 
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-500">Kategori</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
              >
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm text-gray-500">İçerik</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              rows={12} 
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="rounded-xl bg-green-600 px-8 py-3 text-white transition hover:bg-green-700"
          >
            {editingId ? "Güncelle" : "Kaydet"}
          </button>
        </form>
      )}

      {/* Blog Posts Listesi */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p className="py-12 text-center text-gray-500">Henüz yazı yok.</p>
        ) : (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/60"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      post.published 
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {post.published ? "Yayında" : "Taslak"}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {post.category || "genel"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => togglePublish(post.id, post.published)} 
                    className="rounded-lg bg-gray-200 px-3 py-2 text-sm transition hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {post.published ? "Gizle" : "Yayınla"}
                  </button>
                  <button 
                    onClick={() => handleEdit(post)} 
                    className="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)} 
                    className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}