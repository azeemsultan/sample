import { useEffect, useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  Tabs,
  Tab,
  makeStyles,
  SvgIcon,
  Button,
} from '@material-ui/core';
import {
  ClientDetail,
  Customization,
  UsersList,
  APIKeysList,
} from '../../components/client/ClientSingleView';
import { Client } from 'src/types/client';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { clientApi } from 'src/api/clientApi';
import { useTranslation } from 'react-i18next';
import logger from 'src/utils/logger';
import getId from 'src/utils/getId';
import capitalize from 'src/utils/capitalize';
import AddIcon from 'src/icons/Add';
import { isUndefined } from 'lodash';
import jwtDecode from 'jwt-decode';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  title: {
    marginTop: 10,
  },
  tab: {
    borderBottom: `1px solild ${theme.palette.primary.main}`,
    '&: button': {
      borderBottom: `1px solild ${theme.palette.primary.main}`,
      background: 'red',
    }
  },
  tabsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonWrapperLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  addNewUserButton: {
    textTransform: 'uppercase',
    borderRadius: 4,
    border: `1px solid ${theme.palette.secondary.main}`,
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      background: theme.palette.background.default,
      '& path': {
        fill: theme.palette.secondary.main,
      },
    }
  },
}));

const ClientSingleClientView: FC = () => {
  const { settings } = useSettings();
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true);
  const [client, setClient] = useState<Client>();
  const [tabs, setTabs] = useState<any>([
    {
      label: t('client_single_users_tab'),
      value: t('client_single_users_tab'),
    },
    {
      label: t('client_single_apis_tab'),
      value: t('client_single_apis_tab'),
    },
  ]);

  const firstTabValue = t('client_single_users_tab');

  const [currentTab, setCurrentTab] = useState<string>(firstTabValue);

  const getById = async () => {
    if (isSubmitting) {
      try {
        const userId = getId();
        const res = await clientApi.getById(+userId);
        setClient(res);
        if (res?.allow_customization) {
          tabs.push({
            label: t('client_single_customization_tab'),
            value: t('client_single_customization_tab'),
          });
          setTabs(tabs);
        }
        logger(res);
        setIsSubmitting(false);
      } catch (err) {
        logger(err, 'error');
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    if (isUndefined(client)) {
      getById();
    }
  }, []);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [isFortesAdmin, setIsFortesAdmin] = useState<boolean>(false);
  const [isFortesClientAdmin, setIsFortesClientAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')?.length > 0) {
      const decoded: any = jwtDecode(localStorage.getItem('accessToken'));
      const roles = decoded?.realm_access?.roles;
      setIsAdmin(roles?.includes('fortes_admin') || roles?.includes('fortes_user') || roles?.includes('client_admin') || roles?.includes('sub_client_admin'));
      setIsFortesAdmin(roles?.includes('fortes_admin'));
      setIsFortesClientAdmin(roles?.includes('fortes_admin')
        || roles?.includes('client_admin'));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>View Client</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2,
          pb: 10,
        }}

      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/admin/clients"
                  variant="subtitle2"
                >
                  {t('client_single_first_bread_crumb')}
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  {t('client_single_second_bread_crumb')}
                </Typography>
              </Breadcrumbs>
              <Typography
                color="textPrimary"
                variant="h5"
                className={classes.title}
              >
                { capitalize(client?.name)}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {!isUndefined(client?.name) && (
                <Grid
                  item
                  xs={12}
                >
                  <ClientDetail client={client} />
                </Grid>
              )}
              <Grid
                item
                md={8}
                xs={12}
                className={classes.tabsWrapper}
              >
                <Tabs
                  indicatorColor="secondary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  textColor="secondary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.value}
                      label={tab.label}
                      value={tab.value}
                      className={classes.tab}
                    />
                  ))}
                </Tabs>
                {(!isUndefined(client?.name) && isAdmin) && (
                  <Link
                    color="textPrimary"
                    component={RouterLink}
                    to={`/admin/client_users/create/${client.client_id}`}
                    variant="subtitle2"
                    className={classes.buttonWrapperLink}
                  >
                    <Button
                      color="secondary"
                      variant="contained"
                      className={classes.addNewUserButton}
                      startIcon={(
                        <SvgIcon fontSize="medium">
                          <AddIcon />
                        </SvgIcon>
                      )}
                    >
                      {t('client_single_add_new_user_button')}
                    </Button>
                  </Link>
                )}
              </Grid>
              {currentTab === t('client_single_users_tab') && (
                <Grid
                  item
                  md={8}
                  xs={12}
                >
                  <UsersList />
                </Grid>
              ) }
              {(currentTab === t('client_single_apis_tab') && (isFortesAdmin || isFortesClientAdmin)) && (
                <Grid
                  item
                  md={8}
                  xs={12}
                >
                  <APIKeysList client={client} />
                </Grid>
              ) }
              {(currentTab === t('client_single_customization_tab') && isAdmin) && (
                <Grid
                  item
                  md={8}
                  xs={12}
                >
                  <Customization client={client} />
                </Grid>
              )}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ClientSingleClientView;
