import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useConfirmModal } from "hooks";
import { apiObject } from "api";

import { Box, Grid } from "@material-ui/core";
import { Typography, Button } from "components/Mui";
import { Title, Editor } from "components";

export const ServiceDetail = () => {
  const [serviceData, setServiceData] = useState("");
  const { data, refetch } = useQuery(["getTerms"]);
  const privacyMutation = useMutation(apiObject.updateTerm, { onSuccess: refetch });
  const { ConfirmModal, openModal } = useConfirmModal(["cancel", "update"]);

  useEffect(() => {
    setServiceData(data?.use_stipulation);
  }, [data]);

  return (
    <Box>
      <Title>이용약관</Title>

      <Box mt={4} mb={2}>
        <Editor data={serviceData} setData={setServiceData} />
      </Box>

      <Grid container justify="flex-end">
        <Button
          width={170}
          py={1.5}
          disabled={data?.use_stipulation == serviceData}
          onClick={() => openModal("cancel")}
        >
          <Typography fontWeight="700">취소</Typography>
        </Button>
        <Button
          width={170}
          py={1.5}
          ml={1}
          color="primary"
          disabled={data?.use_stipulation == serviceData}
          onClick={() => openModal("update")}
        >
          <Typography fontWeight="700">저장</Typography>
        </Button>
      </Grid>

      <ConfirmModal
        title="이용약관을 수정하기 이전으로 되돌리시겠습니까?"
        action={() => setServiceData(data?.use_stipulation)}
        modalKey="cancel"
      />
      <ConfirmModal
        title="입력한 내용으로 이용약관을 수정하시겠습니까?"
        action={() => privacyMutation.mutate({ term_type: "use", content: serviceData })}
        modalKey="update"
      />
    </Box>
  );
};
