import React from "react";
import { useIsFetching, useIsMutating } from "react-query";

import { styled } from "@material-ui/core/styles";
import { Modal, CircularProgress } from "@material-ui/core";
import Routes from "./Routes";

import { Auth } from "@psyrenpark/auth";
import { Api } from "@psyrenpark/api";
import { Storage } from "@psyrenpark/storage";
import awsmobile from "./aws-exports";
Auth.setConfigure(awsmobile);
Api.setConfigure(awsmobile);
Storage.setConfigure(awsmobile);

const StyledModal = styled(Modal)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  "& .MuiCircularProgress-root": {
    outline: "none",
  },
});

const App = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  return (
    <>
      <Routes />

      <StyledModal open={!!isFetching || !!isMutating}>
        <CircularProgress size={80} />
      </StyledModal>
    </>
  );
};

export default App;
