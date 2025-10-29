import { useAppSelector } from './redux';
import { translations, TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const language = useAppSelector((state) => state.language.language);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t, language };
}
