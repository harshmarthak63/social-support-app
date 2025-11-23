import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMediaQuery, useTheme } from '@mui/material';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Fade,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import Step1PersonalInfo from './steps/Step1PersonalInfo';
import Step2FamilyFinancial from './steps/Step2FamilyFinancial';
import Step3SituationDescriptions from './steps/Step3SituationDescriptions';
import AIModal from './AIModal';
import SubmissionModal from './SubmissionModal';
import { setCurrentStep, updateStep1, updateStep2, updateStep3, resetForm } from '../store/slices/formSlice';
import { setSubmitting, resetSubmissionState } from '../store/slices/uiSlice';
import { saveFormData } from '../utils/localStorage';
import { store } from '../store/store';
import { submitApplicationMock } from '../services/apiService';

const stepIcons = [
  <PersonIcon key="person" />,
  <FamilyRestroomIcon key="family" />,
  <DescriptionIcon key="description" />,
];

const CustomStepIcon = ({ active, completed, icon }) => {
  return (
    <Box
      sx={{
        width: { xs: 40, sm: 44, md: 48 },
        height: { xs: 40, sm: 44, md: 48 },
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: completed
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : active
          ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
          : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
        color: completed || active ? '#ffffff' : '#94a3b8',
        boxShadow: active
          ? '0 4px 12px rgba(37, 99, 235, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        transform: active ? { xs: 'scale(1.05)', sm: 'scale(1.1)' } : 'scale(1)',
        '& svg': {
          fontSize: { xs: 20, sm: 22, md: 24 },
        },
      }}
    >
      {completed ? <CheckCircleIcon /> : stepIcons[icon - 1]}
    </Box>
  );
};

function FormWizard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentStep = useSelector((state) => state.form.currentStep);
  const formData = useSelector((state) => state.form);
  const showAIModal = useSelector((state) => state.ui.showAIModal);
  const isLoading = useSelector((state) => state.ui.isLoading);
  const isSubmitting = useSelector((state) => state.ui.isSubmitting);
  const language = useSelector((state) => state.ui.language);
  const isRTL = language === 'ar';
  const isUpdatingFromRedux = useRef(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [submittedFormData, setSubmittedFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      ...formData.step1,
      ...formData.step2,
      ...formData.step3,
    },
  });

  useEffect(() => {
    const subscription = watch((data) => {
      if (isUpdatingFromRedux.current) {
        return;
      }

      const currentFormData = store.getState().form;
      let updatedFormData = { ...currentFormData };
      
      const currentStepData = currentStep === 1 
        ? currentFormData.step1 
        : currentStep === 2 
        ? currentFormData.step2 
        : currentFormData.step3;
      
      const hasChanges = Object.keys(data).some(key => {
        const currentValue = currentStepData[key] || '';
        const newValue = data[key] || '';
        return currentValue !== newValue;
      });

      if (hasChanges) {
        if (currentStep === 1) {
          updatedFormData.step1 = { ...updatedFormData.step1, ...data };
          dispatch(updateStep1(data));
        } else if (currentStep === 2) {
          updatedFormData.step2 = { ...updatedFormData.step2, ...data };
          dispatch(updateStep2(data));
        } else if (currentStep === 3) {
          updatedFormData.step3 = { ...updatedFormData.step3, ...data };
          dispatch(updateStep3(data));
        }
        saveFormData(updatedFormData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, currentStep, dispatch]);

  useEffect(() => {
    const currentFormData = store.getState().form;
    const stepData = currentStep === 1 ? currentFormData.step1 : currentStep === 2 ? currentFormData.step2 : currentFormData.step3;
    
    isUpdatingFromRedux.current = true;
    
    Object.keys(stepData).forEach((key) => {
      const currentValue = watch(key);
      const newValue = stepData[key];
      if (currentValue !== newValue) {
        setValue(key, newValue, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
      }
    });
    
    const timeoutId = setTimeout(() => {
      isUpdatingFromRedux.current = false;
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [currentStep, setValue, watch]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      dispatch(setCurrentStep(Math.min(currentStep + 1, 3)));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    dispatch(setCurrentStep(Math.max(currentStep - 1, 1)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data) => {
    dispatch(setSubmitting(true));
    dispatch(resetSubmissionState());
    
    try {
      const currentFormData = store.getState().form;
      const completeFormData = {
        personalInfo: currentFormData.step1,
        familyFinancial: currentFormData.step2,
        situationDescriptions: currentFormData.step3,
      };

      const response = await submitApplicationMock(completeFormData);
      
      if (response.success) {
        setTimeout(() => {
          setSubmissionData(response.data);
          setSubmittedFormData({ situationDescriptions: completeFormData.situationDescriptions });
          setShowSubmissionModal(true);
          dispatch(setSubmitting(false));
          dispatch(resetForm());
          localStorage.removeItem('socialSupportFormData');
          dispatch(resetSubmissionState());
        }, 500);
      }
    } catch (error) {
      let errorMessage = t('form.submitError') || 'Error submitting form. Please try again.';
      
      switch (error.message) {
        case 'timeout':
          errorMessage = t('form.submitTimeout') || 'Request timed out. Please try again.';
          break;
        case 'network_error':
          errorMessage = t('form.submitNetworkError') || 'Network error. Please check your connection and try again.';
          break;
        case 'server_error':
          errorMessage = t('form.submitServerError') || 'Server error. Please try again later.';
          break;
        case 'validation_error':
          errorMessage = t('form.submitValidationError') || 'Validation error. Please check your form data.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      dispatch(setSubmissionError(errorMessage));
      alert(errorMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo register={register} errors={errors} setValue={setValue} watch={watch} />;
      case 2:
        return <Step2FamilyFinancial register={register} errors={errors} setValue={setValue} watch={watch} />;
      case 3:
        return <Step3SituationDescriptions register={register} errors={errors} setValue={setValue} watch={watch} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Fade in={true} timeout={500}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            mb: 3,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('app.subtitle')}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 4, color: 'text.secondary' }}
          >
            {t('progress.step')} {currentStep} {t('progress.of')} 3
          </Typography>
          <Stepper
            activeStep={currentStep - 1}
            alternativeLabel
            sx={{
              mb: { xs: 3, sm: 4, md: 5 },
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.95rem' },
              },
              '& .MuiStepConnector-root': {
                top: { xs: '20px', sm: '23px' },
                position: 'absolute',
                ...(isRTL
                  ? {
                      left: { xs: 'calc(50% + 24px)', sm: 'calc(50% + 32px)' },
                      right: { xs: 'calc(-50% + 24px)', sm: 'calc(-50% + 32px)' },
                    }
                  : {
                      left: { xs: 'calc(-50% + 24px)', sm: 'calc(-50% + 32px)' },
                      right: { xs: 'calc(50% + 24px)', sm: 'calc(50% + 32px)' },
                    }),
              },
              '& .MuiStepConnector-line': {
                borderTopWidth: 0.5,
                borderRadius: 2,
                marginTop: '2px',
                display: 'block',
                width: '100%',
              },
              '& .MuiStepConnector-active .MuiStepConnector-line': {
                borderColor: '#2563eb',
              },
              '& .MuiStepConnector-completed .MuiStepConnector-line': {
                borderColor: '#10b981',
              },
            }}
          >
            <Step>
              <StepLabel
                StepIconComponent={(props) => <CustomStepIcon {...props} icon={1} />}
              >
                {t('form.step1')}
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                StepIconComponent={(props) => <CustomStepIcon {...props} icon={2} />}
              >
                {t('form.step2')}
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                StepIconComponent={(props) => <CustomStepIcon {...props} icon={3} />}
              >
                {t('form.step3')}
              </StepLabel>
            </Step>
          </Stepper>
          <Fade in={true} timeout={300} key={currentStep}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent()}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: { xs: 2, sm: 0 },
                  mt: { xs: 3, sm: 4, md: 5 },
                  pt: { xs: 2, sm: 3 },
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Button
                  disabled={currentStep === 1}
                  onClick={handlePrevious}
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  aria-label={t('form.previous')}
                  fullWidth={!isRTL && isMobile}
                  sx={{
                    minWidth: { xs: '100%', sm: 140 },
                    borderWidth: 2,
                    order: isRTL ? (isMobile ? 2 : 1) : 1,
                    '&:hover': {
                      borderWidth: 2,
                      transform: { xs: 'none', sm: 'translateX(-4px)' },
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {t('form.previous')}
                </Button>
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    aria-label={t('form.next')}
                    fullWidth={!isRTL && isMobile}
                    sx={{
                      minWidth: { xs: '100%', sm: 140 },
                      order: isRTL ? (isMobile ? 1 : 2) : 2,
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateX(4px)' },
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {t('form.next')}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    disabled={isSubmitting}
                    aria-label={t('form.submit')}
                    fullWidth={!isRTL && isMobile}
                    sx={{
                      minWidth: { xs: '100%', sm: 180 },
                      order: isRTL ? (isMobile ? 1 : 2) : 2,
                      background: isSubmitting 
                        ? '#cbd5e1' 
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      '&:hover': {
                        background: isSubmitting 
                          ? '#cbd5e1' 
                          : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: isSubmitting ? 'none' : { xs: 'none', sm: 'translateY(-2px)' },
                        boxShadow: isSubmitting ? 'none' : { xs: 'none', sm: '0 8px 20px rgba(16, 185, 129, 0.4)' },
                      },
                      transition: 'all 0.2s ease-in-out',
                      '&:disabled': {
                        background: '#cbd5e1',
                        color: '#ffffff',
                      },
                    }}
                  >
                    {isSubmitting ? (t('form.submitting') || 'Submitting...') : t('form.submit')}
                  </Button>
                )}
              </Box>
            </Box>
          </Fade>
        </Paper>
      </Fade>
      {showAIModal && <AIModal setValue={setValue} />}
      <SubmissionModal
        open={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        submissionData={submissionData}
        formData={submittedFormData}
      />
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        open={isLoading || isSubmitting}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={60} sx={{ color: '#ffffff' }} />
          <Typography variant="h6" sx={{ color: '#ffffff' }}>
            {isSubmitting ? (t('form.submitting') || 'Submitting Application...') : t('ai.generating')}
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}

export default FormWizard;

