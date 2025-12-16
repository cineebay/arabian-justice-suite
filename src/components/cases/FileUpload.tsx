import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';

interface UploadedFile {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

interface FileUploadProps {
  caseId: string;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.includes('pdf')) return FileText;
  return File;
};

export function FileUpload({ caseId, files, onFilesChange }: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (!API_CONFIG.useApi) {
      // Mock upload for demo
      const mockFiles: UploadedFile[] = Array.from(selectedFiles).map((file, i) => ({
        id: `mock-${Date.now()}-${i}`,
        filename: file.name,
        original_name: file.name,
        file_path: URL.createObjectURL(file),
        file_type: file.type,
        file_size: file.size,
      }));
      onFilesChange([...files, ...mockFiles]);
      toast({ title: 'تم رفع الملف بنجاح' });
      return;
    }

    setUploading(true);

    for (const file of Array.from(selectedFiles)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('case_id', caseId);

      try {
        const response = await fetch(API_ENDPOINTS.upload, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('فشل رفع الملف');

        const result = await response.json();
        onFilesChange([...files, {
          id: result.id,
          filename: result.filename,
          original_name: result.original_name,
          file_path: result.file_path,
          file_type: file.type,
          file_size: file.size,
        }]);
        
        toast({ title: 'تم رفع الملف بنجاح' });
      } catch (error) {
        toast({ 
          title: 'خطأ في رفع الملف', 
          description: 'تأكد من الاتصال بالخادم',
          variant: 'destructive' 
        });
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (fileId: string) => {
    if (!API_CONFIG.useApi) {
      onFilesChange(files.filter(f => f.id !== fileId));
      toast({ title: 'تم حذف الملف' });
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.upload}?id=${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('فشل حذف الملف');

      onFilesChange(files.filter(f => f.id !== fileId));
      toast({ title: 'تم حذف الملف' });
    } catch (error) {
      toast({ 
        title: 'خطأ في حذف الملف', 
        variant: 'destructive' 
      });
    }
  };

  const handlePreview = (file: UploadedFile) => {
    if (file.file_type.startsWith('image/')) {
      const url = API_CONFIG.useApi 
        ? `${API_CONFIG.baseUrl}/${file.file_path}`
        : file.file_path;
      setPreviewUrl(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          رفع ملف جديد
        </Button>
        <span className="text-xs text-muted-foreground">
          PDF, DOC, صور
        </span>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.file_type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group"
              >
                <div 
                  className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => handlePreview(file)}
                >
                  <FileIcon className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.original_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file_size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  onClick={() => handleDelete(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
              onClick={() => setPreviewUrl(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
