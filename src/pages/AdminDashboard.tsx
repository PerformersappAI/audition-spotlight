import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Film, 
  Trophy, 
  FileText,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalFestivals: 0,
    totalApplications: 0,
    recentUsers: 0,
    activeProjects: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch project count
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Fetch festival count
      const { count: festivalCount } = await supabase
        .from('film_festivals')
        .select('*', { count: 'exact', head: true });

      // Fetch application count
      const { count: applicationCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      // Fetch active projects
      const { count: activeProjectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch recent users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentUserCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        totalUsers: userCount || 0,
        totalProjects: projectCount || 0,
        totalFestivals: festivalCount || 0,
        totalApplications: applicationCount || 0,
        recentUsers: recentUserCount || 0,
        activeProjects: activeProjectCount || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? '...' : value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className={trend === 'up' ? 'text-success' : 'text-muted-foreground'}>
              {trendValue}
            </span>
            {' from last month'}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend="up"
            trendValue={`+${stats.recentUsers} this week`}
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={Film}
            trend="up"
            trendValue={`${stats.totalProjects} total`}
          />
          <StatCard
            title="Film Festivals"
            value={stats.totalFestivals}
            icon={Trophy}
          />
          <StatCard
            title="Applications"
            value={stats.totalApplications}
            icon={FileText}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Users className="w-4 h-4" />
                Manage Users
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Film className="w-4 h-4" />
                Create Project
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Trophy className="w-4 h-4" />
                Add Festival
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="secondary" className="bg-success/10 text-success">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication</span>
                <Badge variant="secondary" className="bg-success/10 text-success">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge variant="secondary" className="bg-success/10 text-success">Online</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• New user registered</p>
                <p>• Project "Film Title" created</p>
                <p>• Festival application submitted</p>
                <p>• User profile updated</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Table */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.totalProjects}</div>
                <div className="text-sm text-muted-foreground">Projects Created</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.totalFestivals}</div>
                <div className="text-sm text-muted-foreground">Festivals Listed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;