import React from 'react';
import { Box, TextField, MenuItem, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { validateEmail, validatePhone } from '../../utils/validation';

function Step1PersonalInfo({ register, errors, setValue, watch }) {
  const { t } = useTranslation();
  const gender = watch('gender');

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('form.fields.name')}
            {...register('name', {
              required: t('validation.required'),
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            aria-required="true"
            autoComplete="name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('form.fields.nationalId')}
            {...register('nationalId', {
              required: t('validation.required'),
            })}
            error={!!errors.nationalId}
            helperText={errors.nationalId?.message}
            aria-required="true"
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label={t('form.fields.dateOfBirth')}
            InputLabelProps={{ shrink: true }}
            {...register('dateOfBirth', {
              required: t('validation.required'),
            })}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
            aria-required="true"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label={t('form.fields.gender')}
            value={gender || ''}
            {...register('gender', {
              required: t('validation.required'),
            })}
            onChange={(e) => {
              setValue('gender', e.target.value, { shouldValidate: true });
            }}
            error={!!errors.gender}
            helperText={errors.gender?.message}
            aria-required="true"
          >
            <MenuItem value="male">{t('form.gender.male')}</MenuItem>
            <MenuItem value="female">{t('form.gender.female')}</MenuItem>
            <MenuItem value="other">{t('form.gender.other')}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('form.fields.address')}
            multiline
            rows={2}
            {...register('address', {
              required: t('validation.required'),
            })}
            error={!!errors.address}
            helperText={errors.address?.message}
            aria-required="true"
            autoComplete="street-address"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label={t('form.fields.city')}
            {...register('city', {
              required: t('validation.required'),
            })}
            error={!!errors.city}
            helperText={errors.city?.message}
            aria-required="true"
            autoComplete="address-level2"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label={t('form.fields.state')}
            {...register('state', {
              required: t('validation.required'),
            })}
            error={!!errors.state}
            helperText={errors.state?.message}
            aria-required="true"
            autoComplete="address-level1"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label={t('form.fields.country')}
            {...register('country', {
              required: t('validation.required'),
            })}
            error={!!errors.country}
            helperText={errors.country?.message}
            aria-required="true"
            autoComplete="country-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('form.fields.phone')}
            type="tel"
            {...register('phone', {
              required: t('validation.required'),
              validate: (value) => validatePhone(value) || t('validation.phone'),
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            aria-required="true"
            autoComplete="tel"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('form.fields.email')}
            type="email"
            {...register('email', {
              required: t('validation.required'),
              validate: (value) => validateEmail(value) || t('validation.email'),
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            aria-required="true"
            autoComplete="email"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Step1PersonalInfo;

