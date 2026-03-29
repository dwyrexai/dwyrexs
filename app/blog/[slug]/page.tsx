import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Yazı Bulunamadı" };

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
    },
  };
}

export default async function BlogPostPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-fade-in">
        <Link
          href="/blog"
          className="text-blue-500 hover:text-blue-400 mb-8 inline-flex items-center gap-2 transition"
        >
          ← Blog&apos;a dön
        </Link>

        <div className="flex items-center gap-3 mt-6 mb-4">
          <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full capitalize">
            {post.category || "genel"}
          </span>
          <time className="text-sm text-gray-400">
            {new Date(post.created_at).toLocaleDateString("tr-TR")}
          </time>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-10">
          <div className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
}