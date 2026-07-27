import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Calendar, Loader2, Sparkles } from "lucide-react";
import BlogImageStudio from "@/components/admin/BlogImageStudio";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  body: string;
  author_name: string | null;
  published: boolean;
  published_at: string | null;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);

type PublishMode = "draft" | "now" | "schedule";

interface Editing {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  body: string;
  cover_image: string | null;
  mode: PublishMode;
  scheduled_for: string; // datetime-local
}

const emptyEditing: Editing = {
  title: "",
  slug: "",
  excerpt: "",
  author_name: "FilmmakerGenius",
  body: "",
  cover_image: null,
  mode: "draft",
  scheduled_for: "",
};

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Editing>(emptyEditing);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  const generateWithAI = async () => {
    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-article", {
        body: aiTopic.trim() ? { topic: aiTopic.trim() } : {},
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const { title, excerpt, body } = data as { title: string; excerpt: string; body: string };
      setEditing((prev) => ({
        ...prev,
        title: title || prev.title,
        slug: title ? slugify(title) : prev.slug,
        excerpt: excerpt || prev.excerpt,
        body: body || prev.body,
      }));
      setSlugTouched(false);
      toast({ title: "Draft generated", description: "Review and edit before publishing." });
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    } finally {
      setAiGenerating(false);
    }
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setPosts((data as BlogPost[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(emptyEditing);
    setSlugTouched(false);
    setAiTopic("");
    setDialogOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || "",
      author_name: p.author_name || "FilmmakerGenius",
      body: p.body,
      cover_image: p.cover_image,
      mode: p.published ? "now" : p.scheduled_for ? "schedule" : "draft",
      scheduled_for: p.scheduled_for ? toLocalDateTime(p.scheduled_for) : "",
    });
    setSlugTouched(true);
    setDialogOpen(true);
  };

  const toLocalDateTime = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const save = async () => {
    if (!editing.title.trim() || !editing.body.trim()) {
      toast({ title: "Title and body are required", variant: "destructive" });
      return;
    }
    const slug = (editing.slug || slugify(editing.title)).trim();
    if (!slug) {
      toast({ title: "Slug is required", variant: "destructive" });
      return;
    }

    const record: any = {
      title: editing.title.trim(),
      slug,
      excerpt: editing.excerpt.trim() || null,
      author_name: editing.author_name.trim() || null,
      body: editing.body,
      cover_image: editing.cover_image,
    };

    if (editing.mode === "now") {
      record.published = true;
      record.published_at = new Date().toISOString();
      record.scheduled_for = null;
    } else if (editing.mode === "schedule") {
      if (!editing.scheduled_for) {
        toast({ title: "Pick a scheduled date/time", variant: "destructive" });
        return;
      }
      const when = new Date(editing.scheduled_for);
      if (when.getTime() <= Date.now()) {
        toast({ title: "Scheduled time must be in the future", variant: "destructive" });
        return;
      }
      record.published = false;
      record.scheduled_for = when.toISOString();
    } else {
      record.published = false;
      record.scheduled_for = null;
    }

    setSaving(true);
    let err: any = null;
    if (editing.id) {
      const { error } = await supabase.from("blog_posts").update(record).eq("id", editing.id);
      err = error;
    } else {
      const { error } = await supabase.from("blog_posts").insert(record);
      err = error;
    }
    setSaving(false);
    if (err) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
      return;
    }
    toast({ title: editing.id ? "Post updated" : "Post created" });
    setDialogOpen(false);
    load();
  };

  const togglePublished = async (p: BlogPost, next: boolean) => {
    const patch: any = { published: next };
    if (next) {
      patch.published_at = p.published_at || new Date().toISOString();
      patch.scheduled_for = null;
    }
    const { error } = await supabase.from("blog_posts").update(patch).eq("id", p.id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      load();
    }
  };

  const publishNow = async (p: BlogPost) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: true,
        published_at: new Date().toISOString(),
        scheduled_for: null,
      })
      .eq("id", p.id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Published" });
      load();
    }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", deleteId);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
    }
    setDeleteId(null);
    load();
  };

  const scheduled = posts.filter((p) => !p.published && p.scheduled_for);
  const nonScheduled = posts.filter((p) => !(!p.published && p.scheduled_for));

  const PostCard = ({ p, showScheduled }: { p: BlogPost; showScheduled?: boolean }) => (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        {p.cover_image && (
          <img
            src={p.cover_image}
            alt=""
            className="w-24 h-16 object-cover rounded border border-border shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{p.title}</h3>
            {p.published ? (
              <Badge className="bg-success/10 text-success" variant="secondary">Published</Badge>
            ) : p.scheduled_for ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(p.scheduled_for).toLocaleString()}
              </Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">/{p.slug}</p>
          {p.excerpt && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.excerpt}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!showScheduled && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-muted-foreground">Published</span>
              <Switch checked={p.published} onCheckedChange={(v) => togglePublished(p, v)} />
            </div>
          )}
          {showScheduled && (
            <Button size="sm" variant="outline" onClick={() => publishNow(p)}>
              Publish now
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setDeleteId(p.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Blog">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Create, schedule, and publish blog posts. Scheduled posts are auto-published every 15 minutes.
          </p>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>

        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts ({nonScheduled.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({scheduled.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-3 pt-4">
            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : nonScheduled.length === 0 ? (
              <Card><CardContent className="p-6 text-center text-muted-foreground">No posts yet.</CardContent></Card>
            ) : (
              nonScheduled.map((p) => <PostCard key={p.id} p={p} />)
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-3 pt-4">
            {scheduled.length === 0 ? (
              <Card><CardContent className="p-6 text-center text-muted-foreground">No scheduled posts.</CardContent></Card>
            ) : (
              scheduled.map((p) => <PostCard key={p.id} p={p} showScheduled />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editing.title}
                onChange={(e) => {
                  const t = e.target.value;
                  setEditing((prev) => ({
                    ...prev,
                    title: t,
                    slug: slugTouched ? prev.slug : slugify(t),
                  }));
                }}
              />
            </div>

            <div>
              <Label>Slug</Label>
              <Input
                value={editing.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setEditing({ ...editing, slug: slugify(e.target.value) });
                }}
              />
            </div>

            <div>
              <Label>Excerpt</Label>
              <Textarea
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <Label>Author name</Label>
              <Input
                value={editing.author_name}
                onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
              />
            </div>

            <BlogImageStudio
              value={editing.cover_image}
              onChange={(url) => setEditing({ ...editing, cover_image: url })}
            />

            <div>
              <Label>Body (Markdown)</Label>
              <Textarea
                value={editing.body}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                rows={16}
                className="font-mono text-sm"
              />
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <Label>Publishing</Label>
              <RadioGroup
                value={editing.mode}
                onValueChange={(v) => setEditing({ ...editing, mode: v as PublishMode })}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="draft" id="mode-draft" />
                  <Label htmlFor="mode-draft" className="font-normal cursor-pointer">Save as draft</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="now" id="mode-now" />
                  <Label htmlFor="mode-now" className="font-normal cursor-pointer">Publish now</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="schedule" id="mode-schedule" />
                  <Label htmlFor="mode-schedule" className="font-normal cursor-pointer">Schedule</Label>
                </div>
              </RadioGroup>
              {editing.mode === "schedule" && (
                <Input
                  type="datetime-local"
                  value={editing.scheduled_for}
                  onChange={(e) => setEditing({ ...editing, scheduled_for: e.target.value })}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing.id ? "Save changes" : "Create post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlog;
