import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";

import React from "react";
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const ChangeCurrencyDialog = ({ open, handleClose, handleSelectCurrency }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Dialog
      open={open}
      // TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Conversion Notice ! "}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Please note this is a Temporary
          <span style={{ color: "orange" }}>
            {" "}
            Balance Conversion Display Only,
          </span>{" "}
          and it won&apos;t change your
          <span style={{ color: "orange" }}>
            {" "}
            Base Currency Balance in {user?.currency?.code}.
          </span>{" "}
          <br />
          <br />
          All Transactions will still be carried out in{" "}
          <span style={{ color: "orange" }}>{user?.currency?.code}</span> <br />
          <br /> Contact our support team if you wish to permanently change your
          base currency.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleClose();
            handleSelectCurrency();
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeCurrencyDialog;
