
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { safetyMapApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SafetyMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLayers, setMapLayers] = useState({
    heatmap: true,
    cameras: true,
    policeStations: true,
  });

  // Use React Query to fetch map data
  const { data: hotspots } = useQuery({
    queryKey: ['mapHotspots'],
    queryFn: safetyMapApi.getHotspots,
  });

  const { data: cameraLocations } = useQuery({
    queryKey: ['mapCameraLocations'],
    queryFn: safetyMapApi.getCameraLocations,
  });

  const { data: policeStations } = useQuery({
    queryKey: ['mapPoliceStations'],
    queryFn: safetyMapApi.getPoliceStations,
  });

  useEffect(() => {
    // This would be where we initialize the map with Leaflet
    // Since we can't actually load Leaflet in this environment, we'll just simulate it
    console.log('Initializing map with leaflet');
    console.log('Map data available:', {
      hotspots: hotspots?.data?.length ?? 0,
      cameras: cameraLocations?.length ?? 0,
      police: policeStations?.length ?? 0,
    });
    
    // In a real implementation, we would:
    // 1. Initialize Leaflet map
    // 2. Add tile layers
    // 3. Add heatmap overlay
    // 4. Add camera markers
    // 5. Add police station markers
    // 6. Set up click handlers

    return () => {
      // Cleanup map on component unmount
      console.log('Cleaning up map');
    };
  }, [hotspots, cameraLocations, policeStations, mapLayers]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Safety Map</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-empowerher-primary text-white">
            {cameraLocations?.length ?? 0} Cameras
          </Badge>
          <Badge variant="outline" className="bg-empowerher-danger text-white">
            {hotspots?.data?.length ?? 0} Hotspots
          </Badge>
          <Badge variant="outline" className="bg-empowerher-success text-white">
            {policeStations?.length ?? 0} Police Stations
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Layers className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Map Layers</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={mapLayers.heatmap}
                onCheckedChange={(checked) => setMapLayers({ ...mapLayers, heatmap: checked })}
              >
                Heatmap
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={mapLayers.cameras}
                onCheckedChange={(checked) => setMapLayers({ ...mapLayers, cameras: checked })}
              >
                Cameras
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={mapLayers.policeStations}
                onCheckedChange={(checked) => setMapLayers({ ...mapLayers, policeStations: checked })}
              >
                Police Stations
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Safety Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This map displays safety data including camera locations, hotspots, and nearby police stations.
            Toggle different map layers using the controls in the upper right corner.
          </p>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-[600px] bg-muted rounded-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <p>Loading map...</p>
          <p className="text-xs mt-2">
            (In a real implementation, this would show a Leaflet map with heatmap overlay and markers)
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Highest Risk Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hotspots?.data?.slice(0, 5).map((spot, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>Area {index + 1}</span>
                  <Badge variant="outline" className="bg-red-500/80 text-white">
                    Risk Level: {spot.value}
                  </Badge>
                </li>
              )) || (
                <li className="text-muted-foreground">Loading risk areas...</li>
              )}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Camera Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {cameraLocations?.slice(0, 5).map((camera) => (
                <li key={camera.id} className="flex justify-between items-center">
                  <span>{camera.name}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      camera.status === 'online'
                        ? 'bg-empowerher-success text-white'
                        : camera.status === 'offline'
                        ? 'bg-empowerher-danger text-white'
                        : 'bg-empowerher-warning text-white'
                    }
                  >
                    {camera.status}
                  </Badge>
                </li>
              )) || (
                <li className="text-muted-foreground">Loading cameras...</li>
              )}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Police Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {policeStations?.slice(0, 5).map((station) => (
                <li key={station.id} className="flex justify-between items-center">
                  <span>{station.name}</span>
                  <span className="text-xs text-muted-foreground">{station.phone}</span>
                </li>
              )) || (
                <li className="text-muted-foreground">Loading police stations...</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyMap;
