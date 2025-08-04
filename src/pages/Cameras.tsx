
// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { camerasApi } from '@/lib/api';
// import { Camera, GeoLocation } from '@/types/api';
// import { CameraCard } from '@/components/ui/camera-card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Plus, Search } from 'lucide-react';
// import { toast } from 'sonner';

// // Make sure the form schema matches the required Camera type fields
// const cameraFormSchema = z.object({
//   camera_id: z.string().min(1, 'Camera ID is required'),
//   name: z.string().min(1, 'Camera name is required'),
//   address: z.string().min(1, 'Address is required'),
//   rtsp_url: z.string().min(1, 'RTSP URL is required'),
//   location: z.object({
//     lat: z.number().min(-90).max(90),
//     lng: z.number().min(-180).max(180),
//   }),
// });

// type CameraFormValues = z.infer<typeof cameraFormSchema>;

// const Cameras: React.FC = () => {
//   const queryClient = useQueryClient();
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [isViewLiveDialogOpen, setIsViewLiveDialogOpen] = useState(false);
//   const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   const { data: cameras = [], isLoading } = useQuery({
//     queryKey: ['cameras'],
//     queryFn: camerasApi.getAllCameras,
//   });

//   const addCameraMutation = useMutation({
//     mutationFn: camerasApi.createCamera,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['cameras'] });
//       toast.success('Camera added successfully');
//       setIsAddDialogOpen(false);
//     },
//     onError: (error) => {
//       toast.error('Failed to add camera');
//       console.error('Error adding camera:', error);
//     },
//   });

//   const updateCameraMutation = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<Camera> }) => 
//       camerasApi.updateCamera(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['cameras'] });
//       toast.success('Camera updated successfully');
//       setIsEditDialogOpen(false);
//     },
//     onError: (error) => {
//       toast.error('Failed to update camera');
//       console.error('Error updating camera:', error);
//     },
//   });

//   const deleteCameraMutation = useMutation({
//     mutationFn: (id: string) => camerasApi.deleteCamera(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['cameras'] });
//       toast.success('Camera deleted successfully');
//       setIsDeleteDialogOpen(false);
//     },
//     onError: (error) => {
//       toast.error('Failed to delete camera');
//       console.error('Error deleting camera:', error);
//     },
//   });

//   const addCameraForm = useForm<CameraFormValues>({
//     resolver: zodResolver(cameraFormSchema),
//     defaultValues: {
//       camera_id: '',
//       name: '',
//       address: '',
//       rtsp_url: '',
//       location: {
//         lat: 0,
//         lng: 0,
//       },
//     },
//   });

//   const editCameraForm = useForm<CameraFormValues>({
//     resolver: zodResolver(cameraFormSchema),
//     defaultValues: {
//       camera_id: '',
//       name: '',
//       address: '',
//       rtsp_url: '',
//       location: {
//         lat: 0,
//         lng: 0,
//       },
//     },
//   });

//   // Fix the type issues by ensuring all required fields are provided
//   const handleAddCamera = (data: CameraFormValues) => {
//     // Ensure the location property is properly defined as GeoLocation
//     const location: GeoLocation = {
//       lat: data.location.lat,
//       lng: data.location.lng
//     };
    
//     addCameraMutation.mutate({
//       camera_id: data.camera_id,
//       name: data.name,
//       address: data.address,
//       rtsp_url: data.rtsp_url,
//       location: location,
//       status: 'offline',
//     });
//   };

//   const handleEditCamera = (data: CameraFormValues) => {
//     if (!selectedCamera) return;
    
//     // Ensure the location property is properly defined as GeoLocation
//     const location: GeoLocation = {
//       lat: data.location.lat,
//       lng: data.location.lng
//     };
    
//     updateCameraMutation.mutate({
//       id: selectedCamera.id,
//       data: {
//         camera_id: data.camera_id,
//         name: data.name,
//         address: data.address,
//         rtsp_url: data.rtsp_url,
//         location: location,
//       },
//     });
//   };

//   const handleDeleteCamera = () => {
//     if (!selectedCamera) return;
//     deleteCameraMutation.mutate(selectedCamera.id);
//   };

//   const handleViewLive = (camera: Camera) => {
//     setSelectedCamera(camera);
//     setIsViewLiveDialogOpen(true);
//   };

//   const handleEdit = (camera: Camera) => {
//     setSelectedCamera(camera);
//     editCameraForm.reset({
//       camera_id: camera.camera_id,
//       name: camera.name,
//       address: camera.address,
//       rtsp_url: camera.rtsp_url,
//       location: camera.location,
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleDelete = (camera: Camera) => {
//     setSelectedCamera(camera);
//     setIsDeleteDialogOpen(true);
//   };

//   const filteredCameras = cameras.filter(camera => 
//     camera.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     camera.address.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Cameras</h1>
//         <Button onClick={() => setIsAddDialogOpen(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Camera
//         </Button>
//       </div>

//       <div className="relative mb-6">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//         <Input
//           placeholder="Search cameras by name or location..."
//           className="pl-10"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>
      
//       {isLoading ? (
//         <div className="text-center py-10">Loading cameras...</div>
//       ) : filteredCameras.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCameras.map((camera) => (
//             <CameraCard
//               key={camera.id}
//               camera={camera}
//               onViewLive={handleViewLive}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-10 text-muted-foreground">
//           {searchQuery ? 'No cameras match your search' : 'No cameras found. Add your first camera!'}
//         </div>
//       )}
      
//       {/* Add Camera Dialog */}
//       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add New Camera</DialogTitle>
//             <DialogDescription>
//               Fill in the details to add a new camera to the monitoring system.
//             </DialogDescription>
//           </DialogHeader>
//           <Form {...addCameraForm}>
//             <form onSubmit={addCameraForm.handleSubmit(handleAddCamera)} className="space-y-4">
//               <FormField
//                 control={addCameraForm.control}
//                 name="camera_id"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Camera ID</FormLabel>
//                     <FormControl>
//                       <Input placeholder="CAM001" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={addCameraForm.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Camera Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Main Entrance Camera" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={addCameraForm.control}
//                 name="address"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address</FormLabel>
//                     <FormControl>
//                       <Input placeholder="123 Safety Street" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={addCameraForm.control}
//                   name="location.lat"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Latitude</FormLabel>
//                       <FormControl>
//                         <Input 
//                           type="number" 
//                           step="0.000001"
//                           placeholder="37.7749" 
//                           {...field} 
//                           onChange={(e) => field.onChange(parseFloat(e.target.value))} 
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={addCameraForm.control}
//                   name="location.lng"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Longitude</FormLabel>
//                       <FormControl>
//                         <Input 
//                           type="number"
//                           step="0.000001" 
//                           placeholder="-122.4194" 
//                           {...field} 
//                           onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={addCameraForm.control}
//                 name="rtsp_url"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>RTSP URL</FormLabel>
//                     <FormControl>
//                       <Input placeholder="rtsp://example.com/stream" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={addCameraMutation.isPending}>
//                   {addCameraMutation.isPending ? 'Adding...' : 'Add Camera'}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
      
//       {/* Edit Camera Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Camera</DialogTitle>
//             <DialogDescription>
//               Update the details for this camera.
//             </DialogDescription>
//           </DialogHeader>
//           <Form {...editCameraForm}>
//             <form onSubmit={editCameraForm.handleSubmit(handleEditCamera)} className="space-y-4">
//               <FormField
//                 control={editCameraForm.control}
//                 name="camera_id"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Camera ID</FormLabel>
//                     <FormControl>
//                       <Input placeholder="CAM001" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={editCameraForm.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Camera Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Main Entrance Camera" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={editCameraForm.control}
//                 name="address"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address</FormLabel>
//                     <FormControl>
//                       <Input placeholder="123 Safety Street" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={editCameraForm.control}
//                   name="location.lat"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Latitude</FormLabel>
//                       <FormControl>
//                         <Input 
//                           type="number" 
//                           step="0.000001"
//                           placeholder="37.7749" 
//                           {...field} 
//                           onChange={(e) => field.onChange(parseFloat(e.target.value))} 
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={editCameraForm.control}
//                   name="location.lng"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Longitude</FormLabel>
//                       <FormControl>
//                         <Input 
//                           type="number" 
//                           step="0.000001"
//                           placeholder="-122.4194" 
//                           {...field} 
//                           onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={editCameraForm.control}
//                 name="rtsp_url"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>RTSP URL</FormLabel>
//                     <FormControl>
//                       <Input placeholder="rtsp://example.com/stream" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={updateCameraMutation.isPending}>
//                   {updateCameraMutation.isPending ? 'Saving...' : 'Save Changes'}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
      
//       {/* Delete Camera Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Delete Camera</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete {selectedCamera?.name}? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button 
//               variant="destructive" 
//               onClick={handleDeleteCamera}
//               disabled={deleteCameraMutation.isPending}
//             >
//               {deleteCameraMutation.isPending ? 'Deleting...' : 'Delete Camera'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
      
//       {/* View Live Feed Dialog */}
//       <Dialog open={isViewLiveDialogOpen} onOpenChange={setIsViewLiveDialogOpen}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Live Feed: {selectedCamera?.name}</DialogTitle>
//             <DialogDescription>
//               {selectedCamera?.address}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="aspect-video bg-muted rounded-md overflow-hidden">
//             {selectedCamera && (
//               <img 
//                 src={selectedCamera ? `${camerasApi.getSnapshot(selectedCamera.camera_id)}` : ""}
//                 alt={`${selectedCamera.name} Live Feed`}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.currentTarget.src = "/placeholder.svg";
//                 }}
//               />
//             )}
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsViewLiveDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Cameras;
// ==========================new check in this file ========================
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { camerasApi } from '@/lib/api';
import { Camera, GeoLocation } from '@/types/api';
import { CameraCard } from '@/components/ui/camera-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Enhanced form schema with better validation
const cameraFormSchema = z.object({
  camera_id: z.string().min(1, 'Camera ID is required').max(50, 'Camera ID too long'),
  name: z.string().min(1, 'Camera name is required').max(100, 'Camera name too long'),
  address: z.string().min(1, 'Address is required').max(200, 'Address too long'),
  rtsp_url: z.string().min(1, 'RTSP URL is required').refine(
    (url) => url.startsWith('rtsp://') || url.startsWith('http://') || url.startsWith('https://'),
    'URL must start with rtsp://, http://, or https://'
  ),
  location: z.object({
    lat: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
    lng: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  }),
});

type CameraFormValues = z.infer<typeof cameraFormSchema>;

const Cameras: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewLiveDialogOpen, setIsViewLiveDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced query with better error handling
  const { 
    data: cameras = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['cameras'],
    queryFn: async () => {
      try {
        const result = await camerasApi.getAllCameras();
        console.log('Cameras fetched:', result);
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('Failed to fetch cameras:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addCameraMutation = useMutation({
    mutationFn: async (cameraData: Omit<Camera, 'id' | 'last_activity'>) => {
      const result = await camerasApi.createCamera(cameraData);
      if (!result) {
        throw new Error('Failed to create camera');
      }
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      toast.success('Camera added successfully');
      setIsAddDialogOpen(false);
      addCameraForm.reset();
    },
    onError: (error: any) => {
      console.error('Error adding camera:', error);
      const message = error?.response?.data?.detail || error?.message || 'Failed to add camera';
      toast.error(message);
    },
  });

  const updateCameraMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Camera> }) => {
      const result = await camerasApi.updateCamera(id, data);
      if (!result) {
        throw new Error('Failed to update camera');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      toast.success('Camera updated successfully');
      setIsEditDialogOpen(false);
      setSelectedCamera(null);
    },
    onError: (error: any) => {
      console.error('Error updating camera:', error);
      const message = error?.response?.data?.detail || error?.message || 'Failed to update camera';
      toast.error(message);
    },
  });

  const deleteCameraMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await camerasApi.deleteCamera(id);
      if (!result) {
        throw new Error('Failed to delete camera');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      toast.success('Camera deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedCamera(null);
    },
    onError: (error: any) => {
      console.error('Error deleting camera:', error);
      const message = error?.response?.data?.detail || error?.message || 'Failed to delete camera';
      toast.error(message);
    },
  });

  const addCameraForm = useForm<CameraFormValues>({
    resolver: zodResolver(cameraFormSchema),
    defaultValues: {
      camera_id: '',
      name: '',
      address: '',
      rtsp_url: '',
      location: {
        lat: 0,
        lng: 0,
      },
    },
  });

  const editCameraForm = useForm<CameraFormValues>({
    resolver: zodResolver(cameraFormSchema),
    defaultValues: {
      camera_id: '',
      name: '',
      address: '',
      rtsp_url: '',
      location: {
        lat: 0,
        lng: 0,
      },
    },
  });

  const handleAddCamera = (data: CameraFormValues) => {
    const location: GeoLocation = {
      lat: data.location.lat,
      lng: data.location.lng
    };
    
    addCameraMutation.mutate({
      camera_id: data.camera_id,
      name: data.name,
      address: data.address,
      rtsp_url: data.rtsp_url,
      location: location,
      status: 'offline',
    });
  };

  const handleEditCamera = (data: CameraFormValues) => {
    if (!selectedCamera) return;
    
    const location: GeoLocation = {
      lat: data.location.lat,
      lng: data.location.lng
    };
    
    updateCameraMutation.mutate({
      id: selectedCamera.id ,
      data: {
        camera_id: data.camera_id,
        name: data.name,
        address: data.address,
        rtsp_url: data.rtsp_url,
        location: location,
      },
    });
  };

  const handleDeleteCamera = () => {
    if (!selectedCamera) return;
    deleteCameraMutation.mutate(selectedCamera.id);
  };

  const handleViewLive = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsViewLiveDialogOpen(true);
  };

  const handleEdit = (camera: Camera) => {
    setSelectedCamera(camera);
    editCameraForm.reset({
      camera_id: camera.camera_id,
      name: camera.name,
      address: camera.address,
      rtsp_url: camera.rtsp_url,
      location: camera.location,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsDeleteDialogOpen(true);
  };

  const filteredCameras = cameras.filter(camera => 
    camera?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    camera?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-lg font-semibold">Failed to load cameras</h2>
          <p className="text-muted-foreground">
            {error?.message || 'An error occurred while fetching cameras'}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cameras</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Camera
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search cameras by name or location..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading cameras...</span>
          </div>
        </div>
      ) : filteredCameras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCameras.map((camera) => (
            <CameraCard
              key={camera.id}
              camera={camera}
              onViewLive={handleViewLive}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          {searchQuery ? 'No cameras match your search' : 'No cameras found. Add your first camera!'}
        </div>
      )}
      
      {/* Add Camera Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Camera</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new camera to the monitoring system.
            </DialogDescription>
          </DialogHeader>
          <Form {...addCameraForm}>
            <form onSubmit={addCameraForm.handleSubmit(handleAddCamera)} className="space-y-4">
              <FormField
                control={addCameraForm.control}
                name="camera_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera ID</FormLabel>
                    <FormControl>
                      <Input placeholder="CAM001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addCameraForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Entrance Camera" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addCameraForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Safety Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addCameraForm.control}
                  name="location.lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          placeholder="37.7749" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addCameraForm.control}
                  name="location.lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.000001" 
                          placeholder="-122.4194" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={addCameraForm.control}
                name="rtsp_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RTSP URL</FormLabel>
                    <FormControl>
                      <Input placeholder="rtsp://example.com/stream" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addCameraMutation.isPending}>
                  {addCameraMutation.isPending ? 'Adding...' : 'Add Camera'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Camera Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Camera</DialogTitle>
            <DialogDescription>
              Update the details for this camera.
            </DialogDescription>
          </DialogHeader>
          <Form {...editCameraForm}>
            <form onSubmit={editCameraForm.handleSubmit(handleEditCamera)} className="space-y-4">
              <FormField
                control={editCameraForm.control}
                name="camera_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera ID</FormLabel>
                    <FormControl>
                      <Input placeholder="CAM001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editCameraForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Entrance Camera" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editCameraForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Safety Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editCameraForm.control}
                  name="location.lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          placeholder="37.7749" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editCameraForm.control}
                  name="location.lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.000001" 
                          placeholder="-122.4194" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editCameraForm.control}
                name="rtsp_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RTSP URL</FormLabel>
                    <FormControl>
                      <Input placeholder="rtsp://example.com/stream" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateCameraMutation.isPending}>
                  {updateCameraMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Camera Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Camera</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCamera?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCamera}
              disabled={deleteCameraMutation.isPending}
            >
              {deleteCameraMutation.isPending ? 'Deleting...' : 'Delete Camera'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Live Feed Dialog */}
      <Dialog open={isViewLiveDialogOpen} onOpenChange={setIsViewLiveDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Live Feed: {selectedCamera?.name}</DialogTitle>
            <DialogDescription>
              {selectedCamera?.address}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-md overflow-hidden">
            {selectedCamera && (
              <img 
                src={camerasApi.getSnapshot(selectedCamera.camera_id)}
                alt={`${selectedCamera.name} Live Feed`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewLiveDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cameras;