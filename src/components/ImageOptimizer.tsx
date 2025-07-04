import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ImageOptimizerProps {
  onImageSelect: (file: File, preview: string) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
  className?: string;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  onImageSelect,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  multiple = false,
  className = ''
}) => {
  const { state } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1200px width)
        const maxWidth = 1200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFiles = async (files: FileList) => {
    setIsProcessing(true);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported`);
        continue;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        continue;
      }

      try {
        // Compress image
        const compressedFile = await compressImage(file);
        const preview = URL.createObjectURL(compressedFile);
        
        setPreviews(prev => [...prev, preview]);
        onImageSelect(compressedFile, preview);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
      }
    }

    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : state.isDarkMode
            ? 'border-gray-600 hover:border-gray-500 bg-gray-800'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader className="w-8 h-8 animate-spin text-green-600" />
            <p className={`text-sm ${
              state.isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Processing images...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${
              state.isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className={`text-lg font-medium ${
                state.isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Drop images here or click to upload
              </p>
              <p className={`text-sm mt-1 ${
                state.isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Supports JPEG, PNG, WebP up to {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePreview(index);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageOptimizer;