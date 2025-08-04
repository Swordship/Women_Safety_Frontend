
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, alertsApi } from '@/lib/api';
import { CardWithMetric } from '@/components/ui/card-with-metric';
import { AlertItem } from '@/components/ui/alert-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Users, Bell, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: dashboardApi.getMetrics,
  });

  const { data: safetyStats, isLoading: safetyStatsLoading } = useQuery({
    queryKey: ['safetyStats'],
    queryFn: dashboardApi.getSafetyStats,
  });

  const { data: genderDistribution, isLoading: genderDistributionLoading } = useQuery({
    queryKey: ['genderDistribution'],
    queryFn: dashboardApi.getGenderDistribution,
  });

  const { data: recentAlerts, isLoading: recentAlertsLoading } = useQuery({
    queryKey: ['recentAlerts'],
    queryFn: () => alertsApi.getRecentAlerts(5),
  });

  // Data for gender distribution chart
  const genderChartData = React.useMemo(() => {
    if (!genderDistribution) return [];
    return [
      { name: 'Women', value: genderDistribution.women },
      { name: 'Men', value: genderDistribution.men },
    ];
  }, [genderDistribution]);

  const GENDER_COLORS = ['#EC4899', '#8B5CF6']; // Pink for women, Purple for men

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <CardWithMetric
          title="Cameras Monitored"
          value={metrics?.totalCameras ?? 0}
          icon={<Camera className="h-5 w-5" />}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
          valueClassName="text-blue-600 dark:text-blue-400"
        />
        <CardWithMetric
          title="Women Monitored"
          value={metrics?.womenMonitored ?? 0 }
          icon={<Users className="h-5 w-5" />}
          className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900"
          valueClassName="text-pink-600 dark:text-pink-400"
        />
        <CardWithMetric
          title="Alerts Today"
          value={metrics?.alertsToday ?? 0}
          icon={<Bell className="h-5 w-5" />}
          className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900"
          valueClassName="text-amber-600 dark:text-amber-400"
          trend={{ value: 12, isPositive: false }}
        />
        <CardWithMetric
          title="Hotspot Areas"
          value={metrics?.hotspotAreas ?? 0}
          icon={<MapPin className="h-5 w-5" />}
          className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
          valueClassName="text-red-600 dark:text-red-400"
          trend={{ value: 5, isPositive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gender Distribution Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            {genderDistributionLoading ? (
              <div className="text-center text-muted-foreground">Loading data...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Safety Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Safety Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {safetyStatsLoading ? (
              <div className="text-center text-muted-foreground">Loading data...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Lone Women</h3>
                  <p className="text-2xl font-bold">{safetyStats?.loneWomen ?? 0}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Women Surrounded</h3>
                  <p className="text-2xl font-bold">{safetyStats?.surrounded ?? 0}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">SOS Gestures</h3>
                  <p className="text-2xl font-bold">{safetyStats?.sosGestures ?? 0}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">Safe Interactions</h3>
                  <p className="text-2xl font-bold">{Math.round((safetyStats?.safeInteractions ?? 0) * 100)}%</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAlertsLoading ? (
            <div className="text-center text-muted-foreground py-4">Loading alerts...</div>
          ) : recentAlerts && recentAlerts.length > 0 ? (
            <div>
              {recentAlerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">No recent alerts</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
