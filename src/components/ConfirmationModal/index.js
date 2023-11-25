import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Container, Grid, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(4, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 1.5),
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(3, 1),
  },
}));

const StyledDialogTitle = styled(Typography)({
  variant: 'h4',
  component: 'h3',
});

function ConfirmationModal(props) {
  const { handleClose, open, type, handleOpenModal } = props;

  return (
    <div>
      <Dialog onClose={handleClose} fullWidth open={open}>
        <StyledContainer maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <StyledDialogTitle>Are you sure you want to {type} this entry!</StyledDialogTitle>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleOpenModal}
                startIcon={<CheckOutlinedIcon />}
              >
                Yes
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" size="large" onClick={handleClose} startIcon={<CancelOutlinedIcon />}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </StyledContainer>
      </Dialog>
    </div>
  );
}

ConfirmationModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
};

export default ConfirmationModal;
