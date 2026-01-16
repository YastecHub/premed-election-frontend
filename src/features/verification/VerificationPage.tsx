import React, { useState } from 'react';
import { RegistrationForm, User } from '../../shared/types';
import { authService } from '../../core/services/auth.service';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { FileUpload } from '../../shared/components/FileUpload';
import { CloudArrowUpIcon, DocumentCheckIcon, EyeIcon } from '@heroicons/react/24/outline';

interface VerificationPageProps {
  draft: RegistrationForm;
  onVerified: (user: User) => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ draft, onVerified }) => {
  const { showError } = useNotification();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'processing' | 'extracting' | 'verifying'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getStepMessage = () => {
    switch (uploadStep) {
      case 'processing': return 'Processing document...';
      case 'extracting': return 'Extracting your details with OCR...';
      case 'verifying': return 'Verifying information...';
      default: return 'Upload your student ID';
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      setUploadStep('processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStep('extracting');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadStep('verifying');
      const formData = new FormData();
      formData.append('matricNumber', draft.matricNumber);
      formData.append('fullName', draft.fullName);
      formData.append('department', draft.department);
      formData.append('email', draft.email);
      formData.append('document', selectedFile);
      
      const user = await authService.registerWithVerification(formData);
      onVerified(user);
    } catch (error: any) {
      showError(error.message || 'Verification failed');
      setUploadStep('upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-8 text-center max-w-md mx-auto">
      <div className="mb-6">
        <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {uploadStep === 'upload' ? (
            <CloudArrowUpIcon className="h-8 w-8 text-white" />
          ) : uploadStep === 'extracting' ? (
            <EyeIcon className="h-8 w-8 text-white" />
          ) : (
            <DocumentCheckIcon className="h-8 w-8 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">Document Verification</h2>
        <p className="text-slate-600 mb-2">
          {draft.fullName} • {draft.matricNumber}
        </p>
        <p className="text-sm text-slate-500">{getStepMessage()}</p>
      </div>

      {!isUploading ? (
        <div className="space-y-4">
          <FileUpload onFileSelect={setSelectedFile} />
          
          {selectedFile && (
            <button
              onClick={handleFileUpload}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              Verify Document
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">{getStepMessage()}</span>
          </div>
          
          <div className="bg-slate-100 rounded-lg p-4 space-y-2">
            <div className={`flex items-center space-x-2 ${uploadStep === 'processing' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`h-2 w-2 rounded-full ${uploadStep === 'processing' ? 'bg-blue-600 animate-pulse' : 'bg-green-600'}`}></div>
              <span className="text-xs">Document uploaded</span>
            </div>
            <div className={`flex items-center space-x-2 ${uploadStep === 'extracting' ? 'text-blue-600' : uploadStep === 'verifying' ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`h-2 w-2 rounded-full ${uploadStep === 'extracting' ? 'bg-blue-600 animate-pulse' : uploadStep === 'verifying' ? 'bg-green-600' : 'bg-slate-300'}`}></div>
              <span className="text-xs">OCR text extraction</span>
            </div>
            <div className={`flex items-center space-x-2 ${uploadStep === 'verifying' ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`h-2 w-2 rounded-full ${uploadStep === 'verifying' ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`}></div>
              <span className="text-xs">Information verification</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};