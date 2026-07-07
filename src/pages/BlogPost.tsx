import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  body: string;
  author_name: string | null;
  published_at: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setPost((data as BlogPost) ?? null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-8">
          This post may have been unpublished or moved.
        </p>
        <Button asChild>
          <Link to="/blog">Back to the blog</Link>
        </Button>
      </div>
    );
  }

  const canonical = `https://filmmakergenius.com/blog/${post.slug}`;
  const description = post.excerpt ?? post.title;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: post.author_name ?? "FilmmakerGenius" },
    image: post.cover_image ?? undefined,
    mainEntityOfPage: canonical,
    description,
  };

  return (
    <>
      <Helmet>
        <title>{`${post.title} — FilmmakerGenius`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.title} — FilmmakerGenius`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <Link
            to="/blog"
            className="text-sm text-[#00d4aa] hover:underline mb-6 inline-block"
          >
            ← All posts
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="text-sm text-muted-foreground mb-8">
            {post.author_name}
            {post.published_at && (
              <>
                {" · "}
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </>
            )}
          </div>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full rounded-xl mb-10"
            />
          )}

          <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-p:text-foreground/90 prose-p:leading-relaxed prose-li:text-foreground/90 prose-a:text-[#00d4aa] prose-strong:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>

          <div className="mt-16 p-8 rounded-xl border border-[#00d4aa]/30 bg-[#00d4aa]/5 text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Ready to run your production in one place?
            </h2>
            <p className="text-muted-foreground mb-6">
              Upload your script and get storyboards, table reads, crew, contracts,
              and casting — all connected.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#00d4aa] hover:bg-[#00d4aa]/90 text-black font-semibold"
            >
              <Link to="/membership">Start your production free</Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
