import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
}

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, author_name, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (!error && data) setPosts(data as BlogPost[]);
      setLoading(false);
    })();
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <Helmet>
        <title>Filmmaker Genius Blog — Indie Filmmaking Tips, Guides & Industry News</title>
        <meta
          name="description"
          content="Practical guides, playbooks, and industry news for independent filmmakers — from development and production to funding and distribution."
        />
        <link rel="canonical" href="https://filmmakergenius.com/blog" />
        <meta
          property="og:title"
          content="Filmmaker Genius Blog — Indie Filmmaking Tips, Guides & Industry News"
        />
        <meta
          property="og:description"
          content="Practical guides, playbooks, and industry news for independent filmmakers — from development and production to funding and distribution."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://filmmakergenius.com/blog" />
      </Helmet>

      <div
        className="min-h-screen text-white"
        style={{
          backgroundColor: "#0a0a12",
          fontFamily: "'Inter Tight', ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {/* Masthead */}
        <header className="relative overflow-hidden border-b border-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 30%, rgba(0,212,170,0.18) 0%, rgba(0,212,170,0.06) 40%, transparent 70%)",
            }}
          />
          <div className="relative container mx-auto px-4 py-20 md:py-28 text-center max-w-4xl">
            <p
              className="text-xs md:text-sm font-semibold uppercase mb-5"
              style={{ color: "#00d4aa", letterSpacing: "0.28em" }}
            >
              The Filmmaker Genius Blog
            </p>
            <h1
              className="mb-6 leading-[1.05]"
              style={{
                fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                fontSize: "clamp(44px, 8vw, 64px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              The Slate
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Guides, playbooks, and stories for filmmakers running the whole
              production in one place.
            </p>
          </div>
        </header>

        {/* Category pills */}
        <div className="container mx-auto px-4 pt-10 flex justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            <span
              className="px-5 py-2 rounded-full text-sm font-medium border"
              style={{
                backgroundColor: "rgba(0,212,170,0.12)",
                borderColor: "#00d4aa",
                color: "#00d4aa",
              }}
            >
              All Posts
            </span>
          </div>
        </div>

        <main className="container mx-auto px-4 py-14 max-w-6xl">
          {loading ? (
            <p className="text-center text-white/60">Loading…</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <h2
                className="text-3xl mb-3"
                style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
              >
                New articles are on the way.
              </h2>
              <p className="text-white/60">
                Check back soon for guides, playbooks, and stories from the field.
              </p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link
                  to={`/blog/${featured.slug}`}
                  className="group block mb-16 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] hover:border-[#00d4aa] transition-all"
                >
                  <div className="grid md:grid-cols-2">
                    {featured.cover_image ? (
                      <div className="aspect-[16/10] md:aspect-auto md:h-full overflow-hidden bg-black">
                        <img
                          src={featured.cover_image}
                          alt={featured.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] md:aspect-auto md:h-full bg-gradient-to-br from-[#0f1a1a] to-black" />
                    )}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <span
                        className="text-xs font-semibold uppercase mb-4"
                        style={{ color: "#00d4aa", letterSpacing: "0.22em" }}
                      >
                        Featured
                      </span>
                      <h2
                        className="mb-4 leading-tight"
                        style={{
                          fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                          fontSize: "clamp(28px, 3.5vw, 40px)",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-white/70 mb-6 leading-relaxed line-clamp-3">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="text-sm text-white/50 mb-6">
                        {featured.author_name}
                        {featured.author_name && featured.published_at && " · "}
                        {formatDate(featured.published_at)}
                      </div>
                      <span
                        className="text-sm font-semibold inline-flex items-center gap-2"
                        style={{ color: "#00d4aa" }}
                      >
                        Read <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:-translate-y-1 hover:border-[#00d4aa] transition-all duration-300"
                    >
                      {post.cover_image ? (
                        <div className="aspect-video overflow-hidden bg-black">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-[#0f1a1a] to-black" />
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <span
                          className="text-[11px] font-semibold uppercase mb-3"
                          style={{ color: "#00d4aa", letterSpacing: "0.22em" }}
                        >
                          Article
                        </span>
                        <h3
                          className="mb-3 leading-snug"
                          style={{
                            fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                            fontSize: "22px",
                            fontWeight: 500,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-white/65 text-sm leading-relaxed line-clamp-3 mb-5">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-auto text-xs text-white/50">
                          {post.author_name}
                          {post.author_name && post.published_at && " · "}
                          {formatDate(post.published_at)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Blog;
