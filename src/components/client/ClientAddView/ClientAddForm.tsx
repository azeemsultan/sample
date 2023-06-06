import type { FC } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  CircularProgress,
  Link,
} from '@material-ui/core';
import { clientApi } from 'src/api/clientApi';
import { userApi } from 'src/api/userApi';

import getRandomPassword from 'src/utils/getRandomPassword';
import getEmailTemplate from 'src/utils/getEmailTemplate';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import logger from 'src/utils/logger';
import clsx from 'clsx';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

const useStyles = makeStyles(() => ({
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
  button: {
    width: 200,
    height: 45,
  },
  submitButton: {
    borderRadius: 4,
    textTransform: 'unset',
  },
  loadingCircle: {
    color: 'white',
    width: '25px !important',
    height: '25px !important',
    marginLeft: 10
  },
  linkButton: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
  cancelButton: {
    marginLeft: '2rem',
    borderRadius: 4,
    textTransform: 'unset'
  },
  switchWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    marginBottom: 0,
    fontWeight: 400,
    fontSize: 16,
    marginRight: 16,
    position: 'relative',
    top: '-2px',
  },
}));

const ClientAddForm: FC = () => {
  const classes = useStyles();
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);
  const navigate = useNavigate();

  const decoded: any = jwtDecode(localStorage.getItem('accessToken'));
  const roles = decoded?.realm_access?.roles;
  const isSubClientUser = roles?.includes('sub_client_admin') || roles?.includes('sub_client_user');
  const isClientUser = roles?.includes('client_admin') || roles?.includes('client_user');
  if (isSubClientUser || isClientUser) {
    window.location.href = '/admin/not-found';
  }

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        city: '',
        password: '',
        country: 'Netherlands',
        allow_customization: false,
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            name: Yup
              .string()
              .max(255)
              .required(t('clients_name_required_form_error')),
            email: Yup
              .string()
              .email(t('clients_email_valid_form_error'))
              .max(255)
              .required(t('clients_email_required_form_error')),
            password: Yup.string()
              .matches(/^(?=.*\d)(?=.*[!@#$%^&*\-\\+])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                t('clients_password_required_form_error'))
              .nullable(),
            city: Yup
              .string()
              .max(255)
              .required(t('clients_city_required_form_error')),
            country: Yup
              .string()
              .max(255)
              .required(t('clients_country_required_form_error')),
          })
      }
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          // NOTE: Make API request
          let clientPassword = values.password;
          setSubmitting(true);
          if (values?.password?.trim()?.length === 0) {
            clientPassword = getRandomPassword();
            values.password = clientPassword;
          }
          const user = await clientApi.create(values);
          console.log(user);
          let temporaryPasswordTemplate = getEmailTemplate('3_scale_temporary_password');
          temporaryPasswordTemplate = temporaryPasswordTemplate.replaceAll('{{ temporaryPassword }}', clientPassword);
          temporaryPasswordTemplate = temporaryPasswordTemplate.replaceAll('{{ loginUrl }}', 'https://3scale-admin.api.fortes-es.nl/p/login');
          temporaryPasswordTemplate = temporaryPasswordTemplate.replace('{{ currentYear }}', moment().format('Y'));
          const temporaryPassword = {
            to: values?.email,
            recipient_name: `${values?.name}`,
            content: temporaryPasswordTemplate,
            subject: t('three_scale_temporary_password_subject'),
          };
          console.log('temporaryPassword', temporaryPassword);
          await userApi.sendEmail(temporaryPassword);

          const successMsg = t('clients_add_form_success');
          resetForm();
          setStatus({ success: true });
          setSubmitting(true);
          toast.success(successMsg);
          navigate('/admin/clients');
        } catch (err) {
          const errorMsg = err.response.status === 409 ? t('clients_form_email_error') : t('clients_form_api_error');
          logger(err, 'error');
          toast.error(errorMsg);
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
          onSubmit={handleSubmit}
          noValidate
        >
          <Card
            className={classes.card}
          >
            <Box sx={{ p: 3, pr: 0 }}>
              <Grid
                container
                spacing={3}
                md={8}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    InputProps={{
                      classes: {
                        root: classes.textField
                      },
                    }}
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label={t('clients_form_client_name_field')}
                    placeholder={t('clients_form_client_name_field')}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    InputProps={{
                      classes: {
                        root: classes.textField
                      },
                    }}
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label={t('clients_form_email_field')}
                    placeholder={t('clients_form_email_field')}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    InputProps={{
                      classes: {
                        root: classes.textField
                      },
                    }}
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label={t('clients_form_password_field')}
                    placeholder={t('clients_form_password_field')}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    InputProps={{
                      classes: {
                        root: classes.textField
                      },
                    }}
                    error={Boolean(touched.city && errors.city)}
                    fullWidth
                    helperText={touched.city && errors.city}
                    label="Company"
                    placeholder="Company"
                    name="city"
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.city}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    InputProps={{
                      classes: {
                        root: classes.textField
                      },
                    }}
                    error={Boolean(touched.city && errors.city)}
                    fullWidth
                    helperText={touched.city && errors.city}
                    label="Phone"
                    placeholder="Phone"
                    name="city"
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.city}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button
                  color="secondary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                  className={clsx(classes.button, classes.submitButton)}
                >
                  {t('clients_form_add_client_button')}
                  {isSubmitting && (
                    <CircularProgress className={classes.loadingCircle} />
                  )}
                </Button>
                <Link
                  color="inherit"
                  component={RouterLink}
                  to="/admin/clients"
                  variant="subtitle2"
                  className={classes.linkButton}
                >
                  <Button
                    color="inherit"
                    type="submit"
                    variant="contained"
                    className={clsx(classes.button, classes.cancelButton)}
                  >
                    {t('clients_form_cancel_button')}
                  </Button>
                </Link>
              </Box>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default ClientAddForm;
