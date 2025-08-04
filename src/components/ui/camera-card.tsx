
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera } from '@/types/api';
import { Edit, Trash2, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CameraCardProps {
  camera: Camera;
  onViewLive: (camera: Camera) => void;
  onEdit: (camera: Camera) => void;
  onDelete: (camera: Camera) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  onViewLive,
  onEdit,
  onDelete,
}) => {
  const getStatusClass = () => {
    switch (camera.status) {
      case 'online':
        return 'status-online';
      case 'offline':
        return 'status-offline';
      case 'alert':
        return 'status-alert';
      default:
        return 'status-offline';
    }
  };

  const getStatusLabel = () => {
    return camera.status.charAt(0).toUpperCase() + camera.status.slice(1);
  };

  const timeAgo = camera.last_activity 
    ? formatDistanceToNow(new Date(camera.last_activity), { addSuffix: true })
    : 'Never';

  return (
    <Card className="h-full card-hover">
      <CardContent className="p-0 relative">
        <div className="aspect-video w-full bg-muted overflow-hidden relative">
          <img 
            src={`/api/streams/snapshot/${camera.camera_id}`} 
            alt={camera.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium truncate">{camera.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{camera.address}</p>
              </div>
              <div className="flex items-center">
                <span className={`status-indicator ${getStatusClass()} mr-2`}></span>
                <span className="text-xs font-medium">{getStatusLabel()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-muted/20 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Last activity: {timeAgo}</span>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onViewLive(camera)}
            title="View Live Feed"
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(camera)}
            title="Edit Camera"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDelete(camera)}
            title="Delete Camera"
            className="text-empowerher-danger"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
