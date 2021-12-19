import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { apiObject } from "api";
import { useConfirmModal } from "hooks";

import { Box, Grid } from "@material-ui/core";
import { Typography, Button } from "components/Mui";
import { Title, Editor } from "components";

export const PrivacyDetail = () => {
  const [privacyData, setPrivacyData] = useState("");
  const { data, refetch } = useQuery(["getTerms"]);
  const privacyMutation = useMutation(apiObject.updateTerm, { onSuccess: refetch });
  const { ConfirmModal, openModal } = useConfirmModal(["cancel", "update"]);

  useEffect(() => {
    setPrivacyData(data?.private_stipulation);
  }, [data]);

  return (
    <Box>
      <Title>개인정보 취급방침</Title>

      <Box mt={4} mb={2}>
        <Editor data={privacyData} setData={setPrivacyData} />
      </Box>

      <Grid container justify="flex-end">
        <Button
          width={170}
          py={1.5}
          disabled={data?.private_stipulation == privacyData}
          onClick={() => openModal("cancel")}
        >
          <Typography fontWeight="700">취소</Typography>
        </Button>
        <Button
          width={170}
          py={1.5}
          ml={1}
          color="primary"
          disabled={data?.private_stipulation == privacyData}
          onClick={() => openModal("update")}
        >
          <Typography fontWeight="700">저장</Typography>
        </Button>
      </Grid>

      <ConfirmModal
        title="개인정보취급방침을 수정하기 이전으로 되돌리시겠습니까?"
        action={() => setPrivacyData(data?.private_stipulation || "")}
        modalKey="cancel"
      />
      <ConfirmModal
        title="입력한 내용으로 개인정보취급방침을 수정하시겠습니까?"
        action={() => privacyMutation.mutate({ term_type: "private", content: privacyData })}
        modalKey="update"
      />
    </Box>
  );
};
