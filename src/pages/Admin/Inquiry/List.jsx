import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useSearchParams } from "hooks";
import { apiObject } from "api";
import dayjs from "dayjs";

import { makeStyles, Box, Grid } from "@material-ui/core";
import { Typography } from "components/Mui";
import { ColumnTable, Title, ExcelButton } from "components";

const useStyles = makeStyles((theme) => ({}));

const sort_list = [
  {
    label: "작성일자순",
    value: "reg_date",
  },
  {
    label: "작성자순",
    value: "reg_member",
  },
];
const filter_list = [
  {
    label: "구분",
    value: "",
  },
  {
    label: "대기중",
    value: "A",
  },
  {
    label: "답변완료",
    value: "B",
  },
];
const inquiry_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  {
    Header: "작성자",
    id: "name",
    accessor: ({ tb_member: { name } }) => name,
    width: 200,
  },
  { Header: "제목", accessor: "title" },
  {
    Header: "작성일자",
    id: "reg_date",
    accessor: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD") || "-",
    width: 120,
  },
  {
    Header: "답변일자",
    id: "reply_dt",
    accessor: ({ answer_date }) => (answer_date ? dayjs(answer_date).format("YYYY-MM-DD") : "-"),
    width: 120,
  },
  {
    Header: "비고",
    id: "reply_code",
    accessor: ({ is_answer }) => (
      <Box color="#000" bgcolor={is_answer ? "#ddd" : "#fff"} border="solid 1px #ddd" borderRadius="20px" py={0.5}>
        <Typography variant="body2" fontWeight="500">
          {is_answer ? "답변완료" : "대기중"}
        </Typography>
      </Box>
    ),
    width: 120,
  },
];

export const InquiryList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { search_params, Pagination, SearchBox, FilterBox, SortBox, TermBox } = useSearchParams(location);
  const { data } = useQuery(["getInquiryList", search_params]);

  return (
    <Box>
      <Grid container justify="space-between">
        <Box display="flex">
          <Title>문의내역</Title>
          <FilterBox ml={2} item_list={filter_list} filter_item="inquiry_type" />
        </Box>

        <Box ml="auto">
          <SortBox ml={3} item_list={sort_list} default_item="reg_date" />
          <TermBox ml={3} />
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={inquiry_columns}
          data={data?.data?.inquiryList || []}
          onRowClick={(row) => history.push(`/inquiry/${row.inquiry_pk}`)}
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
