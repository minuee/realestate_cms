import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
    value: "view",
  },
  {
    label: "좋아요순",
    value: "like",
  },
  {
    label: "글작성수순",
    value: "article",
  },
];
const house_community_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  { Header: "아파트명", accessor: "articlename", minWidth: 230 },
  { Header: "도구분", accessor: "depth1_cortarname" },
  { Header: "시구분", accessor: "depth2_cortarname" },
  { Header: "지역구분", accessor: "depth3_cortarname" },
  { Header: "상세주소", accessor: "detailaddress" },
  { Header: "조회수", id: "view_cnt", accessor: ({ view_cnt }) => thousandSeparator(view_cnt) },
  { Header: "좋아요수", id: "like_count", accessor: ({ like_count }) => thousandSeparator(like_count) },
  { Header: "글작성수", id: "article_cnt", accessor: ({ article_cnt }) => thousandSeparator(article_cnt) },
];

export const HouseCommunityList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { search_params, Pagination, SearchBox, SortBox, AreaBox } = useSearchParams(location);
  const { data } = useQuery(["getHouseCommunityList", search_params]);

  return (
    <Box>
      <Grid container justify="space-between">
        <Box display="flex">
          <Title>아파트 이야기</Title>

          <AreaBox ml={1} />
        </Box>

        <SortBox item_list={sort_list} default_item="reg_date" />
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={house_community_columns}
          data={data?.data || []}
          onRowClick={(row) => history.push(`/house_community/${row.apart_code}`)}
        />
      </Box>

      <Box position="relative" display="flex" justifyContent="flex-end" alignItems="center">
        {/* <ExcelButton /> */}
        <Pagination total={data?.data?.[0]?.full_count} />
        <SearchBox />
      </Box>
    </Box>
  );
};
