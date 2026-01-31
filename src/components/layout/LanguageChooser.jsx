import { useLanguage } from '@/contexts/LanguageContext';
import { GOV_SAFFRON, GOV_NAVY } from '@/lib/designTokens';

export default function LanguageChooser() {
  const { langChosen, setLang, t } = useLanguage();

  if (langChosen) return null;

  return (
    <div
      className="fixed inset-0 z-[99998] flex flex-col items-center justify-center p-6"
      style={{
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.98) 100%), url(/ncis-tricolour-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center max-w-md">
        <p className="text-xl font-bold text-gray-800 mb-2">भाषा निवडा / {t('chooseLanguageTitle')}</p>
        <p className="text-base font-semibold text-gray-600 mb-8">
          {t('selectPreferredLanguage')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => setLang('en')}
            className="px-8 py-4 rounded-lg font-bold text-lg text-white shadow-lg hover:opacity-95 transition-opacity"
            style={{ background: GOV_NAVY }}
          >
            {t('english')}
          </button>
          <button
            type="button"
            onClick={() => setLang('mr')}
            className="px-8 py-4 rounded-lg font-bold text-lg text-white shadow-lg hover:opacity-95 transition-opacity"
            style={{ background: GOV_SAFFRON }}
          >
            {t('marathi')}
          </button>
        </div>
      </div>
    </div>
  );
}
