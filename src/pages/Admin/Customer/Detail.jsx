import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { thousandSeparator } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import { Box, Grid } from "@material-ui/core";
import { Typography, Button } from "components/Mui";
import { RowTable, Title } from "components";
import { useConfirmModal } from "hooks";

const table_head = [
  {
    head: "이메일주소",
    key: "uid",
  },
  {
    head: "닉네임",
    key: "nickname",
  },
  {
    head: "이용횟수",
    key: "login_count",
    render: ({ login_count }) => thousandSeparator(login_count),
  },
  {
    head: "비고",
    key: "join_type_text",
    render: ({ is_status, join_type_text }) =>
      is_status === "stop" ? <span style={{ color: "red" }}>삭제됨</span> : join_type_text,
  },
  {
    head: "가입일자",
    key: "reg_date",
    render: ({ reg_date }) => (reg_date ? dayjs(reg_date).format("YYYY-MM-DD") : ""),
  },
];

export const CustomerDetail = () => {
  const history = useHistory();
  const { member_pk } = useParams();
  const { data } = useQuery(["getMemberDetail", { member_pk }]);
  
  const mutation = useMutation(apiObject.removeMember, {    
    onError : () => alert("오류가 발생되어 삭제되지 않았습니다."),
    onSuccess: () => history.goBack(),
  });
  
 /*
  const mutation = await useMutation(apiObject.removeMember, {
    errorPolicy: 'all',
  });
  console.log('mutation',mutation)
  if ( mutation.data.code === '0000') {
    alert("정상적으로 삭제되었습니다");
    history.goBack()
  }else{
    alert("오류가 발생되어 삭제되지 않았습니다.")
  }
  */
  const { ConfirmModal, openModal } = useConfirmModal(["delete"]);

  return (
    <Box>
      <Title>회원정보</Title>

      <Box my={2} borderTop="solid 2px #000">
        <RowTable head={table_head} data={data} />
      </Box>

      <Grid container justify="flex-end">
        <Button width={150} py={1.5} mr={1} onClick={() => history.goBack()}>
          <Typography fontWeight="700">뒤로</Typography>
        </Button>
        <Button width={150} py={1.5} onClick={() => history.push("/member/customer")}>
          <Typography fontWeight="700">처음으로</Typography>
        </Button>
        {data?.is_status !== "stop" && (
          <Button width={150} py={1.5} ml={1} onClick={() => openModal("delete")}>
            <Typography fontWeight="700">삭제</Typography>
          </Button>
        )}
      </Grid>

      <ConfirmModal
        title="해당 회원을 삭제하시겠습니까?"
        content={`이메일: ${data?.uid}
이름: ${data?.name}
닉네임: ${data?.nickname}
`}
        isDestructive
        action={() => mutation.mutate({ member_pk })}
        modalKey="delete"
      />
    </Box>
  );
};
