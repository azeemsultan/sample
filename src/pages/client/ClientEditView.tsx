import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography, makeStyles } from '@material-ui/core';
import { ClientEditForm } from 'src/components/client/ClientEditView';
import useSettings from 'src/hooks/useSettings';
import ChevronRightIcon from 'src/icons/ChevronRight';
import gtm from 'src/lib/gtm';
import { useTranslation } from 'react-i18next';

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
}));

const ClientEditView: FC = () => {
  const classes = useStyles();
  const { settings } = useSettings();
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>{ t('edit_clients_form_header') }</title>
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
                  { t('clients_bread_crumb_main_title') }
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  { t('edit_clients_bread_crumb_first_link') }
                </Typography>
              </Breadcrumbs>
              <Typography
                color="textPrimary"
                variant="h5"
                className={classes.title}
              >
                { t('edit_clients_form_header') }
              </Typography>
            </Grid>
          </Grid>
          <Box mt={3}>
            <ClientEditForm />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ClientEditView;
