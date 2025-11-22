import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step1: {
    name: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  },
  step2: {
    maritalStatus: '',
    dependents: '',
    employmentStatus: '',
    monthlyIncome: '',
    housingStatus: '',
  },
  step3: {
    currentFinancialSituation: '',
    employmentCircumstances: '',
    reasonForApplying: '',
  },
  currentStep: 1,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateStep1: (state, action) => {
      state.step1 = { ...state.step1, ...action.payload };
    },
    updateStep2: (state, action) => {
      state.step2 = { ...state.step2, ...action.payload };
    },
    updateStep3: (state, action) => {
      state.step3 = { ...state.step3, ...action.payload };
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { updateStep1, updateStep2, updateStep3, setCurrentStep, resetForm } = formSlice.actions;
export default formSlice.reducer;

