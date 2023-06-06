import { FC, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  Button,
  Typography,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
// import { useTheme, useMediaQuery } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import QuestionCircle from 'src/icons/QuestionCircle';
import getRegisterDataType from 'src/utils/getRegisterDataType';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiIconButton-label': {
      fontSize: 15,
      paddingTop: 4,
      color: '#172b4d',
    },
    '& .MuiIconButton-root': {
      '&:hover': {
        background: 'transparent !important',
        cursor: 'default',
      },
      '& .MuiTouchRipple-root': {
        display: 'none',
      },
    },
  },
  moreInfoButton: {
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
    '& svg': {
      fill: '#172b4d',
      width: 20,
      height: 20,
      strokeWidth: 10,
      stroke: '#172b4d',
    },
    '&:hover': {
      background: 'transparent !important',
      '& svg': {
        fill: theme.palette.secondary.main,
      },
    }
  },
}));

interface CustomPopOverProps {
  deviceRegister?: any;
  status?: any;
}

const CustomPopOver: FC<CustomPopOverProps> = (props) => {
  const classes = useStyles();
  const { deviceRegister, status } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('e', e);
    setAnchorEl(e?.currentTarget);
  };

  const handleMouseLeave = () => {
    console.log('sss', status?.nr);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `simple-popover-${status?.nr}` : undefined;

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        className={classes.moreInfoButton}
        onMouseEnter={(e) => handleMouseEnter(e)}
        onMouseLeave={handleMouseLeave}
        onClick={handleModalOpen}
      >
        <QuestionCircle
          sx={{ ml: 2 }}
        />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        sx={{
          pointerEvents: 'none',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleMouseLeave}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2 }}>
          <ul
            style={{
              margin: '0',
              paddingLeft: 15,
            }}
          >
            {status?.list === '' ? (
              <>
                <li>
                  <strong>
                    {t('custom_popover_min_value')}
                    :
                    &nbsp;
                    {status?.min_value}
                    {status?.unit !== '%' && (' ') }
                    {getRegisterDataType(deviceRegister, status)}
                  </strong>
                </li>
                <li>
                  <strong>
                    {t('custom_popover_max_value')}
                    :
                    &nbsp;
                    {status?.max_value}
                    {status?.unit !== '%' && (' ') }
                    {getRegisterDataType(deviceRegister, status)}
                  </strong>
                </li>
              </>
            ) : (
              <li>
                <strong>
                  {t('custom_popover_list_options')}
                  :
                  &nbsp;
                  {JSON.stringify(status?.list)?.replace(/\{\}/, '')}
                </strong>
              </li>
            )}
            <li>
              <strong>
                {t('custom_popover_short_description')}
                :
                &nbsp;
                {t(`custom_popover_${status?.nr}_short_description`)}
              </strong>
            </li>
          </ul>
        </Typography>
      </Popover>
      <Dialog
        fullScreen={fullScreen}
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {t(status?.name || '')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(`custom_popover_${status?.nr}_long_description`)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleModalClose}
          >
            {t('custom_popover_close_modal_button')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

CustomPopOver.propTypes = {
  deviceRegister: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
};

export default CustomPopOver;
