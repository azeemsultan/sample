import type { FC } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Grid,
  Button,
  FormHelperText,
  TextField,
  Card,
  CardContent,
  Container,
  Divider,
  Typography
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { userApi } from 'src/api/userApi';
import getId from 'src/utils/getId';
import toast from 'react-hot-toast';
import wait from 'src/utils/wait';

const useStyles = makeStyles((theme) => ({
  lockIcon: {
    background: theme.palette.primary.main,
    width: 55,
    height: 55,
    padding: 14,
    borderRadius: 4,
    position: 'relative',
    top: '-25px',
    left: 49,
  },
  card: {
    borderRadius: 8,
    overflow: 'unset',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 48px 64px !important',
  },
  textField: {
    borderRadius: 4,
  },
  forgotPassword: {
    color: theme.palette.warning.main,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitButton: {
    borderRadius: 4,
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 15,
      width: '100%'
    }
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    }
  },
}));

const ResetPassword: FC = (props) => {
  const classes = useStyles();
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);
  const keycloakId = getId();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center'
      }}
    >
      <Container
        maxWidth="sm"
        sx={{ p: '0 !important' }}
      >
        <Card className={classes.card}>
          <svg
            className={classes.lockIcon}
            width="27
            "
            height="27
            "
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_574_6396)">
              <path
                d="M14.2087 2.25C20.43 2.25 25.47 7.3125 25.47 13.5C25.47 19.6875 20.43 24.75 14.2087 24.75C10.26 24.75 6.80625 22.7025 4.7925 19.6088L6.57 18.2025C8.15625 20.7788 10.98 22.5 14.22 22.5C16.6069 22.5 18.8961 21.5518 20.584 19.864C22.2718 18.1761 23.22 15.887 23.22 13.5C23.22 11.1131 22.2718 8.82387 20.584 7.13604C18.8961 5.44821 16.6069 4.5 14.22 4.5C9.63 4.5 5.85 7.9425 5.29875 12.375H8.40375L4.19625 16.5713L0 12.375H3.02625C3.58875 6.69375 8.38125 2.25 14.2087 2.25ZM17.5387 11.52C18.1012 11.5313 18.5625 11.9813 18.5625 12.555V17.7413C18.5625 18.3038 18.1012 18.7763 17.5275 18.7763H11.3063C10.7325 18.7763 10.2712 18.3038 10.2712 17.7413V12.555C10.2712 11.9813 10.7325 11.5313 11.295 11.52V10.3838C11.295 8.6625 12.7013 7.2675 14.4113 7.2675C16.1325 7.2675 17.5387 8.6625 17.5387 10.3838V11.52ZM14.4113 8.8425C13.5675 8.8425 12.87 9.52875 12.87 10.3838V11.52H15.9637V10.3838C15.9637 9.52875 15.2663 8.8425 14.4113 8.8425Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_574_6396">
                <rect
                  width="27
                  "
                  height="27
                  "
                  fill="white"
                />
              </clipPath>
            </defs>
          </svg>
          <CardContent
            className={classes.cardContent}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2
              }}
            >
              <div>
                <Typography
                  color="textPrimary"
                  variant="h4"
                >
                  {t('reset_password_title')}
                </Typography>
              </div>
            </Box>
            <Grid
              item
              xs={12}
            >
              <Divider />
            </Grid>
            <Box
              sx={{
                flexGrow: 1,
                mt: 2
              }}
            >
              <Formik
                initialValues={{
                  newPassword: '',
                  confirmPassword: '',
                  submit: null
                }}
                validationSchema={
                  Yup
                    .object()
                    .shape({
                      newPassword: Yup.string().matches(/^(?=.*\d)(?=.*[!@#$%^&*\-\\+])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, t('reset_password_new_password_form_error')).required(t('reset_password_new_password_required_form_error')),
                      confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], t('reset_password_passwords_not_matching')).matches(/^(?=.*\d)(?=.*[!@#$%^&*\-\\+])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, t('reset_password_new_password_form_error')).required(t('reset_password_confirm_password_required_form_error')),
                    })
                }
                onSubmit={async (values, {
                  setErrors,
                  setStatus,
                  setSubmitting,
                  resetForm
                }): Promise<void> => {
                  try {
                    await userApi.resetPassword(keycloakId, values?.confirmPassword);
                    await userApi.verifyUserByKeycloakId(keycloakId);
                    const successMsg = t('reset_password_form_success');
                    toast.success(successMsg, {
                      duration: 10000,
                    });
                    setStatus({ success: true });
                    setSubmitting(false);
                    resetForm();
                    await wait(2000);
                    window.location.href = '/';
                  } catch (err) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                  }
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values
                }): JSX.Element => (
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    {...props}
                  >
                    <TextField
                      InputProps={{
                        classes: {
                          root: classes.textField
                        },
                      }}
                      error={Boolean(touched.newPassword && errors.newPassword)}
                      fullWidth
                      helperText={touched.newPassword && errors.newPassword}
                      label={t('reset_password_new_password')}
                      placeholder={t('reset_password_new_password')}
                      margin="normal"
                      name="newPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.newPassword}
                      variant="outlined"
                    />

                    <TextField
                      InputProps={{
                        classes: {
                          root: classes.textField
                        },
                      }}
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      fullWidth
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      label={t('reset_password_confirm_password')}
                      placeholder={t('reset_password_confirm_password')}
                      margin="normal"
                      name="confirmPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.confirmPassword}
                      variant="outlined"
                    />
                    {errors.submit && (
                      <Box sx={{ mt: 3 }}>
                        <FormHelperText error>
                          {errors.submit}
                        </FormHelperText>
                      </Box>
                    )}
                    <Box
                      sx={{ mt: 2 }}
                      className={classes.buttonWrapper}
                    >
                      <Grid
                        xs={12}
                        md={6}
                      >
                        <Button
                          className={classes.submitButton}
                          color="primary"
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          {t('reset_password_button')}
                        </Button>
                      </Grid>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ResetPassword;
