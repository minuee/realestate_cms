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
    { head: "??????", key: "title" },
    [
      { head: "??????", key: "board_type_name" },
      { head: "?????????",
        render: ({ is_notice }) => (
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box display="flex">
              <Button mr={1} color={is_notice ? 'primary' :"secondary"} disabled={is_notice} onClick={() => openModal("noticeRegist")}>
                ??????
              </Button>
              <Button variant="outlined" color={is_notice ? 'primary' : "secondary"} disabled={!is_notice} onClick={() => openModal("noticeRemove")}>
                ??????
              </Button>            
            </Box>
          </Box>
        ),
      } 
    ],
    [
      { head: "?????????", render: ({ member }) => member?.name },
      { head: "????????????", render: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD") },
    ],
    [
      { head: "?????????", render: ({ viewCount }) => thousandSeparator(viewCount) },
      { head: "????????????", render: ({ likeCount }) => thousandSeparator(likeCount) },
    ],
    { head: "?????????", render: ({ contents }) => <Typography whiteSpace="pre-wrap">{contents}</Typography> },
    {
      head: "?????? ?????????",
      render: ({ imageList }) => (
        <Box display="flex">
          {imageList?.length !== 0 &&
            imageList?.map((item, index) => (
              <Box display="flex" alignItems="center" key={index}>
                <ImageOutlined style={{ marginRight: "10px" }} />
                {` ${item?.name || "-"}.${item?.type || "-"} (${item?.size / 1000000 || "-"}KB)`}
              </Box>
            ))}
          {!imageList?.length && <Typography>????????? ???????????? ????????????</Typography>}
        </Box>
      ),
    },
    {
      head: "????????? ????????????",
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
      head: "????????????",
      key: "reply",
      render: () =>
         (
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="????????? ??????????????????"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
          />
          
        )
    },
  ];

  return (
    <Box>
      <Title>{data?.data?.estateStory?.board_type_name} ??????</Title>

      <Box my={2} borderTop="solid 2px #000">
        <RowTable head={table_head} data={data?.data?.estateStory} />
      </Box>

      <Grid container justify="flex-end">
        <Button width={150} py={1.5} mr={1} onClick={() => history.goBack()}>
          <Typography fontWeight="700">??????</Typography>
        </Button>
        <Button width={150} py={1.5} onClick={() => history.push("/community")}>
          <Typography fontWeight="700">????????????</Typography>
        </Button>
        <Button width={150} py={1.5} ml={1} onClick={() => openModal("removeFeed")}>
          <Typography fontWeight="700">??????</Typography>
        </Button>
      </Grid>
      <Grid container justify="flex-end">      
        <Box width={'88%'} py={1.5} mr={1}>  
          <RowTable head={reply_head} data={data} />
        </Box>
        <Box width={'9%'} py={1.5} mt={2} justify="center" alignItems="center">  
          <Button width={100} py={1.5} color="secondary" disabled={!answerContent} onClick={() => openModal("registReply")}>
            <Typography fontWeight="700">??????</Typography>
          </Button>
        </Box>
        </Grid>
      <ReplyList target_pk={estate_story_pk} class_type="House" />

      <ConfirmModal
        title="??? ????????? ???????????? ?????????????????????????"
        isDestructive
        action={() => removeCommunityFeed({ estate_story_pk })}
        modalKey="removeFeed"
      />
      <ConfirmModal
        title="????????? ?????????????????????????"
        isDestructive
        action={() => registReply({ estate_story_pk,answerContent })}
        modalKey="registReply"
      />
      <ConfirmModal
        title="???????????? ?????????????????????????"
        isDestructive
        action={() => registNotice({ estate_story_pk })}
        modalKey="noticeRegist"
      />
      <ConfirmModal
        title="??????????????? ?????????????????????????"
        isDestructive
        action={() => removeNotice({ estate_story_pk })}
        modalKey="noticeRemove"
      />
    </Box>
  );
};
