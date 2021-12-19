import React from "react";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useSearchParams, useConfirmModal } from "hooks";
import { useQuery, useMutation } from "react-query";
import { apiObject } from "api";

import { Box, Grid } from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { Image, Title } from "components";

export const ReplyList = ({ target_pk, class_type, ...props }) => {
  const location = useLocation();
  const { search_params, Pagination } = useSearchParams(location);
  const { data, refetch } = useQuery(["getReplyList", { target_pk, class_type, ...search_params }]);

  return (
    <Box {...props}>
      <Title variant="h6">{`${class_type === "Agent" ? "리뷰" : "댓글"} (${data?.total || "-"})`}</Title>
      <Box mt={2}>
        {data?.data?.replyList?.length === 0 ? (
          <Box p={2} bgcolor="#fff" textAlign="center">
            <Typography>리뷰 데이터가 없습니다</Typography>
          </Box>
        ) : (
          <>
            {data?.data?.replyList?.map((item, index) => (
              <ReplyBox data={item} refetch={refetch} key={index} />
            ))}
          </>
        )}
      </Box>
      <Box pt={6} pb={12} position="relative">
        <Pagination total={data?.total} />
      </Box>
    </Box>
  );
};

const ReplyBox = ({ data, refetch }) => {
  const { mutate } = useMutation(apiObject.removeReply, { onSuccess: refetch });
  const { ConfirmModal, openModal } = useConfirmModal(["removeReply"]);

  return (
    <Box pb={2}>
      <Box my={1} px={4} py={2} display="flex" bgcolor="#fff">
        <Image
          mr={4}
          borderRadius="50%"
          width="70px"
          height="70px"
          src={data?.img_url || "/image/default_avatar.png"}
        />

        <Box flex="1">
          <Grid container justify="space-between" alignItems="center">
            <Typography fontWeight="500">{data?.member.name}</Typography>
            <Box>
              <Typography mr={2} variant="body2" color="textSecondary" display="inline">
                {dayjs(data?.reg_date).format("YYYY-MM-DD HH:mm")}
              </Typography>

              <Button variant="text" style={{ color: "#999" }} onClick={() => openModal("removeReply")}>
                <DeleteOutlined fontSize="small" />
                <Typography variant="body2" ml={0.5}>
                  삭제
                </Typography>
              </Button>
            </Box>
          </Grid>

          <Typography mt={1}>{data?.contents}</Typography>
        </Box>
      </Box>
      <Box pl={10}>
        {data.childs.map((item, index) => (
          <ReReplyBox data={item} refetch={refetch} key={index} />
        ))}
      </Box>
      <ConfirmModal
        title="선택한 댓글을 삭제하시겠습니까?"
        content={`작성일: ${dayjs(data?.reg_date).format("YYYY-MM-DD HH:mm")}
작성자: ${data?.member.name}
내용: ${data?.contents}
`}
        isDestructive
        action={() => mutate({ reply_pk: data?.reply_pk })}
        modalKey="removeReply"
      />
    </Box>
  );
};

const ReReplyBox = ({ data, refetch }) => {
  const { mutate } = useMutation(apiObject.removeReply, { onSuccess: refetch });
  const { ConfirmModal, openModal } = useConfirmModal(["removeReply"]);

  return (
    <Box>
      <Box my={1} display="flex" alignItems="center">
        <Image mr={4} borderRadius="50%" width="30px" height="30px" src={"/image/rereply.png"} />

        <Box flex="1" px={4} py={2} bgcolor="#fff">
          <Typography mb={0.5}>{data?.contents}</Typography>
          <Grid container justify="space-between" alignItems="center">
            <Typography mr={2} variant="body2" color="textSecondary" display="inline">
              {dayjs(data?.reg_date).format("YYYY-MM-DD HH:mm")}
            </Typography>

            <Button variant="text" style={{ color: "#999" }} onClick={() => openModal("removeReply")}>
              <DeleteOutlined fontSize="small" />
              <Typography variant="body2" ml={0.5}>
                삭제
              </Typography>
            </Button>
          </Grid>
        </Box>
      </Box>

      <ConfirmModal
        title="선택한 대댓글을 삭제하시겠습니까?"
        isDestructive
        action={() => mutate({ reply_pk: data?.reply_pk })}
        modalKey="removeReply"
      />
    </Box>
  );
};
