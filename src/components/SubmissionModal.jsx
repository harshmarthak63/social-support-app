import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

function SubmissionModal({ open, onClose, submissionData, formData }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          boxShadow: { xs: 'none', sm: '0 20px 60px rgba(0, 0, 0, 0.3)' },
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: '100vh', sm: '90vh' },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 2,
        }}
      >
        <CheckCircleIcon />
        <Typography component="span" variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {t('form.submitSuccess') || 'Application Submitted Successfully!'}
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            minWidth: 'auto',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent sx={{ pt: { xs: 2, sm: 3 }, pb: { xs: 1, sm: 2 }, px: { xs: 2, sm: 3 } }}>
        {submissionData && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Application Details
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                background: '#f8fafc',
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                    Application ID:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {submissionData.applicationId}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                    Status:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                    {submissionData.status}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                    Submitted At:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b' }}>
                    {new Date(submissionData.submittedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              {submissionData.message}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Submitted Form Data (mock API call)
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: '#f8fafc',
              borderRadius: 2,
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                color: '#1e293b',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {formData ? JSON.stringify(formData, null, 2) : 'No data available'}
            </pre>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          sx={{
            minWidth: { xs: '100%', sm: 120 },
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            },
          }}
        >
          {t('form.close') || 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SubmissionModal;

