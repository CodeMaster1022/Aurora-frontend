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

// Always default to English for initial state (to avoid hydration mismatch)
// Language will be initialized from localStorage after client-side hydration
const initialState: LanguageState = {
  language: 'en',
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
