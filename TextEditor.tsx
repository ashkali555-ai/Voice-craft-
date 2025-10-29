import React from 'react';
import { PlayIcon, PauseIcon, DownloadIcon, LoadingIcon, SparkleIcon, ImageIcon, LightbulbIcon } from './icons';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  onGenerate: () => void;
  onImproveText: () => void;
  onGenerateImage: () => void;
  isLoading: boolean;
  isImprovingText: boolean;
  isGeneratingImage: boolean;
  audioData: string | null;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onDownload: () => void;
  duration: number;
  currentTime: number;
  activeTip: string | null;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TipBox: React.FC<{ message: string }> = ({ message }) => (
  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-500/10 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-lg" role="alert">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <LightbulbIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
      </div>
      <div className="text-sm text-yellow-800 dark:text-yellow-200">{message}</div>
    </div>
  </div>
);

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onTextChange,
  onGenerate,
  onImproveText,
  onGenerateImage,
  isLoading,
  isImprovingText,
  isGeneratingImage,
  audioData,
  isPlaying,
  onPlay,
  onDownload,
  duration,
  currentTime,
  activeTip
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="p-4 sm:p-6 flex-grow flex flex-col">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">محرر النص</h2>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="اكتب النص هنا..."
        dir="auto"
        className="w-full flex-grow p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition resize-none min-h-[250px] text-base"
      />
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        {audioData && (
          <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-4">
               <button
                  onClick={onPlay}
                  className="p-3 rounded-full bg-brand-orange text-white hover:bg-brand-orange-dark transition-transform duration-200 active:scale-95 disabled:bg-slate-400"
                  disabled={!audioData}
                >
                  {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
                </button>
                <div className="flex-grow flex items-center gap-3">
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{formatTime(currentTime)}</span>
                    <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-brand-orange h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{formatTime(duration)}</span>
                </div>
                <button
                  onClick={onDownload}
                  className="p-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  disabled={!audioData}
                  aria-label="Download audio"
                >
                  <DownloadIcon className="w-5 h-5"/>
                </button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={onGenerate}
              disabled={isLoading || isImprovingText || isGeneratingImage}
              className="w-full flex-1 flex items-center justify-center gap-3 text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-brand-orange to-orange-500 hover:from-brand-orange-dark hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:from-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingIcon className="w-5 h-5 animate-spin" />
                  <span>جاري التوليد...</span>
                </>
              ) : (
                <span>توليد الصوت</span>
              )}
            </button>
            <button
              onClick={onGenerateImage}
              disabled={isLoading || isImprovingText || isGeneratingImage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
            >
              {isGeneratingImage ? (
                 <>
                  <LoadingIcon className="w-5 h-5 animate-spin" />
                  <span>جاري التوليد...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  <span>توليد صورة</span>
                </>
              )}
            </button>
            <button
              onClick={onImproveText}
              disabled={isLoading || isImprovingText || isGeneratingImage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
            >
              {isImprovingText ? (
                 <>
                  <LoadingIcon className="w-5 h-5 animate-spin" />
                  <span>جاري التحسين...</span>
                </>
              ) : (
                <>
                  <SparkleIcon className="w-5 h-5" />
                  <span>تحسين النص</span>
                </>
              )}
            </button>
        </div>
         {activeTip === 'improve_text_success' && (
          <TipBox message="تم تحسين النص بنجاح! نصيحة: يمكنك الآن توليد الصوت أو إنشاء صورة بناءً على النص الجديد." />
        )}
        {activeTip === 'generate_audio_success' && (
          <TipBox message="تم توليد الصوت بنجاح! نصيحة: استمع إلى المقطع الصوتي، وإذا أعجبك، يمكنك تنزيله مباشرة." />
        )}
      </div>
    </div>
  );
};

export default TextEditor;