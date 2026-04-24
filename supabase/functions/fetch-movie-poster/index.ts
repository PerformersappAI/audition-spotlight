import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, year } = await req.json();
    if (!title || typeof title !== "string") {
      return new Response(
        JSON.stringify({ error: "title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY");
    if (!TMDB_API_KEY) {
      return new Response(
        JSON.stringify({ error: "TMDB_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: title,
      include_adult: "false",
    });
    if (year) params.set("year", String(year));

    // Search both movies and TV
    const [movieRes, tvRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/movie?${params.toString()}`),
      fetch(`https://api.themoviedb.org/3/search/tv?${new URLSearchParams({
        api_key: TMDB_API_KEY,
        query: title,
        include_adult: "false",
        ...(year ? { first_air_date_year: String(year) } : {}),
      }).toString()}`),
    ]);

    const movieJson = movieRes.ok ? await movieRes.json() : { results: [] };
    const tvJson = tvRes.ok ? await tvRes.json() : { results: [] };

    type Hit = { poster_path?: string; release_date?: string; first_air_date?: string; title?: string; name?: string; vote_count?: number };
    const all: Hit[] = [
      ...(movieJson.results || []),
      ...(tvJson.results || []),
    ].filter((r: Hit) => r.poster_path);

    if (!all.length) {
      return new Response(
        JSON.stringify({ posterUrl: null, year: null, matchedTitle: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Prefer most popular (highest vote_count)
    all.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    const best = all[0];
    const matchedYear = (best.release_date || best.first_air_date || "").slice(0, 4) || null;

    return new Response(
      JSON.stringify({
        posterUrl: `${TMDB_IMG}${best.poster_path}`,
        year: matchedYear,
        matchedTitle: best.title || best.name || title,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("fetch-movie-poster error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
