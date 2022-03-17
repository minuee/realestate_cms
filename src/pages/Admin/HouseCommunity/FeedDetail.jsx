import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { apiObject } from "api";
import { useConfirmModal } from "hooks";
import { thousandSeparator } from "common";
import dayjs from "dayjs";

import { Box, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Typography, Button } from "components/Mui";
import { RowTable, Title, ReplyList } from "components";

export const HouseFeedDetail = ({ location }) => {
  const history = useHistory();
  const { apart_code, apart_story_pk } = useParams();
  const { data, isloading } = useQuery(["getHouseFeedDetail", { apart_story_pk }]);
  const { mutate } = useMutation(apiObject.removeHouseFeed);
  const { ConfirmModal, openModal } = useConfirmModal(["removeFeed"]);

  const table_head = [
    [
      { head: "작성자", render: ({ member }) => member?.name },
      { head: "작성일자", render: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD HH:mm") },
    ],
    [
      { head: "조회수", render: ({ viewCount }) => thousandSeparator(viewCount) },
      { head: "좋아요수", render: ({ likeCount }) => thousandSeparator(likeCount) },
    ],
    { head: "글내용", render: ({ contents }) => <Typography whiteSpace="pre-wrap">{contents}</Typography> },
  ];

  async function removeFeed() {
    mutate({ apart_story_pk });
    history.push(`/house_community/${apart_code}`);
  }

  return (
    <Box>
      <Title>{isloading ? <Skeleton width="250px" height="35px" /> : location.state?.articlename}</Title>

      <Box my={2} borderTop="solid 2px #000">
        <RowTable head={table_head} data={data?.data?.apartStory} />
      </Box>

      <Grid container justify="flex-end">
        <Button width={150} py={1.5} mr={1} onClick={() => history.goBack()}>
          <Typography fontWeight="700">뒤로</Typography>
        </Button>
        <Button width={150} py={1.5}  onClick={() => history.push(`/house_community/${apart_code}`)}>
          <Typography fontWeight="700">처음으로</Typography>
        </Button>
        <Button width={150} py={1.5} ml={1} onClick={() => openModal("removeFeed")}>
          <Typography fontWeight="700">삭제</Typography>
        </Button>
      </Grid>

      <ReplyList target_pk={apart_story_pk} class_type="Apart" />

      <ConfirmModal title="해당 항목을 삭제하시겠습니까?" isDestructive action={removeFeed} modalKey="removeFeed" />
    </Box>
  );
};
