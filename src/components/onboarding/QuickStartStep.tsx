
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';

interface QuickStartStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
}

const QuickStartStep = ({ nextStep, prevStep }: QuickStartStepProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedFiles.length <= 3) {
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Testen Sie unsere KI kostenlos</h2>
        <p className="text-gray-600">
          Laden Sie bis zu 3 Bilder hoch und erleben Sie die Qualität unserer Bearbeitung.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploadedFiles.length >= 3}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {uploadedFiles.length >= 3 ? 'Maximum erreicht (3/3)' : 'Bilder hier hinziehen oder klicken'}
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG • Noch {3 - uploadedFiles.length} Bilder möglich
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Hochgeladene Bilder ({uploadedFiles.length}/3)</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-medium text-green-900 mb-3">Was Sie erwartet:</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              <span>Automatische Farb- und Belichtungskorrektur</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              <span>Professionelle Bildoptimierung</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              <span>Sofortiger Download in hoher Qualität</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Zurück
        </Button>
        <div className="space-x-3">
          <Button variant="outline" onClick={nextStep}>
            Später testen
          </Button>
          <Button onClick={nextStep} disabled={uploadedFiles.length === 0}>
            {uploadedFiles.length > 0 ? 'Bilder bearbeiten' : 'Bilder hochladen'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickStartStep;
