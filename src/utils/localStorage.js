const STORAGE_KEY = 'socialSupportFormData';

export const saveFormData = (formData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  } catch (error) {
  }
};

