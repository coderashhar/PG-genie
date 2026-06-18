import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-surface-container rounded-xl flex items-center justify-center animate-pulse border border-outline-variant"><span className="material-symbols-outlined text-primary text-3xl">map</span></div>
});

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
  onSuccess: () => void;
}

const AVAILABLE_ROOM_TYPES = ['Single', 'Double', 'Triple', 'Dorm'];
const AVAILABLE_AMENITIES = ['AC', 'Laundry', 'Meals', 'Gym', 'Study Room'];
const BOOLEAN_AMENITIES = [
  { key: 'wifi', label: 'WiFi' },
  { key: 'furniture', label: 'Furniture' },
  { key: 'attachedBath', label: 'Attached Bath' },
  { key: 'waterSupply', label: 'Water Supply' },
  { key: 'geyser', label: 'Geyser' },
  { key: 'backupPower', label: 'Backup Power' },
  { key: 'cctv', label: 'CCTV' },
  { key: 'washingMachine', label: 'Washing Machine' },
  { key: 'petFriendly', label: 'Pet Friendly' },
];

export default function PropertyModal({ isOpen, onClose, property, onSuccess }: PropertyModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
    price: '',
    roomTypes: [] as string[],
    amenities: [] as string[],
    images: [] as string[],
    furniture: false,
    attachedBath: false,
    waterSupply: false,
    geyser: false,
    wifi: false,
    backupPower: false,
    cctv: false,
    washingMachine: false,
    petFriendly: false,
  });

  // Image upload state
  const [uploadingImages, setUploadingImages] = useState<{ id: string; name: string; preview: string; progress: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        address: property.location?.address || '',
        city: property.location?.city || '',
        state: property.location?.state || '',
        lat: property.location?.lat,
        lng: property.location?.lng,
        price: property.price?.toString() || '',
        roomTypes: property.roomTypes || [],
        amenities: property.amenities || [],
        images: property.images || [],
        furniture: property.furniture || false,
        attachedBath: property.attachedBath || false,
        waterSupply: property.waterSupply || false,
        geyser: property.geyser || false,
        wifi: property.wifi || false,
        backupPower: property.backupPower || false,
        cctv: property.cctv || false,
        washingMachine: property.washingMachine || false,
        petFriendly: property.petFriendly || false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        address: '',
        city: '',
        state: '',
        lat: undefined,
        lng: undefined,
        price: '',
        roomTypes: [],
        amenities: [],
        images: [],
        furniture: false,
        attachedBath: false,
        waterSupply: false,
        geyser: false,
        wifi: false,
        backupPower: false,
        cctv: false,
        washingMachine: false,
        petFriendly: false,
      });
    }
    setUploadingImages([]);
  }, [property, isOpen]);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (name: 'roomTypes' | 'amenities', value: string) => {
    setFormData((prev) => {
      const arr = prev[name];
      if (arr.includes(value)) {
        return { ...prev, [name]: arr.filter((item) => item !== value) };
      }
      return { ...prev, [name]: [...arr, value] };
    });
  };

  const handleBooleanChange = (name: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: !prev[name] }));
  };

  // --- Image Upload Handlers ---
  const uploadFileToS3 = async (file: File): Promise<string> => {
    // 1. Get presigned POST fields
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to get upload URL');
    }
    
    const { url, fields, fileUrl } = await res.json();

    // 2. Upload to S3 using FormData
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', file); // file must be the last field

    const uploadRes = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadRes.ok) throw new Error('Failed to upload to S3');

    return fileUrl;
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    // Create tracking entries with local previews
    const newUploads = fileArray.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));
    setUploadingImages(prev => [...prev, ...newUploads]);

    // Upload each file
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const uploadId = newUploads[i].id;
      try {
        // Simulate progress
        setUploadingImages(prev => prev.map(u => u.id === uploadId ? { ...u, progress: 50 } : u));
        const fileUrl = await uploadFileToS3(file);
        setUploadingImages(prev => prev.map(u => u.id === uploadId ? { ...u, progress: 100 } : u));

        // Add to form data
        setFormData(prev => ({ ...prev, images: [...prev.images, fileUrl] }));

        // Remove from uploading list after a brief delay
        setTimeout(() => {
          setUploadingImages(prev => prev.filter(u => u.id !== uploadId));
        }, 600);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
        setUploadingImages(prev => prev.filter(u => u.id !== uploadId));
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
      e.target.value = ''; // Reset so same file can be re-selected
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.images.length === 0) {
      toast.error('Please upload at least one image of the PG');
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        lat: formData.lat,
        lng: formData.lng,
      },
      price: Number(formData.price),
      roomTypes: formData.roomTypes,
      amenities: formData.amenities,
      images: formData.images,
      furniture: formData.furniture,
      attachedBath: formData.attachedBath,
      waterSupply: formData.waterSupply,
      geyser: formData.geyser,
      wifi: formData.wifi,
      backupPower: formData.backupPower,
      cctv: formData.cctv,
      washingMachine: formData.washingMachine,
      petFriendly: formData.petFriendly,
    };

    try {
      const url = property ? `/api/properties/${property._id}` : '/api/properties';
      const method = property ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save property');
      }

      toast.success(property ? 'Property updated and sent for review!' : 'Property listed and sent for review!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface dark:bg-surface-container rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
              <h2 className="font-headline text-xl text-on-surface font-bold">
                {property ? 'Edit Property' : 'List your PG'}
              </h2>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 p-2 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="font-h2 text-h2 text-primary border-b border-outline-variant pb-2">Basic Details</h3>
                
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Property Title *</label>
                  <input
                    required
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="e.g. Sunshine Premium Boys PG"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Description *</label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                    placeholder="Describe the property and its environment..."
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Monthly Rent (₹) *</label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="font-h2 text-h2 text-primary border-b border-outline-variant pb-2">Location</h3>
                
                <div className="mb-4">
                  <LocationPickerMap 
                    onLocationSelect={(details) => {
                      setFormData(prev => ({
                        ...prev,
                        address: details.address || prev.address,
                        city: details.city || prev.city,
                        state: details.state || prev.state,
                        lat: details.lat,
                        lng: details.lng
                      }));
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Address *</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="e.g. 123 Main Street, Near University"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">City *</label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="e.g. Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">State *</label>
                    <input
                      required
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="e.g. Delhi"
                    />
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-4">
                <h3 className="font-h2 text-h2 text-primary border-b border-outline-variant pb-2">Configuration</h3>
                
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Room Types Available</label>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_ROOM_TYPES.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer bg-surface-container px-3 py-2 rounded-lg border border-outline-variant hover:border-primary transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.roomTypes.includes(type)}
                          onChange={() => handleCheckboxChange('roomTypes', type)}
                          className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
                        />
                        <span className="text-body-sm text-on-surface">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-3">
                    {BOOLEAN_AMENITIES.map(amenity => (
                      <label key={amenity.key} className="flex items-center gap-2 cursor-pointer bg-surface-container px-3 py-2 rounded-lg border border-outline-variant hover:border-primary transition-colors">
                        <input
                          type="checkbox"
                          checked={(formData as any)[amenity.key]}
                          onChange={() => handleBooleanChange(amenity.key)}
                          className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
                        />
                        <span className="text-body-sm text-on-surface">{amenity.label}</span>
                      </label>
                    ))}
                    {AVAILABLE_AMENITIES.map(amenity => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer bg-surface-container px-3 py-2 rounded-lg border border-outline-variant hover:border-primary transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleCheckboxChange('amenities', amenity)}
                          className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
                        />
                        <span className="text-body-sm text-on-surface">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4">
                <h3 className="font-h2 text-h2 text-primary border-b border-outline-variant pb-2">Media</h3>
                
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Property Photos</label>
                  
                  {/* Uploaded thumbnails */}
                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-outline-variant shadow-sm">
                          <img src={url} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-white text-[20px] drop-shadow-lg">delete</span>
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5 font-label-sm">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Uploading previews */}
                  {uploadingImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {uploadingImages.map(upload => (
                        <div key={upload.id} className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant shadow-sm">
                          <img src={upload.preview} alt={upload.name} className="w-full h-full object-cover opacity-50" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <span className="material-symbols-outlined animate-spin text-white text-[24px]">progress_activity</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Drop zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                      w-full border-2 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-2
                      cursor-pointer transition-all duration-200
                      ${isDragging
                        ? 'border-primary bg-primary/5 scale-[1.01]'
                        : 'border-outline-variant bg-surface-container hover:border-primary hover:bg-primary/5'
                      }
                    `}
                  >
                    <span className="material-symbols-outlined text-[36px] text-on-surface-variant">
                      {isDragging ? 'downloading' : 'add_photo_alternate'}
                    </span>
                    <p className="text-body-md text-on-surface-variant text-center">
                      {isDragging ? 'Drop images here' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-xs text-outline">JPG, PNG, WebP • Max 5MB each</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    We recommend at least 3 high-quality photos for better visibility.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-outline-variant flex justify-end gap-3 sticky bottom-0 bg-surface dark:bg-surface-container pb-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-body-md text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 rounded-xl font-h2 font-bold bg-primary text-on-primary shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  {property ? 'Save Changes' : 'List Property'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
