
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { systemApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  const { data: systemInfo } = useQuery({
    queryKey: ['systemInfo'],
    queryFn: systemApi.getSystemInfo,
  });
  
  const { data: hardwareStatus } = useQuery({
    queryKey: ['hardwareStatus'],
    queryFn: systemApi.getHardwareStatus,
  });
  
  const { data: healthCheck } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: systemApi.healthCheck,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    defaultValue={user?.full_name || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    defaultValue={user?.username || ''}
                    disabled
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>
                  General system status and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Version</Label>
                  <p className="font-medium">v{systemInfo?.version || 'Loading...'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">System Uptime</Label>
                  <p className="font-medium">{systemInfo?.uptime || 'Loading...'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Started At</Label>
                  <p className="font-medium">{systemInfo?.started_at || 'Loading...'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Health Status</Label>
                  <div className="flex items-center gap-2">
                    <div className={`status-indicator ${healthCheck?.status === 'ok' ? 'status-online' : 'status-offline'}`}></div>
                    <p className="font-medium">{healthCheck?.status === 'ok' ? 'Operational' : 'Issues Detected'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hardware Resources</CardTitle>
                <CardDescription>
                  Current hardware utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>CPU Usage</Label>
                    <span className="text-sm font-medium">{hardwareStatus?.cpu_usage || 0}%</span>
                  </div>
                  <Progress value={hardwareStatus?.cpu_usage || 0} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Memory Usage</Label>
                    <span className="text-sm font-medium">{hardwareStatus?.memory_usage || 0}%</span>
                  </div>
                  <Progress value={hardwareStatus?.memory_usage || 0} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>GPU Usage</Label>
                    <span className="text-sm font-medium">{hardwareStatus?.gpu_usage || 0}%</span>
                  </div>
                  <Progress value={hardwareStatus?.gpu_usage || 0} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Disk Space</Label>
                    <span className="text-sm font-medium">{hardwareStatus?.disk_space || 0}%</span>
                  </div>
                  <Progress value={hardwareStatus?.disk_space || 0} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>
                  Manage system maintenance tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <span>Clear Cache</span>
                    <span className="text-xs text-muted-foreground mt-1">Free up system memory</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <span>Backup Data</span>
                    <span className="text-xs text-muted-foreground mt-1">Create system backup</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <span>Update System</span>
                    <span className="text-xs text-muted-foreground mt-1">Check for updates</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Alert Notifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive alert emails</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive text messages</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Browser notifications</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Webhook Integrations</p>
                      <p className="text-sm text-muted-foreground">Send to external services</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Alert Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-empowerher-danger/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-empowerher-danger">High Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input id="highThreshold" type="number" defaultValue="80" className="w-16 mr-2" />
                          <Label htmlFor="highThreshold">Confidence %</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Alerts above this threshold are marked as high priority
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-empowerher-warning/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-empowerher-warning">Medium Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input id="mediumThreshold" type="number" defaultValue="60" className="w-16 mr-2" />
                          <Label htmlFor="mediumThreshold">Confidence %</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Alerts above this threshold are marked as medium priority
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-empowerher-success/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-empowerher-success">Low Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input id="lowThreshold" type="number" defaultValue="40" className="w-16 mr-2" />
                          <Label htmlFor="lowThreshold">Confidence %</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Alerts above this threshold are marked as low priority
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
