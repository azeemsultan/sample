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

import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { userApi } from 'src/api/userApi';
import getEmailTemplate from 'src/utils/getEmailTemplate';
import toast from 'react-hot-toast';

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

const ForgotPassword: FC = (props) => {
  const classes = useStyles();
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
            viewBox="0 0 19 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 2.5C7.646 2.5 6.125 4.021 6.125 5.875V9.25H16.25C16.8467 9.25 17.419 9.48705 17.841 9.90901C18.2629 10.331 18.5 10.9033 18.5 11.5V20.5C18.5 21.0967 18.2629 21.669 17.841 22.091C17.419 22.513 16.8467 22.75 16.25 22.75H2.75C2.15326 22.75 1.58097 22.513 1.15901 22.091C0.737053 21.669 0.5 21.0967 0.5 20.5V11.5C0.5 10.9033 0.737053 10.331 1.15901 9.90901C1.58097 9.48705 2.15326 9.25 2.75 9.25H3.875V5.875C3.875 2.779 6.404 0.25 9.5 0.25C12.596 0.25 15.125 2.779 15.125 5.875C15.125 6.17337 15.0065 6.45952 14.7955 6.6705C14.5845 6.88147 14.2984 7 14 7C13.7016 7 13.4155 6.88147 13.2045 6.6705C12.9935 6.45952 12.875 6.17337 12.875 5.875C12.875 4.021 11.354 2.5 9.5 2.5ZM2.75 11.5V20.5H16.25V11.5H2.75Z"
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
                  {t('forget_password_title')}
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
                  email: '',
                  submit: null
                }}
                validationSchema={
                  Yup
                    .object()
                    .shape({
                      email: Yup
                        .string()
                        .email(t('forgot_password_valid_form_error'))
                        .max(255)
                        .required(t('forgot_password_required_form_error')),
                    })
                }
                onSubmit={async (values, {
                  setErrors,
                  setStatus,
                  setSubmitting,
                  resetForm,
                }): Promise<void> => {
                  try {
                    const res = await userApi.getKeycloakIdByEmail(values?.email);
                    if (res?.id) {
                      const successMsg = t('forgot_password_form_success');
                      let forgotPasswordTemplate = getEmailTemplate('forgot_password');
                      forgotPasswordTemplate = forgotPasswordTemplate.replaceAll('{{ resetPasswordUrl }}', `${process.env.REACT_APP_BASE_URL}/reset-password/${res?.id}`);
                      forgotPasswordTemplate = forgotPasswordTemplate.replace('{{ currentYear }}', moment().format('Y'));
                      const forgotPassword = {
                        to: res?.email,
                        recipient_name: `${res?.firstName} ${res?.lastName}`,
                        content: forgotPasswordTemplate,
                        subject: t('forgot_password_subject'),
                      };
                      await userApi.sendEmail(forgotPassword);
                      resetForm();
                      toast.success(successMsg);
                    }
                    setStatus({ success: true });
                    setSubmitting(false);
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
                      autoFocus
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label={t('forget_password_email_address')}
                      margin="normal"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
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
                          {t('forget_password_button')}
                        </Button>
                      </Grid>
                      <Grid
                        xs={12}
                        md={6}
                      >
                        <a
                          className={classes.forgotPassword}
                          href="/login"
                        >
                          {t('forget_password_login')}
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

export default ForgotPassword;
