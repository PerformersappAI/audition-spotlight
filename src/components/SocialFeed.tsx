import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  Image as ImageIcon,
  Video,
  Film,
  Trophy,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  media_urls: string[] | null;
  post_type: string;
  project_id: string | null;
  festival_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    role: string;
  };
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_following: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
  };
}

export const SocialFeed = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [showComments, setShowComments] = useState<{ [postId: string]: boolean }>({});
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('fetchPosts: Starting to fetch posts');
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            company_name,
            role
          ),
          likes_count:likes(count),
          comments_count:comments(count),
          is_liked:likes!inner(user_id)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('fetchPosts: Error fetching posts', error);
        throw error;
      }

      console.log('fetchPosts: Raw data received', data);

      // Process the data to handle the aggregated counts and likes
      const processedPosts = data?.map(post => ({
        ...post,
        likes_count: post.likes_count?.[0]?.count || 0,
        comments_count: post.comments_count?.[0]?.count || 0,
        is_liked: post.is_liked?.length > 0,
        is_following: false // Will be updated below if user is logged in
      })) || [];

      // Check follow status for each post if user is logged in
      if (user) {
        console.log('fetchPosts: Checking follow status for user', user.id);
        
        // Get all unique user IDs from posts
        const uniqueUserIds = [...new Set(processedPosts.map(post => post.user_id))];
        
        // Fetch follow relationships using user IDs directly
        const { data: follows } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id)
          .in('following_id', uniqueUserIds);

        const followingIds = new Set(follows?.map(f => f.following_id) || []);
        
        // Update posts with follow status
        processedPosts.forEach(post => {
          post.is_following = followingIds.has(post.user_id);
        });
      }

      console.log('fetchPosts: Processed posts', processedPosts);
      setPosts(processedPosts);
    } catch (error) {
      console.error('fetchPosts: Complete error', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load posts"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!user || !newPostContent.trim()) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPostContent,
          post_type: 'text',
          is_public: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully"
      });

      setNewPostContent('');
      fetchPosts(); // Refresh the feed
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post"
      });
    }
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) {
      console.error('toggleLike: No user found');
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to like posts"
      });
      return;
    }

    const actionKey = `like-${postId}`;
    setActionLoading(prev => ({ ...prev, [actionKey]: true }));

    console.log('toggleLike: Starting', { postId, isLiked, userId: user.id });

    try {
      if (isLiked) {
        // Unlike
        console.log('toggleLike: Unliking post', { postId, userId: user.id });
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          console.error('toggleLike: Unlike error', error);
          throw error;
        }
        console.log('toggleLike: Successfully unliked post');
      } else {
        // Like - Check if already liked first
        console.log('toggleLike: Checking if already liked', { postId, userId: user.id });
        
        // First check if the user has already liked this post
        const { data: existingLike, error: checkError } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
          console.error('toggleLike: Error checking existing like', checkError);
          throw checkError;
        }

        if (existingLike) {
          console.log('toggleLike: Post already liked, switching to unlike');
          // Post is already liked, so unlike it instead
          const { error: unlikeError } = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (unlikeError) {
            console.error('toggleLike: Unlike error after check', unlikeError);
            throw unlikeError;
          }
          console.log('toggleLike: Successfully unliked post after check');
        } else {
          // Post is not liked, so like it
          console.log('toggleLike: Liking post', { postId, userId: user.id });
          const { error } = await supabase
            .from('likes')
            .insert({
              post_id: postId,
              user_id: user.id
            });

          if (error) {
            console.error('toggleLike: Like error', error);
            throw error;
          }
          console.log('toggleLike: Successfully liked post');
        }
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !isLiked,
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));

      toast({
        title: "Success",
        description: isLiked ? "Post unliked" : "Post liked"
      });
    } catch (error) {
      console.error('toggleLike: Complete error', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isLiked ? 'unlike' : 'like'} post: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const toggleFollow = async (userId: string, isFollowing: boolean) => {
    if (!user) {
      console.error('toggleFollow: No user found');
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to follow users"
      });
      return;
    }

    if (userId === user.id) {
      console.error('toggleFollow: Cannot follow yourself');
      toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot follow yourself"
      });
      return;
    }

    const actionKey = `follow-${userId}`;
    setActionLoading(prev => ({ ...prev, [actionKey]: true }));

    console.log('toggleFollow: Starting', { 
      isFollowing, 
      currentUserId: user.id,
      targetUserId: userId
    });

    try {
      if (isFollowing) {
        // Unfollow
        console.log('toggleFollow: Unfollowing user', { currentUserId: user.id, targetUserId: userId });
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);

        if (error) {
          console.error('toggleFollow: Unfollow error', error);
          throw error;
        }
        console.log('toggleFollow: Successfully unfollowed user');
      } else {
        // Follow
        console.log('toggleFollow: Following user', { currentUserId: user.id, targetUserId: userId });
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });

        if (error) {
          console.error('toggleFollow: Follow error', error);
          throw error;
        }
        console.log('toggleFollow: Successfully followed user');
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.user_id === userId 
          ? { ...post, is_following: !isFollowing }
          : post
      ));

      toast({
        title: "Success",
        description: isFollowing ? "Unfollowed user" : "Following user"
      });
    } catch (error) {
      console.error('toggleFollow: Complete error', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isFollowing ? 'unfollow' : 'follow'} user: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            company_name
          )
        `)
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(prev => ({
        ...prev,
        [postId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async (postId: string) => {
    if (!user) {
      console.error('addComment: No user found');
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to comment"
      });
      return;
    }

    const commentText = newComment[postId]?.trim();
    if (!commentText) {
      console.error('addComment: No comment text');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a comment"
      });
      return;
    }

    const actionKey = `comment-${postId}`;
    setActionLoading(prev => ({ ...prev, [actionKey]: true }));

    console.log('addComment: Starting', { postId, userId: user.id, commentText });

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: commentText
        });

      if (error) {
        console.error('addComment: Insert error', error);
        throw error;
      }

      console.log('addComment: Successfully added comment');

      setNewComment(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
      
      // Update comment count
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ));

      toast({
        title: "Success",
        description: "Comment added successfully"
      });
    } catch (error) {
      console.error('addComment: Complete error', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    if (!showComments[postId] && !comments[postId]) {
      fetchComments(postId);
    }
  };

  const getPostTypeIcon = (postType: string) => {
    switch (postType) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'project_share': return <Film className="h-4 w-4" />;
      case 'festival_share': return <Trophy className="h-4 w-4" />;
      default: return null;
    }
  };

  const getUserDisplayName = (profile: any) => {
    if (profile.company_name) {
      return profile.company_name;
    }
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      {user && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Textarea
                placeholder="What's happening in your filmmaking world?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                </div>
                <Button 
                  onClick={createPost}
                  disabled={!newPostContent.trim()}
                  size="sm"
                >
                  Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {getUserDisplayName(post.profiles).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">
                      {getUserDisplayName(post.profiles)}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {post.profiles.role}
                    </Badge>
                    {getPostTypeIcon(post.post_type)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user && user.id !== post.user_id && (
                  <Button
                    variant={post.is_following ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleFollow(post.user_id, post.is_following)}
                    disabled={actionLoading[`follow-${post.user_id}`]}
                  >
                    {actionLoading[`follow-${post.user_id}`] ? (
                      "..."
                    ) : post.is_following ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="whitespace-pre-wrap">{post.content}</p>
              
              {/* Media */}
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.media_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="rounded-lg object-cover h-48 w-full"
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id, post.is_liked)}
                    disabled={actionLoading[`like-${post.id}`]}
                    className={post.is_liked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${post.is_liked ? "fill-current" : ""}`} />
                    {actionLoading[`like-${post.id}`] ? "..." : post.likes_count}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments_count}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="space-y-4 pt-4 border-t">
                  {/* Add Comment */}
                  {user && (
                    <div className="flex space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {userProfile?.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="min-h-[60px] resize-none"
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => addComment(post.id)}
                            disabled={!newComment[post.id]?.trim() || actionLoading[`comment-${post.id}`]}
                          >
                            {actionLoading[`comment-${post.id}`] ? "Posting..." : "Comment"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments List */}
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getUserDisplayName(comment.profiles).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {getUserDisplayName(comment.profiles)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {posts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
