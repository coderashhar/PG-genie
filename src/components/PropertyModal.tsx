import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
  onSuccess: () => void;
}

const AVAILABLE_ROOM_TYPES = ['Single', 'Double', 'Triple', 'Dorm'];
const AVAILABLE_AMENITIES = ['WiFi', 'AC', 'Laundry', 'Meals', 'Gym', 'Study Room'];

export default function PropertyModal({ isOpen, onClose, property, onSuccess }: PropertyModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    price: '',
    roomTypes: [] as string[],
    amenities: [] as string[],
    images: '',
  });

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
        price: property.price?.toString() || '',
        roomTypes: property.roomTypes || [],
        amenities: property.amenities || [],
        images: property.images?.join('\n') || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        address: '',
        city: '',
        state: '',
        price: '',
        roomTypes: [],
        amenities: [],
        images: '',
      });
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
      },
      price: Number(formData.price),
      roomTypes: formData.roomTypes,
      amenities: formData.amenities,
      images: formData.images.split('\n').map(img => img.trim()).filter(Boolean),
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

      toast.success(property ? 'Property updated successfully!' : 'Property added successfully!');
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
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Image URLs (one per line)</label>
                  <textarea
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none font-mono text-sm"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Provide direct links to property images. We recommend at least 3 high-quality photos.</p>
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
