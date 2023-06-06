import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
  SvgIcon,
  Button,
  Link,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import AddIcon from 'src/icons/Add';
import ClientDetails from 'src/components/client/ClientListView/ClientOverview';
import { useTranslation } from 'react-i18next';
import jwtDecode from 'jwt-decode';

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    marginBottom: '26px'
  },
  addNewClient: {
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
  text: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 500,
    fontStyle: 'normal',
    color: 'white'
  },
  buttonWrapperLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));
const ClientOverview: FC = () => {
  const classes = useStyles();
  const { settings } = useSettings();
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);

  const decoded: any = jwtDecode(localStorage.getItem('accessToken'));
  const roles = decoded?.realm_access?.roles;
  const isClientUser = roles?.includes('client_admin') || roles?.includes('client_user');
  const isSubClientUser = roles?.includes('sub_client_admin') || roles?.includes('sub_client_user');

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          pt: 4,
          pb: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
            className={classes.container}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                User
              </Typography>
            </Grid>
            {(!isClientUser || !isSubClientUser) && (
              <Grid
                item
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/admin/users/create"
                  variant="subtitle2"
                  className={classes.buttonWrapperLink}
                >
                  <Button
                    color="secondary"
                    variant="contained"
                    className={classes.addNewClient}
                    startIcon={(
                      <SvgIcon fontSize="medium">
                        <AddIcon />
                      </SvgIcon>
                    )}
                  >
                    {t('clients_add_new')}
                  </Button>
                </Link>
              </Grid>
            )}
          </Grid>
          <ClientDetails />
        </Container>
      </Box>
    </>
  );
};

export default ClientOverview;
