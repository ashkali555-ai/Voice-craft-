import React, { useState } from 'react';
import { ChevronDownIcon, VoiceLibraryIcon, SmartWriterIcon, AudioControlIcon, ImageIcon, UIIcon } from './icons';

const featureData = [
  {
    title: 'مكتبة أصوات احترافية ومتنوعة',
    icon: VoiceLibraryIcon,
    content: `اكتشف عالمًا من الأصوات مع VoiceCraft. نوفر لك مكتبة واسعة من الأصوات البشرية الواقعية التي تم تصميمها باستخدام أحدث تقنيات الذكاء الاصطناعي. سواء كنت تحتاج إلى صوت رجل، امرأة، أو حتى طفل، ستجد الشخصية الصوتية المثالية لمشروعك. كل صوت مصمم بخصائص فريدة ليناسب مختلف الاستخدامات، بدءًا من التعليق الصوتي الاحترافي للأفلام الوثائقية والإعلانات، مرورًا بالكتب المسموعة والبودكاست، وانتهاءً بمحتوى الأطفال التعليمي والرسوم المتحركة. اختر من بين أصوات مثل "المعلق الوثائقي" الرصين، "مقدمة الأخبار" الموثوقة، أو "الجدة الحنونة" لإضفاء لمسة دافئة على قصصك.`,
    keywords: ['تعليق صوتي', 'أصوات بشرية', 'ذكاء اصطناعي', 'كتب مسموعة', 'بودكاست']
  },
  {
    title: 'الكاتب الذكي وتوليد المحتوى',
    icon: SmartWriterIcon,
    content: `هل تواجه صعوبة في كتابة النصوص؟ دع "الكاتب الذكي" في VoiceCraft يقوم بالعمل الشاق نيابة عنك. ما عليك سوى إدخال موضوع، وسيقوم الذكاء الاصطناعي بكتابة مقال شامل، منظم، وجذاب بأسلوب يحاكي الكتابة البشرية. هذه الميزة مثالية لمنشئي المحتوى والمسوقين الذين يحتاجون إلى نصوص عالية الجودة بسرعة. بالإضافة إلى ذلك، يمكنك استخدام أداة "تحسين النص" المدمجة لتحويل أي نص عادي إلى سيناريو صوتي احترافي. تقوم الأداة بتصحيح الأخطاء، وضبط علامات الترقيم، وتحسين بنية الجمل لجعلها أكثر طبيعية ووضوحًا عند النطق، مما يضمن أفضل أداء صوتي ممكن.`,
    keywords: ['كتابة مقالات', 'توليد محتوى', 'SEO', 'تحسين النصوص', 'محتوى إبداعي']
  },
  {
    title: 'استوديو متكامل للتحكم في الصوت',
    icon: AudioControlIcon,
    content: `يمنحك VoiceCraft تحكمًا كاملاً في إخراج الصوت، تمامًا كما في استوديو احترافي. استخدم ميزة "النبرة الاحترافية" لتوجيه الذكاء الاصطناعي لأداء النص بأسلوب معين، مثل نبرة "مذيع الأخبار" الجادة، أو "الأداء الدرامي" المليء بالمشاعر، أو حتى نبرة "الإعلان التجاري" الحماسية. بالإضافة إلى ذلك، يمكنك تعديل "سرعة النطق" بدقة لتتناسب مع وتيرة الفيديو أو التأثير المطلوب. هذه الأدوات المتقدمة تتيح لك تخصيص كل جانب من جوانب التعليق الصوتي لإنتاج مقاطع صوتية فريدة وعالية الجودة تعبر عن رسالتك بدقة.`,
    keywords: ['هندسة صوتية', 'نبرة الصوت', 'سرعة الكلام', 'تحكم صوتي', 'استوديو صوت']
  },
  {
    title: 'تحويل كلماتك إلى فن: توليد الصور',
    icon: ImageIcon,
    content: `لماذا تكتفي بالصوت فقط؟ مع VoiceCraft، يمكنك تحويل نصوصك إلى صور فنية مذهلة بضغطة زر. تستخدم أداتنا لتوليد الصور بالذكاء الاصطناعي أحدث النماذج لفهم النص الخاص بك وإنشاء صورة فريدة تعبر عنه بصريًا. هذه الميزة القوية مثالية لإنشاء صور مصغرة لمقاطع الفيديو، أو منشورات لوسائل التواصل الاجتماعي، أو ببساطة لإضافة بعد بصري إلى قصصك الصوتية. حول أفكارك إلى حقيقة مرئية وعزز تأثير المحتوى الخاص بك بسهولة وكفاءة.`,
    keywords: ['توليد الصور', 'نص إلى صورة', 'فن الذكاء الاصطناعي', 'تصميم جرافيك', 'مرئيات']
  },
  {
    title: 'تصميم بديهي وتجربة مستخدم سلسة',
    icon: UIIcon,
    content: `تم تصميم VoiceCraft مع الأخذ في الاعتبار البساطة وسهولة الاستخدام. تتميز واجهتنا بتصميم نظيف ومنظم، مع دعم كامل للغة العربية والاتجاه من اليمين إلى اليسار (RTL) لتوفير تجربة طبيعية للمستخدمين الناطقين بالعربية. يمكنك التنقل بسهولة بين محرر النصوص، والكاتب الذكي، وأدوات التحكم في الصوت. كما يدعم التطبيق الوضع الليلي (Dark Mode) لراحة عينيك أثناء العمل في بيئات منخفضة الإضاءة. كل شيء مصمم لتبسيط سير عملك، من كتابة النص الأول وحتى تحميل ملف الصوت النهائي بصيغة WAV عالية الجودة.`,
    keywords: ['واجهة مستخدم', 'تجربة مستخدم', 'سهولة الاستخدام', 'دعم اللغة العربية', 'الوضع الليلي']
  },
];


const FeatureItem: React.FC<{ feature: any; isOpen: boolean; onClick: () => void; }> = ({ feature, isOpen, onClick }) => (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <h2>
        <button
          onClick={onClick}
          aria-expanded={isOpen}
          className="flex justify-between items-center w-full text-right py-5 px-6 text-lg font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none focus-visible:ring focus-visible:ring-brand-orange"
        >
          <span className="flex items-center gap-4">
            <feature.icon className="w-6 h-6 text-brand-orange" />
            {feature.title}
          </span>
          <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </h2>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <div className="p-6 pt-0">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.content}</p>
                 <div className="mt-4 flex flex-wrap gap-2">
                    {feature.keywords.map((keyword: string) => (
                        <span key={keyword} className="text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 px-2.5 py-1 rounded-full">
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
);

const Features: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-screen-2xl mx-auto mt-12 lg:mt-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">أطلق العنان لقوة الصوت والمحتوى</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                    VoiceCraft هو أكثر من مجرد أداة لتحويل النص إلى كلام، إنه استوديو إبداعي متكامل. اكتشف كيف يمكن لميزاتنا المتقدمة أن تحدث ثورة في طريقة إنشائك للمحتوى.
                </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {featureData.map((feature, index) => (
                    <FeatureItem
                        key={index}
                        feature={feature}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Features;
