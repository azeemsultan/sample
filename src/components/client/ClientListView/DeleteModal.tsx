import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { ClientDeleteProps } from 'src/types/client';
import type { FC } from 'react';

import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { clientApi } from 'src/api/clientApi';

const useStyles = makeStyles(() => ({
  deleteBtn: {
    color: '#AB3535',
    '&:hover': {
      background: 'transparent'
    }
  },
  cancelBtn: {
    color: '#6b778c',
    '&:hover': {
      background: 'transparent'
    }
  },
  loadingCircle: {
    color: '#DF1683',
    width: '20px !important',
    height: '20px !important',
    marginLeft: 5,
    marginRight: 5
  },
}));
const DeleteModal: FC<ClientDeleteProps> = (props) => {
  const classes = useStyles();
  const { clientsList, openDeleteModal, setOpenDeleteModal } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleModalClose = () => {
    setOpenDeleteModal(false);
  };

  const locale = localStorage.getItem('locale');
  const { t } = useTranslation(locale);

  const bulkDeActivateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await clientApi.bulkDeActivate(clientsList);
      const msg = t('clients_bulk_deactivated_message');
      toast.dismiss();
      toast.error(msg, {
        duration: 10000,
      });
      window.location.href = '/admin/clients';
    } catch (err) {
      // logger(err, 'error');
    }
  };

  return (
    <Dialog
      open={openDeleteModal}
      onClose={handleModalClose}
    >
      <DialogTitle>
        <strong>Are you sure?</strong>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You want to delete Records?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleModalClose}
          className={classes.cancelBtn}
        >
          Cancel
        </Button>
        <Button
          onClick={bulkDeActivateUser}
          autoFocus
          className={classes.deleteBtn}
          disabled={isSubmitting}
        >
          Delete
          { isSubmitting && (<CircularProgress className={classes.loadingCircle} />)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteModal.propTypes = {
  clientsList: PropTypes.array,
  openDeleteModal: PropTypes.bool,
  setOpenDeleteModal: PropTypes.func,
};

DeleteModal.defaultProps = {
  openDeleteModal: false
};

export default DeleteModal;
