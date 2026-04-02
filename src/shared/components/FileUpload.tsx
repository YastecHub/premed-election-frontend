import React, { useState, useRef } from 'react';
import { CloudUpload, X, Image } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  preview?: boolean;
  label?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  maxSize = 5 * 1024 * 1024,
  preview = true,
  label = 'Upload Image',
  description = 'Drag & drop or click to browse'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, or GIF image.';
    }
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`;
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFile(file);
    onFileSelect(file);

    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 transition-all ${
            isDragging
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-zinc-700 hover:border-violet-400/50 bg-zinc-800/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block text-center">
            <CloudUpload className="h-10 w-10 text-zinc-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-300 mb-1">
              {label}
            </p>
            <p className="text-xs text-zinc-500 mb-1">
              {description}
            </p>
            <p className="text-xs text-zinc-600">
              JPG, PNG or GIF (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
            </p>
          </label>
        </div>
      ) : (
        <div className="border border-emerald-500/30 rounded-2xl p-4 bg-emerald-500/5">
          {previewUrl && (
            <div className="mb-3 relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-contain rounded-xl bg-zinc-900"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Image className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm font-medium text-zinc-200 truncate">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Remove uploaded file"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl p-3">
          {error}
        </div>
      )}
    </div>
  );
};
