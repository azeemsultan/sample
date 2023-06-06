import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography, makeStyles } from '@material-ui/core';
import { ClientAddForm } from 'src/components/client/ClientAddView';
import useSettings from 'src/hooks/useSettings';
import ChevronRightIcon from 'src/icons/ChevronRight';
import gtm from 'src/lib/gtm';

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

const ClientAddView: FC = () => {
  const classes = useStyles();
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Add User</title>
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
                  Users
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Add User
                </Typography>
              </Breadcrumbs>
              <Typography
                color="textPrimary"
                variant="h5"
                className={classes.title}
              >
                Add User
              </Typography>
            </Grid>
          </Grid>
          <Box mt={3}>
            <ClientAddForm />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ClientAddView;
