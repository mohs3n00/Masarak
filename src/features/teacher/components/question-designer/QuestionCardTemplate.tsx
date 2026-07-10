import React, { forwardRef } from 'react';
import { Globe, Mail, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { AutoFitText } from './AutoFitText';
import { parsePlatformUrl } from '@/shared/utils/platform-parser';

export interface QuestionCardTemplateProps {
  question: string;
  options: string[];
  questionNumber: number | string;
  brandingConfig?: any[];
}

const iconMap: Record<string, React.ElementType> = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  YouTube: FaYoutube,
  Telegram: FaTelegram,
  WhatsApp: FaWhatsapp,
  Website: Globe,
  Email: Mail,
  Phone: Phone,
};

export const QuestionCardTemplate = forwardRef<HTMLDivElement, QuestionCardTemplateProps>(
  ({ question, options, questionNumber, brandingConfig = [] }, ref) => {
    const letterMap = ['أ', 'ب', 'ج', 'د'];
    
    // Filter platforms that should be shown in export, up to 4 to prevent crowding
    const exportPlatforms = brandingConfig.filter(c => c.showInExport).slice(0, 4);

    return (
      <div
        ref={ref}
        className="relative bg-white flex flex-col font-sans text-foreground"
        style={{
          width: '1080px',
          height: '1080px',
          direction: 'rtl',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Footer Graphic (Asset 1.svg) */}
        <img 
          src="/images/Asset 1.svg" 
          alt="" 
          className="absolute bottom-0 left-0 w-full h-[250px] object-cover object-bottom z-0 pointer-events-none opacity-90"
        />

        {/* Layout Container */}
        <div className="flex flex-col h-full p-16 z-10 w-full">
          
          {/* Header */}
          <div className="flex justify-between items-center shrink-0 mb-6">
            <div className="flex items-center gap-4">
              <img src="/logo/Asset 1.svg" alt="Masarak Logo" className="h-14 object-contain drop-shadow-sm" />
            </div>

            <div className="bg-white/80 backdrop-blur-md text-primary px-8 py-2.5 rounded-full flex items-center gap-3 shadow-sm border border-primary/10">
              <span className="text-xl font-bold">{questionNumber}</span>
              <span className="text-xl font-bold">سؤال</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-h-0 flex flex-col gap-6 overflow-hidden pb-24">
            
            {/* Question (Focal Point - Auto-sizing Container) */}
            <div className="w-full flex items-center justify-center shrink-0">
              <div 
                className="w-[96%] h-fit max-h-[450px] bg-white border border-primary/20 rounded-[2.5rem] px-10 py-8 shadow-sm flex items-center justify-center shrink-0"
              >
                <AutoFitText 
                  text={question || 'اكتب نص السؤال هنا...'} 
                  maxFontSize={2.8} 
                  minFontSize={1.4}
                  textClassName="font-bold text-foreground"
                />
              </div>
            </div>

            {/* Options List (Secondary Elements) */}
            <div className="flex-1 flex flex-col w-full justify-evenly pb-4 min-h-0">
              {options.map((opt, index) => (
                <div 
                  key={index}
                  className="w-full bg-white/95 backdrop-blur-sm border border-black/5 rounded-2xl p-6 flex items-center gap-5 shadow-sm shrink-0"
                >
                  <div className="w-[44px] h-[44px] shrink-0 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-inner">
                    {letterMap[index] || index + 1}
                  </div>
                  <div className="flex-1 h-full min-w-0">
                    <AutoFitText 
                      text={opt || `الاختيار ${index + 1}`} 
                      maxFontSize={2.5} 
                      minFontSize={1.2}
                      align="start"
                      textClassName="font-semibold text-foreground/90"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-16 left-16 right-16 flex justify-between items-center z-20">
            {exportPlatforms.map((config) => {
              const Icon = iconMap[config.platform] || Globe;
              const displayUrl = parsePlatformUrl(config.platform, config.url);
              
              return (
                <div key={config.platform} className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white shadow-sm">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base font-semibold text-foreground/80" dir="ltr">{displayUrl}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

QuestionCardTemplate.displayName = 'QuestionCardTemplate';
