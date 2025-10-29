import React from 'react';
import { DownloadIcon, CloseIcon, LoadingIcon } from './icons';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string | null;
  prompt: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageData, prompt }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${imageData}`;
    link.download = 'voicecraft_image.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-transform scale-95 animate-scale-in border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="image-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">الصورة المولدة</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>
        <main className="p-6 flex-grow overflow-y-auto">
            <div className="aspect-square bg-slate-100 dark:bg-slate-900/50 rounded-lg flex justify-center items-center mb-4">
                {imageData ? (
                     <img 
                        src={`data:image/jpeg;base64,${imageData}`} 
                        alt={prompt} 
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400">
                        <LoadingIcon className="w-12 h-12 animate-spin mx-auto mb-2" />
                        <p>جاري التحميل...</p>
                    </div>
                )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                <span className="font-bold">النص المستخدم:</span> {prompt}
            </p>
        </main>
        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
             <p className="text-sm text-slate-500 dark:text-slate-400">
                <strong>نصيحة:</strong> يمكنك تحميل الصورة أو إغلاق النافذة.
            </p>
            <button
              onClick={handleDownload}
              disabled={!imageData}
              className="flex items-center justify-center gap-2 text-white font-bold py-2 px-4 rounded-lg bg-brand-orange hover:bg-brand-orange-dark transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>تحميل</span>
            </button>
        </footer>
      </div>
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ImageModal;