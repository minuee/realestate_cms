import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useSearchParams } from "hooks";
import { thousandSeparator } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import { makeStyles, Box, Grid } from "@material-ui/core";
import { Typography } from "components/Mui";
import { ColumnTable, Title, ExcelButton } from "components";

const useStyles = makeStyles((theme) => ({}));

const sort_list = [
  {
    label: "등록순",
    value: "reg_date",
  },
  {
    label: "조회수순",
    value: "view_cnt",
  },
  {
    label: "좋아요순",
    value: "like_count",
  },
];
const house_community_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  {
    Header: "제목",
    accessor: "title",
    // accessor: ({ contents }) => (contents?.length > 20 ? `${contents.substr(0, 20)}...` : contents),

    // id: "content",
    // accessor: ({ content }) => (
    //   <Typography
    //     style={{
    //       textOverflow: "ellipsis",
    //       overflow: "hidden",
    //       whiteSpace: "nowrap",
    //       width: "calc(100% - 600)",
    //       maxWidth: "calc(100% - 600)",
    //     }}
    //   >
    //     {content}
    //   </Typography>
    // ),

    // accessor: "content",
    // style: {
    //   textOverflow: "ellipsis",
    //   overflow: "hidden",
    //   whiteSpace: "nowrap",
    //   width: "calc(100% - 600px)",
    //   maxWidth: "calc(100% - 600px)",
    // },
  },
  // { Header: "닉네임", id: "nickname", accessor: ({ member }) => member?.nickname },
  {
    Header: "작성일자",
    id: "reg_date",
    accessor: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD HH:mm"),
    width: 160,
  },
  {
    Header: "댓글수",
    id: "replyCount",
    accessor: ({ replyCount }) => thousandSeparator(replyCount) || "-",
    width: 80,
  },
  {
    Header: "조회수",
    id: "viewCount",
    accessor: ({ viewCount }) => thousandSeparator(viewCount) || "-",
    width: 80,
  },
  {
    Header: "좋아요수",
    id: "likeCount",
    accessor: ({ likeCount }) => thousandSeparator(likeCount) || "-",
    width: 100,
  },
];

export const HouseFeedList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { apart_code } = useParams();
  const { search_params, Pagination, SearchBox, SortBox } = useSearchParams(location);
  const { data } = useQuery(["getHouseFeedList", { apart_code, ...search_params }]);

  return (
    <Box>
      <Grid container justify="space-between">
        <Title>{data?.data?.apartName}</Title>
        {/* <SortBox item_list={sort_list} default_item="reg_date" /> */}
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={house_community_columns}
          data={data?.data?.apartStoryList || []}
          onRowClick={(row) => history.push(`/house_community/${apart_code}/${row.apart_story_pk}`)}
        />
      </Box>

      <Box position="relative" display="flex" justifyContent="space-between" alignItems="center">
        <ExcelButton />
        <Pagination total={data?.total} />
        <SearchBox />
      </Box>
    </Box>
  );
};
