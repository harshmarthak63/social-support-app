import React, { useState } from 'react';
import { Box, TextField, Grid, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { setLoading, setAISuggestion } from '../../store/slices/uiSlice';
import { generateAISuggestion } from '../../services/openaiService';
import { generateMistralSuggestion } from '../../services/mistralService';

function Step3SituationDescriptions({ register, errors, setValue, watch }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loadingField, setLoadingField] = useState(null);

  const fields = [
    {
      name: 'currentFinancialSituation',
      label: t('form.fields.currentFinancialSituation'),
      rows: 6,
    },
    {
      name: 'employmentCircumstances',
      label: t('form.fields.employmentCircumstances'),
      rows: 6,
    },
    {
      name: 'reasonForApplying',
      label: t('form.fields.reasonForApplying'),
      rows: 6,
    },
  ];

  const handleAIHelp = async (fieldName) => {
    setLoadingField(fieldName);
    dispatch(setLoading(true));

    const formData = {
      employmentStatus: watch('employmentStatus'),
      monthlyIncome: watch('monthlyIncome'),
      housingStatus: watch('housingStatus'),
      maritalStatus: watch('maritalStatus'),
      dependents: watch('dependents'),
    };

    const context = `Employment Status: ${formData.employmentStatus || 'Not specified'}, Monthly Income: $${formData.monthlyIncome || 0}, Housing: ${formData.housingStatus || 'Not specified'}, Marital Status: ${formData.maritalStatus || 'Not specified'}, Dependents: ${formData.dependents || 0}`;

    let suggestion = null;
    let mistralError = null;
    let openAIError = null;

    try {
      suggestion = await generateMistralSuggestion(fieldName, context);
      dispatch(setAISuggestion({ field: fieldName, text: suggestion }));
    } catch (mistralErr) {
      console.error('Mistral AI error:', mistralErr);
      mistralError = mistralErr;
      
      try {
        suggestion = await generateAISuggestion(fieldName, context);
        dispatch(setAISuggestion({ field: fieldName, text: suggestion }));
      } catch (openAIErr) {
        console.error('OpenAI error:', openAIErr);
        openAIError = openAIErr;
        
        let errorMessage = t('ai.error') || 'Unable to generate AI suggestion.';
        
        if (mistralError && openAIError) {
          const mistralMessage = mistralError.message || 'Unknown error';
          const openAIMessage = openAIError.message || 'Unknown error';
          
          if (mistralError.message === 'api_key_missing' && openAIError.message === 'api_key_missing') {
            errorMessage = 'Both Mistral AI and OpenAI API keys are not configured. Please set VITE_MISTRAL_API_KEY or VITE_OPENAI_API_KEY in your .env file and restart the server.';
          } else if (mistralError.message === 'rate_limit' || mistralError.message === 'rate_limit_exceeded') {
            if (openAIError.message === 'rate_limit' || openAIError.message === 'rate_limit_exceeded') {
              errorMessage = 'Rate limit exceeded for both Mistral AI and OpenAI. Please wait a few minutes before trying again.';
            } else {
              errorMessage = `Mistral AI rate limit exceeded. OpenAI also failed: ${openAIMessage}. Please try again later.`;
            }
          } else {
            errorMessage = `Both AI services failed. Mistral AI: ${mistralMessage}. OpenAI: ${openAIMessage}. Please try again later.`;
          }
        }
        
        alert(errorMessage);
      }
    } finally {
      setLoadingField(null);
      dispatch(setLoading(false));
    }
  };

  const language = useSelector((state) => state.ui.language);
  const isRTL = language === 'ar';

  return (
    <Box>
      <Grid container spacing={3}>
        {fields.map((field) => (
          <Grid item xs={12} key={field.name}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={field.rows}
                label={field.label}
                value={watch(field.name) || ''}
                {...register(field.name, {
                  required: t('validation.required'),
                })}
                InputLabelProps={{
                  shrink: !!watch(field.name),
                }}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                aria-required="true"
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: `${field.rows * 24}px`,
                  },
                  order: isRTL ? 2 : 1,
                }}
              />
              <Box
                sx={{
                  order: isRTL ? 1 : 2,
                  mt: { xs: 1, sm: 1 },
                  alignSelf: { xs: 'stretch', sm: 'flex-start' },
                }}
              >
                <Button
                  onClick={() => handleAIHelp(field.name)}
                  disabled={loadingField === field.name}
                  startIcon={<AutoAwesomeIcon sx={{ fontSize: 18 }} />}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderWidth: 1.5,
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    minWidth: 120,
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    '&:hover': {
                      borderColor: '#7c3aed',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: '#ffffff',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                      borderWidth: 1.5,
                    },
                    '&:disabled': {
                      borderColor: '#cbd5e1',
                      color: '#94a3b8',
                      background: '#f1f5f9',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                  aria-label={t('ai.helpMeWrite')}
                >
                  {loadingField === field.name ? (t('ai.generating') || 'Generating...') : t('ai.helpMeWrite')}
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Step3SituationDescriptions;

