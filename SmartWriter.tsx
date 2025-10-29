import React from 'react';
import { PenIcon, LoadingIcon, SparkleIcon, LightbulbIcon } from './icons';

interface SmartWriterProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  article: string | null;
  onUseText: (text: string) => void;
  activeTip: string | null;
}

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


const SmartWriter: React.FC<SmartWriterProps> = ({
  topic,
  onTopicChange,
  onGenerate,
  isLoading,
  article,
  onUseText,
  activeTip,
}) => {
  return (
    <div className="p-4 sm:p-6 flex-grow flex flex-col">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="أدخل موضوع المقال هنا..."
          dir="auto"
          className="w-full flex-grow p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition text-base"
        />
        <button
          onClick={onGenerate}
          disabled={isLoading || !topic.trim()}
          className="flex-shrink-0 flex items-center justify-center gap-3 text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-brand-orange to-orange-500 hover:from-brand-orange-dark hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-slate-400 disabled:from-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingIcon className="w-5 h-5 animate-spin" />
              <span>جاري الكتابة...</span>
            </>
          ) : (
             <>
              <PenIcon className="w-5 h-5" />
              <span>اكتب المقال</span>
            </>
          )}
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 overflow-y-auto h-[450px] bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
        {isLoading && !article && (
            <div className="flex justify-center items-center h-full text-slate-500 dark:text-slate-400">
                <LoadingIcon className="w-8 h-8 animate-spin" />
            </div>
        )}
        {article ? (
            <div dir="auto" className="text-slate-800 dark:text-slate-200 text-right leading-relaxed whitespace-pre-wrap">
                {article}
            </div>
        ) : (
            !isLoading && <p className="text-center text-slate-500 dark:text-slate-400">سيظهر المقال الذي تم إنشاؤه هنا.</p>
        )}
      </div>

      {activeTip === 'generate_article_success' && (
        <TipBox message="تم إنشاء المقال بنجاح! نصيحة: اضغط على 'استخدم هذا النص' لنقله إلى محرر الصوت والبدء في تسجيل التعليق الصوتي." />
      )}

      {article && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
           <button
              onClick={() => onUseText(article)}
              className="w-full flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors duration-300"
            >
              <SparkleIcon className="w-5 h-5" />
              <span>استخدم هذا النص للتعليق الصوتي</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default SmartWriter;