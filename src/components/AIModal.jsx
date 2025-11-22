import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Fade,
  IconButton,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { closeAIModal } from '../store/slices/uiSlice';
import { updateStep3 } from '../store/slices/formSlice';

function AIModal({ setValue }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const aiSuggestion = useSelector((state) => state.ui.aiSuggestion);
  const aiField = useSelector((state) => state.ui.aiField);
  const isLoading = useSelector((state) => state.ui.isLoading);
  const [editedText, setEditedText] = useState(aiSuggestion || '');

  React.useEffect(() => {
    setEditedText(aiSuggestion || '');
  }, [aiSuggestion]);

  const handleAccept = () => {
    if (aiField && editedText) {
      dispatch(updateStep3({ [aiField]: editedText }));
      if (setValue) {
        setValue(aiField, editedText, { 
          shouldValidate: true, 
          shouldDirty: true,
          shouldTouch: true 
        });
      }
    }
    dispatch(closeAIModal());
  };

  const handleDiscard = () => {
    dispatch(closeAIModal());
  };

  const getFieldLabel = () => {
    if (!aiField) return '';
    const fieldMap = {
      currentFinancialSituation: t('form.fields.currentFinancialSituation'),
      employmentCircumstances: t('form.fields.employmentCircumstances'),
      reasonForApplying: t('form.fields.reasonForApplying'),
    };
    return fieldMap[aiField] || aiField;
  };

  return (
    <Dialog
      open={true}
      onClose={handleDiscard}
      maxWidth="md"
      fullWidth
      aria-labelledby="ai-modal-title"
      aria-describedby="ai-modal-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle
        id="ai-modal-title"
        component="div"
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 2,
        }}
      >
        <AutoAwesomeIcon />
        <Typography component="span" variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {t('ai.suggestion')}
        </Typography>
        <IconButton
          onClick={handleDiscard}
          size="small"
          sx={{
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0369a1', mb: 0.5 }}>
            {getFieldLabel()}
          </Typography>
          <Typography variant="caption" sx={{ color: '#0284c7' }}>
            Review and edit the AI-generated suggestion below
          </Typography>
        </Box>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 300,
              gap: 2,
            }}
          >
            <CircularProgress size={60} sx={{ color: '#2563eb' }} />
            <Typography variant="body2" color="text.secondary">
              {t('ai.generating')}
            </Typography>
          </Box>
        ) : (
          <Fade in={!isLoading} timeout={300}>
            <TextField
              fullWidth
              multiline
              rows={12}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              variant="outlined"
              aria-label={t('ai.suggestion')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                },
              }}
            />
          </Fade>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleDiscard}
          variant="outlined"
          aria-label={t('ai.discard')}
          sx={{
            minWidth: 120,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          {t('ai.discard')}
        </Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          disabled={isLoading || !editedText}
          startIcon={<CheckCircleIcon />}
          aria-label={t('ai.accept')}
          sx={{
            minWidth: 140,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
            },
            transition: 'all 0.2s ease-in-out',
            '&:disabled': {
              background: '#cbd5e1',
            },
          }}
        >
          {t('ai.accept')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AIModal;

