import React, { useState } from 'react';
import { Box, TextField, Grid, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
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

  const handleAIHelp = async (fieldName, provider = 'openai') => {
    setLoadingField(`${fieldName}-${provider}`);
    dispatch(setLoading(true));

    try {
      const formData = {
        employmentStatus: watch('employmentStatus'),
        monthlyIncome: watch('monthlyIncome'),
        housingStatus: watch('housingStatus'),
        maritalStatus: watch('maritalStatus'),
        dependents: watch('dependents'),
      };

      const context = `Employment Status: ${formData.employmentStatus || 'Not specified'}, Monthly Income: $${formData.monthlyIncome || 0}, Housing: ${formData.housingStatus || 'Not specified'}, Marital Status: ${formData.maritalStatus || 'Not specified'}, Dependents: ${formData.dependents || 0}`;

      const suggestion = provider === 'mistral' 
        ? await generateMistralSuggestion(fieldName, context)
        : await generateAISuggestion(fieldName, context);
      
      dispatch(setAISuggestion({ field: fieldName, text: suggestion }));
    } catch (error) {
      console.error(`Error generating ${provider} AI suggestion:`, error);
      
      let errorMessage = t('ai.error');
      const providerName = provider === 'mistral' ? 'Mistral AI' : 'OpenAI';
      
      switch (error.message) {
        case 'timeout':
          errorMessage = t('ai.timeout');
          break;
        case 'api_key_missing':
          errorMessage = `${providerName} API key is not configured. Please set VITE_${provider === 'mistral' ? 'MISTRAL' : 'OPENAI'}_API_KEY in your .env file and restart the server.`;
          break;
        case 'api_key_invalid':
          errorMessage = `Invalid ${providerName} API key. Please check your API key in the .env file.`;
          break;
        case 'rate_limit':
        case 'rate_limit_exceeded':
          errorMessage = `Rate limit exceeded. You have made too many requests. Please wait a few minutes before trying again, or check your ${providerName} account for usage limits.`;
          break;
        case 'network_error':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
        case 'server_error':
          errorMessage = `${providerName} server error. Please try again later.`;
          break;
        case 'service_unavailable':
          errorMessage = `${providerName} service is temporarily unavailable. Please try again in a few moments.`;
          break;
        default:
          if (error.message.startsWith('api_error:')) {
            errorMessage = `API Error: ${error.message.split(':')[1]}`;
          } else {
            errorMessage = `Error: ${error.message || t('ai.error')}`;
          }
      }
      
      alert(errorMessage);
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
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'row' },
                  gap: 1,
                  order: isRTL ? 1 : 2,
                  mt: { xs: 0, sm: 1 },
                  alignItems: 'center',
                }}
              >
                <Tooltip 
                  title={loadingField === `${field.name}-openai` ? t('ai.generating') : t('ai.helpMeWrite')}
                  arrow
                  placement="top"
                >
                  <span>
                    <IconButton
                      onClick={() => handleAIHelp(field.name, 'openai')}
                      disabled={loadingField === `${field.name}-openai` || loadingField === `${field.name}-mistral`}
                      sx={{
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderColor: '#8b5cf6',
                        color: '#8b5cf6',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        width: 40,
                        height: 40,
                        '&:hover': {
                          borderColor: '#7c3aed',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          color: '#ffffff',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
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
                      <AutoAwesomeIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip 
                  title={loadingField === `${field.name}-mistral` ? t('ai.generating') : t('ai.helpMeWriteMistral')}
                  arrow
                  placement="top"
                >
                  <span>
                    <IconButton
                      onClick={() => handleAIHelp(field.name, 'mistral')}
                      disabled={loadingField === `${field.name}-mistral` || loadingField === `${field.name}-openai`}
                      sx={{
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderColor: '#f59e0b',
                        color: '#f59e0b',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.1) 100%)',
                        width: 40,
                        height: 40,
                        '&:hover': {
                          borderColor: '#d97706',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#ffffff',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                        },
                        '&:disabled': {
                          borderColor: '#cbd5e1',
                          color: '#94a3b8',
                          background: '#f1f5f9',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                      aria-label={t('ai.helpMeWriteMistral')}
                    >
                      <PsychologyIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Step3SituationDescriptions;

