import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useConfirmModal } from "hooks";
import { thousandSeparator } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import { makeStyles, Box, Grid, Select, MenuItem } from "@material-ui/core";
import { Typography, Button } from "components/Mui";
import { RowTable, Title } from "components";

const useStyles = makeStyles((theme) => ({}));

export const SubscribeDetail = () => {
  const { settlement_pk } = useParams();
  const { data } = useQuery(["getSubscribeDetail", { settlement_pk }]);
  const { mutate } = useMutation(apiObject.modifySubscribeStatus);
  const { ConfirmModal, openModal } = useConfirmModal(["modify"]);
  const history = useHistory();

  const table_head = [
    [
      {
        head: "닉네임",
        render: ({ member }) => member?.nickname,
      },
      {
        head: "이메일주소",
        render: ({ member }) => member?.uid,
      },
    ],
    [
      {
        head: "결제일자",
        render: ({ start_date }) => dayjs.unix(start_date).format("YYYY-MM-DD"),
      },
      {
        head: "만료일자",
        render: ({ end_date }) => (end_date ? dayjs.unix(end_date).format("YYYY-MM-DD") : "-"),
      },
    ],
    [
      {
        head: "서비스",
        render: ({ gubun_text }) => gubun_text,
      },
      {
        head: "결제금액",
        render: ({ cost }) => `${thousandSeparator(cost)}원`,
      },
    ],
    {
      head: "구독상태",
      render: ({ is_status, status_text,stop_date }) => (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>
            {status_text}
            {is_status === "stop" && (
              "  (신청일자"+dayjs.unix(stop_date).format("YYYY-MM-DD") + ")"
              )
          }
          </Typography>
         
          {is_status === "stop2" && (
            <Box display="flex" alignItems="center">
              <Button ml={1} color="primary" onClick={() => openModal("modify")}>
                해지 승인
              </Button>
            </Box>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Title>결제 관리</Title>

      <Box my={2} borderTop="solid 2px #000">
        <RowTable head={table_head} data={data?.data?.settlement} />
      </Box>

      <Grid container justify="flex-end">
        <Button width={170} py={1.5} mr={1} onClick={() => history.goBack()}>
          <Typography fontWeight="700">뒤로</Typography>
        </Button>
        <Button width={170} py={1.5} mr={1} color="secondary" onClick={() => history.push("/subscribe")}>
          <Typography fontWeight="700">처음으로</Typography>
        </Button>
      </Grid>

      <ConfirmModal
        title="해당 회원의 구독정보를 변경하시겠습니까?"
        action={() => mutate({ settlement_pk, status: "end" })}
        modalKey="modify"
      />
    </Box>
  );
};
