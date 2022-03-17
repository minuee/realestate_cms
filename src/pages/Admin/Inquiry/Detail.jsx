import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useConfirmModal } from "hooks";
import { apiObject } from "api";
import { encrypt, decrypt} from "common";
import { makeStyles, Box, Grid, TextField } from "@material-ui/core";
import { Typography, Button } from "components/Mui";
import { RowTable, Title, Editor } from "components";

const useStyles = makeStyles((theme) => ({}));

export const InquiryDetail = () => {
  const history = useHistory();
  const { inquiry_pk } = useParams();
  const { data, refetch } = useQuery(["getInquiryDetail", { inquiry_pk }]);
  const replyMutation = useMutation(apiObject.replyInquiry, { onSuccess: refetch });
  const { ConfirmModal, openModal } = useConfirmModal(["answer"]);
  const [answerContent, setAnswerContent] = useState("");

  const inquiry_head = [
    [
      {
        head: "제목",
        key: "title",
      },
      {
        head: "작성자",
        key: "user_name",
      },
    ],
    {
      head: "내용",
      key: "contents",
      render: ({ contents }) => (
        <Typography style={{ minHeight: "200px" }} whiteSpace="pre-wrap">
          {contents}
        </Typography>
      ),
    },
  ];
  const reply_head = [
    {
      head: "답변내용",
      key: "answer",
      render: ({ is_answer, answer_contents }) =>
        is_answer ? (
          <Typography style={{ minHeight: "200px" }} whiteSpace="pre-wrap">
            {answer_contents}
          </Typography>
        ) : (
          <TextField
            fullWidth
            multiline
            rows={15}
            placeholder="답변을 입력해주세요"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
          />
          // <Editor data={answerContent} setData={setAnswerContent} />
        ),
    },
  ];

  return (
    <Box>
      <Title>문의내역</Title>

      <Box my={2}>
        <RowTable head={inquiry_head} data={data} />
        <Box my={2} />
        <RowTable head={reply_head} data={data} />
      </Box>

      <Grid container justify="flex-end">
        <Button width={170} py={1.5} mr={1} onClick={() => history.goBack()}>
          <Typography fontWeight="700">뒤로</Typography>
        </Button>
        <Button width={170} py={1.5} mr={1} onClick={() => history.push("/inquiry")}>
          <Typography fontWeight="700">처음으로</Typography>
        </Button>
        {!data?.answer_date && (
          <Button width={170} py={1.5} color="secondary" disabled={!answerContent} onClick={() => openModal("answer")}>
            <Typography fontWeight="700">답변하기</Typography>
          </Button>
        )}
      </Grid>

      <ConfirmModal
        title="입력하신 내용으로 문의 답변을 발송하시겠습니까?"
        action={() =>
          replyMutation.mutate({
            inquiry_pk,
            receiver_name: data.user_name,
            receiver_email: decrypt(data.uid),
            // receiver_name: "테스트이메일",
            // receiver_email: "sycho99@svcorps.com",
            contents: data.contents,
            answer_contents: answerContent,
          })
        }
        modalKey="answer"
      />
    </Box>
  );
};
