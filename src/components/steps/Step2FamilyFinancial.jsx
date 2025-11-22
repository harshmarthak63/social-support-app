import React from 'react';
import { Box, TextField, MenuItem, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

function Step2FamilyFinancial({ register, errors, setValue, watch }) {
  const { t } = useTranslation();
  const maritalStatus = watch('maritalStatus');
  const employmentStatus = watch('employmentStatus');
  const housingStatus = watch('housingStatus');

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label={t('form.fields.maritalStatus')}
            value={maritalStatus || ''}
            {...register('maritalStatus', {
              required: t('validation.required'),
            })}
            onChange={(e) => {
              setValue('maritalStatus', e.target.value, { shouldValidate: true });
            }}
            error={!!errors.maritalStatus}
            helperText={errors.maritalStatus?.message}
            aria-required="true"
          >
            <MenuItem value="single">{t('form.maritalStatus.single')}</MenuItem>
            <MenuItem value="married">{t('form.maritalStatus.married')}</MenuItem>
            <MenuItem value="divorced">{t('form.maritalStatus.divorced')}</MenuItem>
            <MenuItem value="widowed">{t('form.maritalStatus.widowed')}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('form.fields.dependents')}
            inputProps={{ min: 0, max: 20 }}
            {...register('dependents', {
              required: t('validation.required'),
              valueAsNumber: true,
              min: { value: 0, message: 'Must be 0 or greater' },
            })}
            error={!!errors.dependents}
            helperText={errors.dependents?.message}
            aria-required="true"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label={t('form.fields.employmentStatus')}
            value={employmentStatus || ''}
            {...register('employmentStatus', {
              required: t('validation.required'),
            })}
            onChange={(e) => {
              setValue('employmentStatus', e.target.value, { shouldValidate: true });
            }}
            error={!!errors.employmentStatus}
            helperText={errors.employmentStatus?.message}
            aria-required="true"
          >
            <MenuItem value="employed">{t('form.employmentStatus.employed')}</MenuItem>
            <MenuItem value="unemployed">{t('form.employmentStatus.unemployed')}</MenuItem>
            <MenuItem value="selfEmployed">{t('form.employmentStatus.selfEmployed')}</MenuItem>
            <MenuItem value="retired">{t('form.employmentStatus.retired')}</MenuItem>
            <MenuItem value="student">{t('form.employmentStatus.student')}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('form.fields.monthlyIncome')}
            inputProps={{ min: 0, step: 0.01 }}
            {...register('monthlyIncome', {
              required: t('validation.required'),
              valueAsNumber: true,
              min: { value: 0, message: 'Must be 0 or greater' },
            })}
            error={!!errors.monthlyIncome}
            helperText={errors.monthlyIncome?.message}
            aria-required="true"
            InputProps={{
              startAdornment: <span style={{ marginRight: 8 }}>$</span>,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label={t('form.fields.housingStatus')}
            value={housingStatus || ''}
            {...register('housingStatus', {
              required: t('validation.required'),
            })}
            onChange={(e) => {
              setValue('housingStatus', e.target.value, { shouldValidate: true });
            }}
            error={!!errors.housingStatus}
            helperText={errors.housingStatus?.message}
            aria-required="true"
          >
            <MenuItem value="owned">{t('form.housingStatus.owned')}</MenuItem>
            <MenuItem value="rented">{t('form.housingStatus.rented')}</MenuItem>
            <MenuItem value="livingWithFamily">{t('form.housingStatus.livingWithFamily')}</MenuItem>
            <MenuItem value="homeless">{t('form.housingStatus.homeless')}</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Step2FamilyFinancial;

