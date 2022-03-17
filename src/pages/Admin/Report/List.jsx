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
const class_list = [
  {
    label: "구분",
    value: "",
  },
  {
    label: "채팅",
    value: "chat",
  },
  {
    label: "아파트이야기",
    value: "apartstory",
  },
  {
    label: "부동산이야기",
    value: "housestory",
  },
];
const filter_list = [
  {
    label: "신고내용",
    value: "",
  },
  {
    label: "영리목적/홍보성",
    value: "A",
  },
  {
    label: "음란성/선정성",
    value: "B",
  },
  {
    label: "개인정보노출",
    value: "C",
  },
  {
    label: "기타",
    value: "Z",
  },
];
const report_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  { Header: "작성자", id: "reg", accessor: ({ reg: { name } }) => name },
  { Header: "신고대상", id: "target", accessor: ({ target: { name } }) => name },
  { Header: "구분", accessor: "class_text", width: 120 },
  { Header: "신고내용", accessor: "reason_text", width: 160 },
  {
    Header: "신고일자",
    id: "reg_date",
    accessor: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD"),
    width: 120,
  },
];

export const ReportList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { search_params, Pagination, SearchBox, FilterBox, SortBox, TermBox } = useSearchParams(location);
  const { data } = useQuery(["getReportList", search_params]);

  return (
    <Box>
      <Grid container justify="space-between">
        <Box display="flex">
          <Title>신고내용</Title>
          <FilterBox ml={2} item_list={class_list} filter_item="class_type" />
          <FilterBox ml={2} item_list={filter_list} filter_item="reason_type" />
        </Box>

        <Box ml="auto">
          <SortBox ml={3} item_list={sort_list} default_item="reg_date" />
          <TermBox ml={3} />
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={report_columns}
          data={data?.data?.declarationList || []}
          //   onRowClick={(row) => history.push(`/report/${row.no}`)}
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
