import type { FC } from 'react';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Container, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import gtm from '../lib/gtm';

const NoContentFound: FC = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Error: Not Found | IT22 Admin Panel</title>
      </Helmet>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'background.paper',
          display: 'flex',
          minHeight: '100%',
          px: 3,
          py: '80px'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            align="center"
            color="textPrimary"
            variant={mobileDevice ? 'h4' : 'h1'}
          >
            Error: Not Found
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 6
              }}
            >
              <Button
                color="primary"
                component={RouterLink}
                to="/"
                variant="outlined"
              >
                Back to Dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NoContentFound;
