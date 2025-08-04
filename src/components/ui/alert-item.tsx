
// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Alert, AlertPriority, AlertType } from '@/types/api';
// import { Hand, Users, PersonStanding } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';

// interface AlertItemProps {
//   alert: Alert;
//   onClick?: () => void;
// }

// export const AlertItem: React.FC<AlertItemProps> = ({ alert, onClick }) => {
//   const getAlertIcon = () => {
//     switch (alert.type) {
//       case AlertType.SOS:
//         return <Hand className="h-4 w-4" />;
//       case AlertType.SURROUNDED:
//         return <Users className="h-4 w-4" />;
//       case AlertType.ISOLATED:
//         return <PersonStanding className="h-4 w-4" />;
//       default:
//         return null;
//     }
//   };

//   const getPriorityColor = () => {
//     switch (alert.priority) {
//       case AlertPriority.HIGH:
//         return "bg-empowerher-danger text-white";
//       case AlertPriority.MEDIUM:
//         return "bg-empowerher-warning text-white";
//       case AlertPriority.LOW:
//         return "bg-empowerher-success text-white";
//       default:
//         return "bg-muted text-muted-foreground";
//     }
//   };

//   const getAlertTypeLabel = () => {
//     switch (alert.type) {
//       case AlertType.SOS:
//         return "SOS Gesture";
//       case AlertType.SURROUNDED:
//         return "Woman Surrounded";
//       case AlertType.ISOLATED:
//         return "Woman Isolated";
//       default:
//         return "Unknown Alert";
//     }
//   };

//   const timeAgo = formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true });

//   return (
//     <Card 
//       className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
//       onClick={onClick}
//     >
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className={`p-2 rounded-full ${getPriorityColor()}`}>
//               {getAlertIcon()}
//             </div>
//             <div>
//               <h4 className="text-sm font-medium">{getAlertTypeLabel()}</h4>
//               <p className="text-xs text-muted-foreground">{alert.camera_name}</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <Badge variant="outline" className={`${getPriorityColor()} border-none`}>
//               {alert.priority.toUpperCase()}
//             </Badge>
//             <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


// ================================= Demon Change v1 ===========================

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/types/api';
import { Shield, AlertTriangle, Users, PersonStanding, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertItemProps {
  alert: Alert;
  onClick?: () => void;
}

export const AlertItem: React.FC<AlertItemProps> = ({ alert, onClick }) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'threat_detected':
        return <Shield className="h-4 w-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4" />;
      case 'emergency':
        return <Users className="h-4 w-4" />;
      case 'system_alert':
        return <Bell className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = () => {
    const severity = alert.severity || 'medium'; // Default to medium if severity is undefined
    
    switch (severity) {
      case 'critical':
        return "bg-red-600 text-white";
      case 'high':
        return "bg-red-500 text-white";
      case 'medium':
        return "bg-yellow-500 text-white";
      case 'low':
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getAlertTypeLabel = () => {
    switch (alert.type) {
      case 'threat_detected':
        return "Threat Detected";
      case 'suspicious_activity':
        return "Suspicious Activity";
      case 'emergency':
        return "Emergency Alert";
      case 'system_alert':
        return "System Alert";
      default:
        return "Alert";
    }
  };

  const getSeverityLabel = () => {
    const severity = alert.severity || 'medium';
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const getLocationText = () => {
    // Handle different location data formats
    if (alert.camera_name) {
      return alert.camera_name;
    }
    
    if (alert.location) {
      // If location is an object with lat, lng, address
      if (typeof alert.location === 'object') {
        return alert.location.address || `${alert.location.lat}, ${alert.location.lng}` || 'Unknown Location';
      }
      // If location is a string
      return alert.location;
    }
    
    return 'Unknown Location';
  };

  const timeAgo = formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true });

  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${getSeverityColor()}`}>
              {getAlertIcon()}
            </div>
            <div>
              <h4 className="text-sm font-medium">{getAlertTypeLabel()}</h4>
              <p className="text-xs text-muted-foreground">
                {getLocationText()}
              </p>
              {alert.description && (
                <p className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                  {alert.description}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className={`${getSeverityColor()} border-none`}>
              {getSeverityLabel()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
            {alert.confidence_score && (
              <p className="text-xs text-muted-foreground">
                {Math.round(alert.confidence_score * 100)}% confidence
              </p>
            )}
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="mt-2 flex items-center justify-between">
          <Badge 
            variant={alert.status === 'active' ? 'destructive' : alert.status === 'acknowledged' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {alert.status?.charAt(0).toUpperCase() + (alert.status?.slice(1) || '')}
          </Badge>
          
          {alert.image_url && (
            <span className="text-xs text-blue-600 hover:underline">
              View Image
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};