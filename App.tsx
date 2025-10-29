import React, { useState, useCallback, useEffect } from 'react';
import { Voice, AudioConfig } from './types';
import Header from './components/Header';
import VoiceSelector from './components/VoiceSelector';
import TextEditor from './components/TextEditor';
import ControlsPanel from './components/ControlsPanel';
import { generateSpeech, improveTextForSpeech, generateImage, generateArticle } from './services/geminiService';
import { VOICES, TONES } from './constants';
import useAudioPlayer from './hooks/useAudioPlayer';
import ImageModal from './components/ImageModal';
import SmartWriter from './components/SmartWriter';
import { PenIcon, SoundWaveIcon } from './components/icons';
import Features from './components/Features';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [text, setText] = useState('مرحباً بك في VoiceCraft. اكتب النص هنا لتوليد الصوت.');
  const [selectedVoice, setSelectedVoice] = useState<Voice>(VOICES[0]);
  const [audioConfig, setAudioConfig] = useState<AudioConfig>({ speed: 1.0, toneId: 'neutral' });
  const [isLoading, setIsLoading] = useState(false);
  const [isImprovingText, setIsImprovingText] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'editor' | 'writer'>('editor');
  const [articleTopic, setArticleTopic] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState<string | null>(null);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const { audioData, isPlaying, play, stop, download, setAudioData, duration, currentTime } = useAudioPlayer();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleImproveText = useCallback(async () => {
    if (!text.trim()) {
        setError('لا يمكن تحسين نص فارغ.');
        return;
    }
    setActiveTip(null);
    setIsImprovingText(true);
    setError(null);
    try {
        const improvedText = await improveTextForSpeech(text);
        setText(improvedText);
        setActiveTip('improve_text_success');
    } catch (err: any) {
        console.error('Error improving text:', err);
        setError('حدث خطأ أثناء تحسين النص.');
    } finally {
        setIsImprovingText(false);
    }
  }, [text]);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setError('لا يمكن توليد صوت من نص فارغ.');
      return;
    }
    setActiveTip(null);
    setIsLoading(true);
    setError(null);
    setAudioData(null);
    stop();

    try {
      const selectedTone = TONES.find(t => t.id === audioConfig.toneId);
      const tonePrompt = selectedTone?.prompt;
      const modifiedText = tonePrompt ? `${tonePrompt}: ${text}` : text;

      const generatedAudio = await generateSpeech(modifiedText, selectedVoice.apiName);
      setAudioData(generatedAudio);
      setActiveTip('generate_audio_success');
    } catch (err: any) {
      console.error('Error generating speech:', err);
      setError('حدث خطأ أثناء توليد الصوت. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [text, selectedVoice, audioConfig, setAudioData, stop]);
  
  const handleGenerateImage = useCallback(async () => {
    if (!text.trim()) {
      setError('لا يمكن توليد صورة من نص فارغ.');
      return;
    }
    setActiveTip(null);
    setIsGeneratingImage(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageData = await generateImage(text);
      setGeneratedImage(imageData);
      setIsImageModalOpen(true);
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError('حدث خطأ أثناء توليد الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingImage(false);
    }
  }, [text]);

  const handleGenerateArticle = useCallback(async () => {
    if (!articleTopic.trim()) {
        setError('الرجاء إدخال موضوع للمقال.');
        return;
    }
    setActiveTip(null);
    setIsGeneratingArticle(true);
    setError(null);
    setGeneratedArticle(null);

    try {
        const article = await generateArticle(articleTopic);
        setGeneratedArticle(article);
        setActiveTip('generate_article_success');
    } catch (err: any) {
        console.error('Error generating article:', err);
        setError('حدث خطأ أثناء إنشاء المقال.');
    } finally {
        setIsGeneratingArticle(false);
    }
  }, [articleTopic]);

  const handleUseArticleText = useCallback((articleText: string) => {
    setText(articleText);
    setActiveTab('editor');
    setActiveTip(null);
  }, []);

  const tabBaseStyle = "flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-bold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-brand-orange";
  const activeTabStyle = "bg-white dark:bg-slate-800 text-brand-orange";
  const inactiveTabStyle = "bg-slate-100 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/60";


  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-screen-2xl mx-auto">
          
          <div className="lg:col-span-3">
            <VoiceSelector
              voices={VOICES}
              selectedVoice={selectedVoice}
              onSelectVoice={setSelectedVoice}
            />
          </div>

          <div className="lg:col-span-6">
             <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-t-4 border-t-brand-orange overflow-hidden">
                <div className="flex">
                    <button 
                        className={`${tabBaseStyle} ${activeTab === 'editor' ? activeTabStyle : inactiveTabStyle}`}
                        onClick={() => setActiveTab('editor')}
                        role="tab"
                        aria-selected={activeTab === 'editor'}
                    >
                        <SoundWaveIcon className="w-5 h-5"/>
                        محرر الصوت
                    </button>
                    <button 
                        className={`${tabBaseStyle} ${activeTab === 'writer' ? activeTabStyle : inactiveTabStyle}`}
                        onClick={() => setActiveTab('writer')}
                        role="tab"
                        aria-selected={activeTab === 'writer'}
                    >
                        <PenIcon className="w-5 h-5"/>
                        الكاتب الذكي
                    </button>
                </div>
                <div className="flex-grow flex flex-col">
                    {activeTab === 'editor' ? (
                        <TextEditor
                        text={text}
                        onTextChange={setText}
                        onGenerate={handleGenerate}
                        onImproveText={handleImproveText}
                        onGenerateImage={handleGenerateImage}
                        isLoading={isLoading}
                        isImprovingText={isImprovingText}
                        isGeneratingImage={isGeneratingImage}
                        audioData={audioData}
                        isPlaying={isPlaying}
                        onPlay={() => play(audioConfig.speed)}
                        onStop={stop}
                        onDownload={download}
                        duration={duration}
                        currentTime={currentTime}
                        activeTip={activeTip}
                        />
                    ) : (
                        <SmartWriter
                            topic={articleTopic}
                            onTopicChange={setArticleTopic}
                            onGenerate={handleGenerateArticle}
                            isLoading={isGeneratingArticle}
                            article={generatedArticle}
                            onUseText={handleUseArticleText}
                            activeTip={activeTip}
                        />
                    )}
                </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <ControlsPanel
              config={audioConfig}
              onConfigChange={setAudioConfig}
            />
          </div>
        </div>
        
        <Features />

        {error && (
          <div 
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-brand-burnt-red text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out"
            onAnimationEnd={() => setError(null)}
            >
            {error}
          </div>
        )}
      </main>
      <ImageModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageData={generatedImage}
        prompt={text}
      />
      <footer className="py-6 px-8 text-center text-sm text-slate-600 dark:text-slate-400">
        جميع الحقوق محفوظة لمطور الموقع{' '}
        <a
          href="https://www.facebook.com/share/1BGPCvaJYb/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-orange hover:underline"
        >
          Muhammad falih
        </a>
      </footer>
       <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
