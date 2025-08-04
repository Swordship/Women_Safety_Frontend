import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '@/lib/api';
import { Alert, AlertPriority, AlertStatus, AlertType } from '@/types/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Hand, Users, PersonStanding, Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const AlertsPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAlertDetailOpen, setIsAlertDetailOpen] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ['alerts', page, limit],
    queryFn: () => alertsApi.getAlerts(page, limit),
  });

  const getAlertTypeIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.SOS:
        return <Hand className="h-4 w-4" />;
      case AlertType.SURROUNDED:
        return <Users className="h-4 w-4" />;
      case AlertType.ISOLATED:
        return <PersonStanding className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case AlertPriority.HIGH:
        return "bg-empowerher-danger text-white";
      case AlertPriority.MEDIUM:
        return "bg-empowerher-warning text-white";
      case AlertPriority.LOW:
        return "bg-empowerher-success text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.NEW:
        return "bg-empowerher-danger text-white";
      case AlertStatus.ACKNOWLEDGED:
        return "bg-empowerher-warning text-white";
      case AlertStatus.RESOLVED:
        return "bg-empowerher-success text-white";
      case AlertStatus.FALSE_POSITIVE:
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAlertTypeLabel = (type: AlertType) => {
    switch (type) {
      case AlertType.SOS:
        return "SOS Gesture";
      case AlertType.SURROUNDED:
        return "Woman Surrounded";
      case AlertType.ISOLATED:
        return "Woman Isolated";
      default:
        return "Unknown Alert";
    }
  };

  const handleViewAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertDetailOpen(true);
  };

  const filteredAlerts = data?.items.filter(alert => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      alert.camera_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.address.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by type
    const matchesType = filterType === 'all' || alert.type === filterType;
    
    // Filter by priority
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    
    // Filter by status
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  }) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Alerts</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by camera or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" /> Type
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={AlertType.SOS}>SOS Gesture</SelectItem>
                  <SelectItem value={AlertType.SURROUNDED}>Surrounded</SelectItem>
                  <SelectItem value={AlertType.ISOLATED}>Isolated</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" /> Priority
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value={AlertPriority.HIGH}>High</SelectItem>
                  <SelectItem value={AlertPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={AlertPriority.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" /> Status
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={AlertStatus.NEW}>New</SelectItem>
                  <SelectItem value={AlertStatus.ACKNOWLEDGED}>Acknowledged</SelectItem>
                  <SelectItem value={AlertStatus.RESOLVED}>Resolved</SelectItem>
                  <SelectItem value={AlertStatus.FALSE_POSITIVE}>False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
          <CardDescription>
            View and manage all detected safety alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading alerts...</div>
          ) : filteredAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Camera</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${getPriorityColor(alert.priority)}`}>
                            {getAlertTypeIcon(alert.type)}
                          </div>
                          <span>{getAlertTypeLabel(alert.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{alert.camera_name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{alert.address}</TableCell>
                      <TableCell>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewAlert(alert)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No alerts match your criteria
            </div>
          )}
        </CardContent>
        {data && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} of {data.total} alerts
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" disabled>
                Page {page} of {data.pages || 1}
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page === (data.pages || 1)}
                onClick={() => setPage(page + 1)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      
      {/* Alert Detail Dialog */}
      <Dialog open={isAlertDetailOpen} onOpenChange={setIsAlertDetailOpen}>
        {selectedAlert && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Alert Details</DialogTitle>
              <DialogDescription>
                Alert ID: {selectedAlert.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Alert Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`p-1 rounded-full ${getPriorityColor(selectedAlert.priority)}`}>
                        {getAlertTypeIcon(selectedAlert.type)}
                      </div>
                      <p className="font-medium">{getAlertTypeLabel(selectedAlert.type)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Camera</p>
                    <p className="font-medium">{selectedAlert.camera_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedAlert.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-medium">
                      {new Date(selectedAlert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <Badge className={getPriorityColor(selectedAlert.priority)}>
                        {selectedAlert.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(selectedAlert.status)}>
                        {selectedAlert.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <p className="font-medium">{Math.round(selectedAlert.confidence_score * 100)}%</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Evidence</h3>
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  {selectedAlert.snapshot_url ? (
                    <img 
                      src={selectedAlert.snapshot_url}
                      alt="Alert Evidence"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No snapshot available</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Location</h4>
                  <div className="h-[120px] bg-muted rounded-md">
                    {/* This would be a mini map in actual implementation */}
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-muted-foreground">
                        Location: {selectedAlert.location.lat.toFixed(6)}, {selectedAlert.location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAlertDetailOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AlertsPage;
