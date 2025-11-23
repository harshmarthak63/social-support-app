import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

const getPromptForField = (fieldName, userContext = '') => {
  const prompts = {
    currentFinancialSituation: `I am applying for financial assistance. Help me describe my current financial situation in a clear and professional manner. ${userContext}`,
    employmentCircumstances: `I am applying for financial assistance. Help me describe my employment circumstances in a clear and professional manner. ${userContext}`,
    reasonForApplying: `I am applying for financial assistance. Help me write a clear and compelling reason for why I need this assistance. ${userContext}`,
  };

  return prompts[fieldName] || `Help me write a description for ${fieldName}. ${userContext}`;
};

export const generateAISuggestion = async (fieldName, userContext = '') => {
  if (!OPENAI_API_KEY) {
    throw new Error('api_key_missing');
  }

  const prompt = getPromptForField(fieldName, userContext);

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that helps people write clear, professional, and empathetic descriptions for social support applications.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('invalid_response');
    }

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('timeout');
    }
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        throw new Error('api_key_invalid');
      } else if (status === 429) {
        const errorMessage = data?.error?.message || '';
        if (errorMessage.includes('rate_limit_exceeded') || errorMessage.includes('quota')) {
          throw new Error('rate_limit_exceeded');
        }
        throw new Error('rate_limit');
      } else if (status === 500) {
        throw new Error('server_error');
      } else if (status === 503) {
        throw new Error('service_unavailable');
      } else {
        throw new Error(`api_error: ${status} - ${data?.error?.message || 'Unknown error'}`);
      }
    }
    
    if (error.request) {
      throw new Error('network_error');
    }
    
    throw new Error('unknown_error');
  }
};

