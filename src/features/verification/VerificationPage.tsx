import React, { useState } from 'react';
import { RegistrationForm, User } from '../../shared/types';
import { authService } from '../../core/services/auth.service';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { FileUpload } from '../../shared/components/FileUpload';
import { Upload, Eye, FileCheck } from 'lucide-react';

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
      case 'processing': return 'Processing document…';
      case 'extracting': return 'Extracting details with OCR…';
      case 'verifying': return 'Verifying information…';
      default: return 'Upload your student ID';
    }
  };

  const getStepIcon = () => {
    switch (uploadStep) {
      case 'extracting': return <Eye className="h-7 w-7 text-violet-400" />;
      case 'processing':
      case 'verifying': return <FileCheck className="h-7 w-7 text-violet-400" />;
      default: return <Upload className="h-7 w-7 text-violet-400" />;
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

  const stepDone = (step: string) => {
    const order = ['processing', 'extracting', 'verifying'];
    const currentIdx = order.indexOf(uploadStep);
    const stepIdx = order.indexOf(step);
    return stepIdx < currentIdx;
  };

  const stepActive = (step: string) => uploadStep === step;

  return (
    <div className="w-[92%] max-w-sm mx-auto">
      <div className="bento-card p-5 sm:p-7 text-center">
        {/* Header icon */}
        <div className="mb-5">
          <div className="h-14 w-14 bg-violet-500/15 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {getStepIcon()}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100">
            Document Verification
          </h2>
          <p className="text-zinc-400 mt-1.5 text-sm">
            {draft.fullName} &bull; {draft.matricNumber}
          </p>
          <p className="text-xs text-zinc-500 mt-1">{getStepMessage()}</p>
        </div>

        {!isUploading ? (
          <div className="space-y-4">
            <FileUpload onFileSelect={setSelectedFile} />

            {selectedFile && (
              <button
                type="button"
                onClick={handleFileUpload}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all min-h-[44px] text-sm"
              >
                Verify Document
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Spinner */}
            <div className="flex items-center justify-center gap-2.5">
              <svg className="animate-spin h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-medium text-zinc-300">{getStepMessage()}</span>
            </div>

            {/* Progress steps */}
            <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50 space-y-2.5 text-left">
              {[
                { key: 'processing', label: 'Document uploaded' },
                { key: 'extracting', label: 'OCR text extraction' },
                { key: 'verifying', label: 'Information verification' },
              ].map(({ key, label }) => (
                <div key={key} className={`flex items-center gap-2 ${
                  stepActive(key) ? 'text-violet-400' : stepDone(key) ? 'text-emerald-400' : 'text-zinc-600'
                }`}>
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    stepActive(key) ? 'bg-violet-400 animate-pulse' : stepDone(key) ? 'bg-emerald-400' : 'bg-zinc-700'
                  }`} />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
