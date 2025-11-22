import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
  isLoading: false,
  aiSuggestion: null,
  aiField: null,
  showAIModal: false,
  isSubmitting: false,
  submissionError: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAISuggestion: (state, action) => {
      state.aiSuggestion = action.payload.text;
      state.aiField = action.payload.field;
      state.showAIModal = true;
    },
    closeAIModal: (state) => {
      state.showAIModal = false;
      state.aiSuggestion = null;
      state.aiField = null;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setSubmissionError: (state, action) => {
      state.submissionError = action.payload;
    },
    resetSubmissionState: (state) => {
      state.isSubmitting = false;
      state.submissionError = null;
    },
  },
});

export const { 
  setLanguage, 
  setLoading, 
  setAISuggestion, 
  closeAIModal,
  setSubmitting,
  setSubmissionError,
  resetSubmissionState,
} = uiSlice.actions;
export default uiSlice.reducer;

