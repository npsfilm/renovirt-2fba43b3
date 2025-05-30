
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface FileUploadManagerProps {
  uploadFiles: FileList | null;
  setUploadFiles: (files: FileList | null) => void;
  onFileUpload: () => void;
  isUploading: boolean;
}

const FileUploadManager = ({
  uploadFiles,
  setUploadFiles,
  onFileUpload,
  isUploading
}: FileUploadManagerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dateien hochladen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Bearbeitete Bilder, Rechnungen, etc.</Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            accept="image/*,.pdf,.zip"
            onChange={(e) => setUploadFiles(e.target.files)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Unterstützte Formate: Bilder, PDF, ZIP
          </p>
        </div>

        <Button
          onClick={onFileUpload}
          disabled={!uploadFiles || uploadFiles.length === 0 || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Wird hochgeladen...' : 'Dateien hochladen'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUploadManager;
