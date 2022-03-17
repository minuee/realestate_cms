import React, { useState } from "react";
import { Box, Dialog } from "@material-ui/core";
import { Typography, Button } from "components/Mui";
export const useConfirmModal = (modalKeys = []) => {
  const [modalOpen, setModalOpen] = useState(modalKeys.reduce((a, v) => ({ ...a, [v]: false }), {}));
  function openModal(modalKey) {
    setModalOpen({
      ...modalOpen,
      [modalKey]: true,
    });
  }

  const ConfirmModal = ({ title, content, action, isDestructive, modalKey,addButton = null }) => {
    function handleClose() {
      setModalOpen({ ...modalOpen, [modalKey]: false });
    }

    return (
      <Dialog open={modalOpen[modalKey]} onClose={handleClose}>
        <Box py={4} px={6}>
          <Typography mb={6} variant="h6" fontWeight="500">
            {title}
          </Typography>
          {content && (
            <Typography mb={4} whiteSpace="pre-wrap">
              {content}
            </Typography>
          )}
          {
          /*modalKey === 'reject' &&
            <Box m={1}>
              {addButton}
            </Box>
          */}
          <Box display="flex" justifyContent="flex-end" mr={-4} mb={-2}>
            <Button autoFocus variant="text" onClick={handleClose}>
              취소
            </Button>
            <Button
              color={isDestructive ? "secondary" : "primary"}
              variant={isDestructive ? "outlined" : "contained"}
              onClick={() => {
                handleClose();
                action();
              }}
            >
              확인
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  };

  return { ConfirmModal, openModal };
};
