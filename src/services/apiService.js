import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

export const submitApplication = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/applications`,
      {
        personalInfo: formData.step1,
        familyFinancial: formData.step2,
        situationDescriptions: formData.step3,
        submittedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return {
      success: true,
      data: response.data,
      message: 'Application submitted successfully',
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('timeout');
    }
    
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        throw new Error('validation_error');
      } else if (status === 401) {
        throw new Error('unauthorized');
      } else if (status === 500) {
        throw new Error('server_error');
      } else {
        throw new Error(`api_error: ${status}`);
      }
    }
    
    if (error.request) {
      throw new Error('network_error');
    }
    
    throw new Error('unknown_error');
  }
};

export const submitApplicationMock = async (formData) => {
  const delay = Math.random() * 1000 + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (Math.random() < 0.05) {
    throw new Error('server_error');
  }

  const applicationId = `APP-${Date.now()}`;
  const response = {
    success: true,
    data: {
      applicationId: applicationId,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      message: 'Your application has been received and is under review.',
    },
    message: 'Application submitted successfully',
  };
  
  return response;
};

