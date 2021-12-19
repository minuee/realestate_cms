import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery,useQueries, useMutation } from "react-query";
import { apiObject } from "api";
import { useConfirmModal } from "hooks";
import { thousandSeparator } from "common";
import dayjs from "dayjs";

import { makeStyles, Box, Grid, TextField } from "@material-ui/core";
import { ImageOutlined } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RowTable, Title, Image, ReplyList } from "components";

const useStyles = makeStyles((theme) => ({}));

export const CommunityFeedDetail = () => {
  const history = useHistory();

  const { estate_story_pk } = useParams();
  const { data } = useQuery(["getCommunityFeedDetail", { estate_story_pk }]);

  //const { mutate } = useMutation(apiObject.removeCommunityFeed, { onSuccess: () => history.push("/community") });
  const fn_removeCommunityFeed = useMutation(apiObject.removeCommunityFeed, { onSuccess: () => history.push("/community") });
  const fn_replyAddMutation = useMutation(apiObject.registCommunityReply, { onSuccess: () => history.go(0) });

  const fn_registNotice = useMutation(apiObject.updateBoardNotice, { onSuccess: () => history.go(0) });
  const fn_removeNotice = useMutation(apiObject.updateBoardNotice, { onSuccess: () => history.go(0) });
  
  const { ConfirmModal, openModal } = useConfirmModal(["removeFeed", "registReply",'noticeRegist','noticeRemove']);

  async function removeCommunityFeed({ estate_story_pk }) {
    fn_removeCommunityFeed.mutate({ estate_story_pk});
  }
  async function registReply({ estate_story_pk,answerContent }) {
    const fixedAdminPk = 364;
    fn_replyAddMutation.mutate({ estate_story_pk,answerContent,fixedAdminPk});
  }

  async function registNotice({ estate_story_pk }) {
    const is_bool = true;
    fn_registNotice.mutate({ estate_story_pk,is_bool});
  }
  async function removeNotice({ estate_story_pk }) {
    const is_bool = false;
    fn_removeNotice.mutate({ estate_story_pk,is_bool});
  }


  const table_head = [
    { head: "제목", key: "title" },
    [
      { head: "분류", key: "board_type_name" },
      { head: "공지글",
        render: ({ is_notice }) => (
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box display="flex">
              <Button mr={1} color={is_notice ? 'primary' :"secondary"} disabled={is_notice} onClick={() => openModal("noticeRegist")}>
                등록
              </Button>
              <Button variant="outlined" color={is_notice ? 'primary' : "secondary"} disabled={!is_notice} onClick={() => openModal("noticeRemove")}>
                해제
              </Button>            
            </Box>
          </Box>
        ),
      } 
    ],
    [
      { head: "작성자", render: ({ member }) => member?.name },
      { head: "작성일자", render: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD") },
    ],
    [
      { head: "조회수", render: ({ viewCount }) => thousandSeparator(viewCount) },
      { head: "좋아요수", render: ({ likeCount }) => thousandSeparator(likeCount) },
    ],
    { head: "글내용", render: ({ contents }) => <Typography whiteSpace="pre-wrap">{contents}</Typography> },
    {
      head: "첨부 이미지",
      render: ({ imageList }) => (
        <Box display="flex">
          {imageList?.length !== 0 &&
            imageList?.map((item, index) => (
              <Box display="flex" alignItems="center" key={index}>
                <ImageOutlined style={{ marginRight: "10px" }} />
                {` ${item?.name || "-"}.${item?.type || "-"} (${item?.size / 1000000 || "-"}KB)`}
              </Box>
            ))}
          {!imageList?.length && <Typography>첨부된 이미지가 없습니다</Typography>}
        </Box>
      ),
    },
    {
      head: "이미지 미리보기",
      render: ({ imageList }) => (
        <Box display="flex">
          {imageList?.map((item, index) => (
            <Image mr={1} width="170px" height="170px" src={item.img_url} key={index} />
          ))}
        </Box>
      ),
      //hidden: ({ imageList }) => !imageList.length,
    },
  ];

  const [answerContent, setAnswerContent] = useState("");
  const reply_head = [
    {
      head: "댓글달기",
      key: "reply",
      render: () =>
         (
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="댓글을 입력해주세요"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
          />
          
        )
    },
  ];

  return (
    <Box>
      <Title>{data?.data?.estateStory?.board_type_name} 상세</Title>

      <Box my={2} borderTop="solid 2px #000">
        <RowTable head={table_head} data={data?.data?.estateStory} />
      </Box>

      <Grid container justify="flex-end">
        <Button width={150} py={1.5} mr={1} onClick={() => history.goBack()}>
          <Typography fontWeight="700">뒤로</Typography>
        </Button>
        <Button width={150} py={1.5} onClick={() => history.push("/community")}>
          <Typography fontWeight="700">처음으로</Typography>
        </Button>
        <Button width={150} py={1.5} ml={1} onClick={() => openModal("removeFeed")}>
          <Typography fontWeight="700">삭제</Typography>
        </Button>
      </Grid>
      <Grid container justify="flex-end">      
        <Box width={'88%'} py={1.5} mr={1}>  
          <RowTable head={reply_head} data={data} />
        </Box>
        <Box width={'9%'} py={1.5} mt={2} justify="center" alignItems="center">  
          <Button width={100} py={1.5} color="secondary" disabled={!answerContent} onClick={() => openModal("registReply")}>
            <Typography fontWeight="700">등록</Typography>
          </Button>
        </Box>
        </Grid>
      <ReplyList target_pk={estate_story_pk} class_type="House" />

      <ConfirmModal
        title="이 부동산 이야기를 삭제하시겠습니까?"
        isDestructive
        action={() => removeCommunityFeed({ estate_story_pk })}
        modalKey="removeFeed"
      />
      <ConfirmModal
        title="댓글을 등록하시겠습니까?"
        isDestructive
        action={() => registReply({ estate_story_pk,answerContent })}
        modalKey="registReply"
      />
      <ConfirmModal
        title="공지글로 등록하시겠습니까?"
        isDestructive
        action={() => registNotice({ estate_story_pk })}
        modalKey="noticeRegist"
      />
      <ConfirmModal
        title="공지글에서 제거하시겠습니까?"
        isDestructive
        action={() => removeNotice({ estate_story_pk })}
        modalKey="noticeRemove"
      />
    </Box>
  );
};
