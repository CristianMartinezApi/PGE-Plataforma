import React, { useRef, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner@2.0.3';

interface ImageUploadProps {
  onImageSelect: (imageDataUrl: string) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number; // em MB
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  currentImage,
  accept = 'image/*',
  maxSize = 5,
  className = ''
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`A imagem deve ter no máximo ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error('Erro ao processar a imagem');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem');
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Limpar o input
    event.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-3 h-3" />
            </Button>
            {onImageRemove && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onImageRemove}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-200
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm text-gray-600">Processando imagem...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Image className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Clique para selecionar ou arraste uma imagem
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, GIF (máx. {maxSize}MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}