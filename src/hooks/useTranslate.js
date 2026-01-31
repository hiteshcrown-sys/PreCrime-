import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

export const useTranslate = () => {
    const { language } = useLanguage();

    const t = (key) => {
        if (!translations[language]) return key;

        const translation = translations[language][key];
        if (translation) return translation;

        // Fallback to English
        if (language !== 'en' && translations.en[key]) {
            return translations.en[key];
        }

        return key;
    };

    return { t };
};
