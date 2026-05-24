"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  defaultImage?: string;
  className?: string;
  label?: string;
  shape?: 'circle' | 'rectangle';
}

export default function ImageUpload({ 
  onUploadSuccess, 
  defaultImage, 
  className = "",
  label = "Upload Image",
  shape = 'rectangle'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Optional: add file size/type validation here

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    await uploadToS3(file);
  };

  const uploadToS3 = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get presigned URL from our API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { signedUrl, fileUrl } = await response.json();

      // 2. Upload file directly to S3 using the presigned URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // 3. Inform parent component
      onUploadSuccess(fileUrl);
      // setPreviewUrl(fileUrl); // Keep the local objectUrl preview to avoid broken images if S3 bucket is private
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const shapeClasses = shape === 'circle' 
    ? 'w-32 h-32 rounded-full' 
    : 'w-full h-48 rounded-xl';

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div 
        onClick={handleContainerClick}
        className={`
          relative overflow-hidden cursor-pointer flex flex-col items-center justify-center
          bg-surface-variant border-2 border-dashed border-outline-variant
          transition-all duration-300 hover:bg-surface-container-low hover:border-primary
          ${shapeClasses}
        `}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Upload preview" 
            className={`object-cover w-full h-full ${shape === 'circle' ? 'rounded-full' : ''}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-on-surface-variant p-4 text-center">
            <span className="material-symbols-outlined text-[32px] mb-2">cloud_upload</span>
            <span className="font-label-sm text-label-sm">{label}</span>
          </div>
        )}

        {/* Overlay while uploading */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-sm">
            <span className="material-symbols-outlined animate-spin text-white text-[32px]">progress_activity</span>
          </div>
        )}

        {/* Edit icon overlay on hover (only if not uploading and has preview) */}
        {!isUploading && previewUrl && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center z-10 transition-colors opacity-0 hover:opacity-100">
            <span className="material-symbols-outlined text-white text-[24px]">edit</span>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-error font-label-sm text-label-sm text-center">{error}</p>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
