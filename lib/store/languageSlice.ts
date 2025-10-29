import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'es';

interface LanguageState {
  language: Language;
}

// Get language from localStorage or default to English
const getStoredLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('app-language');
    if (stored === 'en' || stored === 'es') {
      return stored;
    }
  }
  return 'en';
};

const initialState: LanguageState = {
  language: getStoredLanguage(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('app-language', action.payload);
      }
    },
    initializeLanguage: (state) => {
      state.language = getStoredLanguage();
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
