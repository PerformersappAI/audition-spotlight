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

  return (
    <>
      <Helmet>
        <title>Blog — FilmmakerGenius</title>
        <meta
          name="description"
          content="Guides, playbooks, and behind-the-scenes stories for indie filmmakers running their productions on FilmmakerGenius."
        />
        <link rel="canonical" href="https://filmmakergenius.com/blog" />
        <meta property="og:title" content="Blog — FilmmakerGenius" />
        <meta
          property="og:description"
          content="Guides, playbooks, and behind-the-scenes stories for indie filmmakers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://filmmakergenius.com/blog" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <header className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Playbooks, tools, and stories for indie filmmakers running the whole
              production in one place.
            </p>
          </header>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-border bg-card overflow-hidden hover:border-[#00d4aa] transition-colors"
                >
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-[#00d4aa] transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="text-sm text-muted-foreground">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
