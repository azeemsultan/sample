import type { FC } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  Container,
  Divider,
  Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import useAuth from '../../../hooks/useAuth';
import useMounted from '../../../hooks/useMounted';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

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
  submitButton: {
    borderRadius: 4,
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 15,
      width: '100%'
    }
  },
  forgotPassword: {
    color: theme.palette.warning.main,
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    }
  },
  error: {
    borderRadius: 4,
  },
}));

const LoginJWT: FC = (props) => {
  const classes = useStyles();
  const mounted = useMounted();
  const { login } = useAuth() as any;
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);
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
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.5625 9.125H15.625V6.3125C15.625 3.21875 13.0938 0.6875 10 0.6875C6.90625 0.6875 4.375 3.21875 4.375 6.3125V9.125H3.4375C1.84375 9.125 0.625 10.3438 0.625 11.9375V18.5C0.625 20.0938 1.84375 21.3125 3.4375 21.3125H16.5625C18.1562 21.3125 19.375 20.0938 19.375 18.5V11.9375C19.375 10.3438 18.1562 9.125 16.5625 9.125ZM6.25 6.3125C6.25 4.25 7.9375 2.5625 10 2.5625C12.0625 2.5625 13.75 4.25 13.75 6.3125V9.125H6.25V6.3125ZM16.5625 19.4375C17.125 19.4375 17.5 19.0625 17.5 18.5V11.9375C17.5 11.375 17.125 11 16.5625 11H3.4375C2.875 11 2.5 11.375 2.5 11.9375V18.5C2.5 19.0625 2.875 19.4375 3.4375 19.4375H16.5625Z"
              fill="white"
            />
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
                  {t('login_sign_in')}
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
                  email: 'info@it22.nl',
                  password: 'QDw2,C4mCgHFV*4<',
                  submit: null
                }}
                validationSchema={
                  Yup
                    .object()
                    .shape({
                      email: Yup
                        .string()
                        // .email('Must be a valid email')
                        .max(255)
                        .required('Email is required'),
                      password: Yup
                        .string()
                        .max(255)
                        .required('Password is required')
                    })
                }
                onSubmit={async (values, {
                  setErrors,
                  setStatus,
                  setSubmitting
                }): Promise<void> => {
                  try {
                    await login(values.email, values.password);

                    if (mounted.current) {
                      setStatus({ success: true });
                      setSubmitting(false);
                    }
                  } catch (err) {
                    console.error(err);
                    if (mounted.current) {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    }
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
                      autoFocus
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label={t('login_email_address')}
                      margin="normal"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      variant="outlined"
                    />
                    <TextField
                      InputProps={{
                        classes: {
                          root: classes.textField
                        },
                      }}
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label={t('login_password')}
                      margin="normal"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                    {errors.submit && (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                      >
                        <Box mt={2}>
                          <Alert
                            severity="error"
                            className={classes.error}
                          >
                            <div>
                              <strong>
                                {errors.submit}
                              </strong>
                            </div>
                          </Alert>
                        </Box>
                      </Grid>
                    )}
                    <Box
                      sx={{ mt: 2 }}
                      className={classes.buttonWrapper}
                    >
                      <Grid
                        item
                        xs={12}
                        md={3}
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
                          {t('login_sign_in')}
                        </Button>
                      </Grid>
                      <Grid
                        xs={12}
                        md={3}
                        item
                      >
                        <a
                          className={classes.forgotPassword}
                          href="/forgot-password"
                        >
                          {t('login_forget_password')}
                        </a>
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

export default LoginJWT;
