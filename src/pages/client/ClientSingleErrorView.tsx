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
} from '@material-ui/core';
import {
  ClientDetail
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
import { isUndefined } from 'lodash';

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

const ClientSingleErrorView: FC = () => {
  const { settings } = useSettings();
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(true);
  const [client, setClient] = useState<Client>();
  const tabs = [
    {
      label: t('client_error_single_devices_tab'),
      value: t('client_error_single_devices_tab'),
    },
  ];

  const firstTabValue = t('client_error_single_devices_tab');

  const [currentTab, setCurrentTab] = useState<string>(firstTabValue);

  const getById = async () => {
    if (isSubmitting) {
      try {
        const userId = getId();
        const res = await clientApi.getById(+userId);
        setClient(res);
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
  return (
    <>
      <Helmet>
        <title>Error Client</title>
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
                <>
                  <Grid
                    item
                    xs={12}
                  >
                    <ClientDetail client={client} />
                  </Grid>

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
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ClientSingleErrorView;
