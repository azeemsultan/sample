import { useState, useEffect } from 'react';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  Card,
  Grid,
  TextField,
  Typography,
  Switch
} from '@material-ui/core';
import PropTypes from 'prop-types';
import type { User } from 'src/types/user';
import { userApi } from 'src/api/userApi';
import logger from 'src/utils/logger';
import clsx from 'clsx';
import jwtDecode from 'jwt-decode';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { isUndefined } from 'lodash';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 8,
    overflow: 'unset',
  },
  profileCard: {
    width: '60%',
  },
  notificationCard: {
    width: '38%',
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
    textTransform: 'unset'
  },
  button: {
    width: 200,
    height: 45,
  },
  linkButton: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
  cancelButton: {
    marginLeft: '4rem',
    borderRadius: 4,
    textTransform: 'unset'
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: '#172b4d',
  },
  switchWrapper: {
    display: 'flex',
    alignItems: 'center',
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

interface SettingFormProps {
  user: User;
}

const SettingForm: FC<SettingFormProps> = (props) => {
  const { ...other } = props;
  const classes = useStyles();
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);
  const [user, setUser] = useState<User>();
  let roleIdOptions;

  const isClientUser = window.location.pathname.indexOf('client_users') !== -1;

  if (isClientUser) {
    roleIdOptions = [
      {
        value: '2',
        label: 'User'
      },
      {
        value: '1',
        label: 'Admin'
      },
    ];
  } else {
    roleIdOptions = [
      {
        value: '4',
        label: 'User'
      },
      {
        value: '3',
        label: 'Admin'
      },
    ];
  }

  const countryOptions = [
    {
      value: 'Belgium',
      label: 'Belgium'
    },
    {
      value: 'Denmark',
      label: 'Denmark'
    },
    {
      value: 'France',
      label: 'France'
    },
    {
      value: 'Germany',
      label: 'Germany'
    },
    {
      value: 'Ireland',
      label: 'Ireland'
    },
    {
      value: 'Netherlands',
      label: 'Netherlands'
    },
    {
      value: 'United Kingdom',
      label: 'United Kingdom'
    },
  ];

  const getById = async () => {
    try {
      const decoded: any = jwtDecode(localStorage.getItem('accessToken'));
      const keycloakId = decoded?.sub;
      const res = await userApi.getByKeycloakId(keycloakId);
      setUser(res);
      logger(user);
    } catch (err) {
      logger(err, 'error');
    }
  };

  const updateSetting = async (columnName: string, value: boolean) => {
    try {
      const data = {
        user_id: user?.user_id,
        column: {
          [`${columnName}`]: !value
        }
      };
      await userApi.updateSetting(data);
      setUser((prevState) => ({
        [`${columnName}`]: !value,
        ...prevState,
      }));
    } catch (err) {
      logger(err, 'error');
    }
  };

  useEffect(() => {
    if (isUndefined(user?.user_id)) {
      getById();
    }
  }, [user]);

  return (
    <Formik
      initialValues={{
        user_id: user?.user_id || '',
        keycloak_id: user?.keycloak_id || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        password: user?.password || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        country: user?.country || '',
        role_id: user?.role_id || '',
        submit: null
      }}
      enableReinitialize
      validationSchema={
        Yup
          .object()
          .shape({
            first_name: Yup
              .string()
              .max(255)
              .required(t('users_first_name_required_form_error')),
            last_name: Yup
              .string()
              .max(255)
              .required(t('users_last_name_required_form_error')),
            email: Yup
              .string()
              .email(t('users_email_valid_form_error'))
              .max(255)
              .required(t('users_email_required_form_error')),
            is_email_verified: Yup.bool(),
            role_id: Yup.string().required(t('users_role_id_required_form_error')),
            password: Yup.string().matches(/^(?=.*\d)(?=.*[!@#$%^&*\-\\+])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, t('users_password_form_error')).required(t('users_password_required_form_error')),
            phone_number: Yup.string().max(15).nullable(),
            country: Yup.string().max(255).required(t('users_country_required_form_error')),
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
          setSubmitting(true);
          await userApi.edit(values);
          const successMsg = t('users_add_form_success');
          resetForm();
          setStatus({ success: true });
          setSubmitting(true);
          toast.success(successMsg);
          // window.location.href = '/admin/setting';
        } catch (err) {
          const errorMsg = err.response.status === 409 ? t('users_form_email_error') : t('users_form_api_error');
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
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }): JSX.Element => (
        <Box
          className={classes.root}
        >
          <Card
            className={clsx(classes.card, classes.profileCard)}
          >
            <form
              className={classes.form}
              onSubmit={handleSubmit}
              {...other}
              noValidate
            >
              <Box sx={{ p: 3, pr: 0 }}>
                <Grid
                  container
                  spacing={3}
                  md={12}
                >
                  <Grid
                    item
                    md={12}
                    xs={12}
                  >
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      className={classes.title}
                    >
                      {t('settings_update_profile_title')}
                    </Typography>
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
                      error={Boolean(touched.first_name && errors.first_name)}
                      fullWidth
                      helperText={touched.first_name && errors.first_name}
                      label={t('users_form_first_name_field')}
                      placeholder={t('users_form_first_name_field')}
                      name="first_name"
                      onChange={handleChange}
                      required
                      value={values.first_name}
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
                      error={Boolean(touched.last_name && errors.last_name)}
                      fullWidth
                      helperText={touched.last_name && errors.last_name}
                      label={t('users_form_last_name_field')}
                      placeholder={t('users_form_last_name_field')}
                      name="last_name"
                      onChange={handleChange}
                      required
                      value={values.last_name}
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
                      label={t('users_form_email_field')}
                      placeholder={t('users_form_email_field')}
                      name="email"
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
                      error={Boolean(touched.phone_number && errors.phone_number)}
                      fullWidth
                      helperText={touched.phone_number && errors.phone_number}
                      label={t('users_form_phone_field')}
                      placeholder={t('users_form_phone_field')}
                      name="phone_number"
                      onChange={handleChange}
                      value={values.phone_number}
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
                      label={t('users_form_password_field')}
                      placeholder={t('users_form_password_field')}
                      name="password"
                      type="password"
                      required
                      onChange={handleChange}
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
                      fullWidth
                      label={t('users_form_role_id_field')}
                      name="role_id"
                      placeholder={t('users_form_role_id_field')}
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={values?.role_id?.toString()}
                      variant="outlined"
                    >
                      {roleIdOptions.map((role_id) => (
                        <option
                          key={role_id.value}
                          value={role_id.value}
                        >
                          {role_id.label}
                        </option>
                      ))}
                    </TextField>
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
                      fullWidth
                      error={Boolean(touched.country && errors.country)}
                      helperText={touched.country && errors.country}
                      label={t('users_form_country_field')}
                      placeholder={t('users_form_country_field')}
                      name="country"
                      required
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                      value={values.country}
                    >
                      {countryOptions.map((country) => (
                        <option
                          key={country.value}
                          value={country.value}
                        >
                          {country.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                  sx={{ pt: 2 }}
                >
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    {t('user_email_verified_title')}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{ py: 1 }}
                    variant="body2"
                  >
                    {t('user_email_verified_sub_title')}
                  </Typography>
                  <Switch
                    defaultChecked
                    color="secondary"
                  />
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ pt: 2 }}
                >
                  <Button
                    color="secondary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    className={clsx(classes.button, classes.submitButton)}
                  >
                    {t('users_form_edit_user_button')}
                  </Button>
                  <Link
                    color="inherit"
                    component={RouterLink}
                    to={`/admin/clients/${user?.client_id}`}
                    variant="subtitle2"
                    className={classes.linkButton}
                  >
                    <Button
                      color="inherit"
                      type="submit"
                      variant="contained"
                      className={clsx(classes.button, classes.cancelButton)}
                    >
                      {t('users_form_cancel_button')}
                    </Button>
                  </Link>
                </Grid>
              </Box>
            </form>
          </Card>
          <Card
            className={clsx(classes.card, classes.notificationCard)}
          >
            <Box sx={{ p: 3, pr: 0 }}>
              <Grid
                container
                spacing={3}
                md={12}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    className={classes.title}
                  >
                    {t('settings_notification_title')}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  className={classes.switchWrapper}
                >
                  <Switch
                    color="secondary"
                    checked={user?.notify_on_window_exceptions_occur}
                    value={user?.notify_on_window_exceptions_occur}
                    edge="start"
                    name="notify_on_window_exceptions_occur"
                    onChange={() => updateSetting('notify_on_window_exceptions_occur', user?.notify_on_window_exceptions_occur)}
                  />
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="subtitle2"
                    className={classes.switchText}
                  >
                    {t('settings_notification_window_exceptions_title')}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  className={classes.switchWrapper}
                >
                  <Switch
                    color="secondary"
                    checked={user?.notify_on_device_error_mode}
                    value={user?.notify_on_device_error_mode}
                    edge="start"
                    name="notify_on_device_error_mode"
                    onChange={() => updateSetting('notify_on_device_error_mode', user?.notify_on_device_error_mode)}
                  />
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="subtitle2"
                    className={classes.switchText}
                  >
                    {t('settings_notification_device_error_title')}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    className={classes.title}
                  >
                    {t('settings_notification_channels_title')}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  className={classes.switchWrapper}
                >
                  <Switch
                    color="secondary"
                    checked={user?.use_email_for_notification}
                    value={user?.use_email_for_notification}
                    edge="start"
                    name="use_email_for_notification"
                    onChange={() => updateSetting('use_email_for_notification', user?.use_email_for_notification)}
                  />
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="subtitle2"
                    className={classes.switchText}
                  >
                    {t('settings_notification_use_email_title')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Box>
      )}
    </Formik>
  );
};

SettingForm.propTypes = {
  // @ts-ignore
  user: PropTypes.object.isRequired
};

export default SettingForm;
