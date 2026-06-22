import { blogPosts } from "@/content/blog";
import type { BlogPost } from "@/types";

/**
 * Data-access layer for blog posts. Reads from local content now; swap the
 * implementation for an API/DB/CMS call later without changing call sites.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return blogPosts.find((post) => post.slug === slug);
}

export async function getBlogPostSlugs(): Promise<string[]> {
  return blogPosts.map((post) => post.slug);
}
