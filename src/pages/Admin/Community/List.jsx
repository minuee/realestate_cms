import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useSearchParams } from "hooks";
import { apiObject } from "api";
import { thousandSeparator } from "common";
import dayjs from "dayjs";

import { makeStyles, Box, Grid } from "@material-ui/core";
import { ColumnTable, Title, ExcelButton } from "components";

const useStyles = makeStyles((theme) => ({}));
const filter_list = [
  {
    label: "카테고리",
    value: "",
  },
  {
    label: "자유게시판",
    value: "Free",
  },
  {
    label: "가입인사",
    value: "Dialog",
  },
  {
    label: "부동산뉴스",
    value: "Realestate",
  },
  {
    label: "급매물게시판",
    value: "Deal",
  },
  {
    label: "재파게시판",
    value: "Owner",
  }
];
const sort_list = [
  {
    label: "작성일자순",
    value: "reg_date",
  },
  {
    label: "조회수순",
    value: "viewCount",
  },
  {
    label: "좋아요순",
    value: "likeCount",
  },
  {
    label: "댓글순",
    value: "replyCount",
  },
];

const community_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  { Header: "분류", accessor: "board_type_name", width: 100 },
  { Header: "제목", accessor: "title", minWidth: 700 },
  { Header: "작성자", id: "name", accessor: ({ member }) => member?.name },
  { Header: "조회수", id: "viewCount", accessor: ({ viewCount }) => thousandSeparator(viewCount), width: 100 },
  {
    Header: "좋아요수",
    id: "likeCount",
    accessor: ({ likeCount }) => thousandSeparator(likeCount),
    width: 100,
  },
  { Header: "댓글수", id: "replyCount", accessor: ({ replyCount }) => thousandSeparator(replyCount), width: 100 },
  {
    Header: "작성일자",
    id: "reg_date",
    accessor: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD"),
    width: 120,
  },
];

export const CommunityFeedList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { search_params, Pagination, SearchBox, SortBox, TermBox,FilterBox } = useSearchParams(location);
  const { data } = useQuery(["getCommunityFeedList", search_params]);

  return (
    <Box>
      <Grid container justify="space-between">
        <Title>게시판</Title>
        <FilterBox ml={2} filter_item="board_type" item_list={filter_list} />
        <Box ml="auto">
          <SortBox ml={3} item_list={sort_list} default_item="reg_date" />
          <TermBox ml={3} />
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={community_columns}
          data={data?.data?.storyList || []}
          onRowClick={(row) => history.push(`/community/${row.estate_story_pk}`)}
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
