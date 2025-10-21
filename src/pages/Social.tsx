import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SocialFeed } from '@/components/SocialFeed';
import { Notifications } from '@/components/Notifications';
import { DatabaseTest } from '@/components/DatabaseTest';
import { 
  MessageSquare, 
  Bell, 
  Users, 
  TrendingUp,
  Film,
  Trophy,
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export default function Social() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalFollowers: 0,
    totalFollowing: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch user's post count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch user's total likes received
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .in('post_id', 
          await supabase
            .from('posts')
            .select('id')
            .eq('user_id', user.id)
            .then(({ data }) => data?.map(p => p.id) || [])
        );

      // Fetch follower count
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

      // Fetch following count
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id);

      setStats({
        totalPosts: postsCount || 0,
        totalLikes: likesCount || 0,
        totalFollowers: followersCount || 0,
        totalFollowing: followingCount || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Join the Community</h2>
            <p className="text-muted-foreground mb-4">
              Sign in to connect with other filmmakers, share your work, and discover new opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Community</h1>
          <p className="text-muted-foreground text-lg">
            Connect, share, and collaborate with filmmakers worldwide
          </p>
        </div>

        {/* User Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Your Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalPosts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{stats.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Likes Received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.totalFollowers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.totalFollowing}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Test - Temporary */}
        <DatabaseTest />

        {/* Main Content */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Feed</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <SocialFeed />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Notifications />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <Film className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Share a Project</h3>
                  <p className="text-sm text-muted-foreground">Post about your latest film project</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold">Festival Update</h3>
                  <p className="text-sm text-muted-foreground">Share festival news or submissions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="font-semibold">Behind the Scenes</h3>
                  <p className="text-sm text-muted-foreground">Share photos from your set</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
