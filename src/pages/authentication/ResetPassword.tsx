import { useEffect } from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
} from '@material-ui/core';

import {
  ResetPassword as Form
} from 'src/components/authentication/reset-password';
import gtm from '../../lib/gtm';

const useStyles = makeStyles((theme) => ({
  leftHeroWrapper: {
    display: 'flex',
  },
  leftHeroImage: {
    maxWidth: '40%',
    background: 'white',
    objectFit: 'cover',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  rightHeroImage: {
    minWidth: '60%',
    backgroundImage: "url('https://assets.it22.nl/fortes-energy/admin/login/fortes-login-right-hero.jpg')",
    background: 'white',
    objectFit: 'cover',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
      backgroundImage: "url('https://assets.it22.nl/fortes-energy/admin/login/fortes-login-right-hero-mobile.jpg')",
    }
  },
  imagesWrapper: {
    display: 'flex'
  },
  leftSideLogo: {
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
    width: '50vw',
    [theme.breakpoints.down('md')]: {
      width: '100vw'
    }
  },
  logo: {
    width: 170,
    height: '100%',
    objectFit: 'cover',
  },
  textWhite: {
    color: 'white'
  }
}));

const ResetPassword: FC = () => {
  const classes = useStyles();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Reset Password | IT22 Admin Panel</title>
      </Helmet>
      <Grid
        container
        className={classes.imagesWrapper}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          className={classes.leftHeroImage}
        >
          <a href="/">
            <div className={classes.leftHeroWrapper}>
              <div className={classes.leftSideLogo}>
                <img
                  className={classes.logo}
                  src="https://assets.it22.nl/it22/header/it22-layout-logo-black.webp"
                  alt="Logo"
                />
              </div>
            </div>
          </a>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          className={classes.rightHeroImage}
        >
          <Form />
        </Grid>
      </Grid>
    </>
  );
};

export default ResetPassword;
