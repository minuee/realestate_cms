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
    label: "상태",
    value: "",
  },
  // {
  //   label: "없음",
  //   value: "none",
  // },
  {
    label: "이용중",
    value: "ing",
  },
  {
    label: "해지신청",
    value: "stop",
  },
  {
    label: "해지",
    value: "end",
  },
];

const filter_list2 = [
  {
    label: "서비스",
    value: "",
  },
  {
    label: "급매물",
    value: "alarm",
  },
  {
    label: "착한중개인",
    value: "agent",
  },
];

const sort_list = [
  {
    label: "번호순",
    value: "settlement_pk",
  },
  {
    label: "닉네임순",
    value: "name",
  },
  {
    label: "결제일자순",
    value: "start_date",
  },
  {
    label: "만료일자순",
    value: "end_date",
  },
];

const subscribe_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  { Header: "사용자 닉네임", accessor: "nickname" },
  { Header: "서비스", accessor: "gubun_text" },
  {
    Header: "결제금액",
    id: "amount",
    accessor: ({ cost, is_status }) => (is_status === "free" ? "한달무료" : `${thousandSeparator(cost)}원`),
    width: 120,
  },
  {
    Header: "결제일자",
    id: "start_date",
    accessor: ({ start_date }) => dayjs.unix(start_date).format("YYYY-MM-DD"),
    width: 120,
  },
  {
    Header: "해지신청일자",
    id: "stop_date",
    accessor: ({ stop_date }) => (stop_date ? dayjs.unix(stop_date).format("YYYY-MM-DD") : "-"),
    width: 120,
  },
  {
    Header: "만료일자",
    id: "end_date",
    accessor: ({ end_date }) => (end_date ? dayjs.unix(end_date).format("YYYY-MM-DD") : "-"),
    width: 120,
  },
  { Header: "자동결제", accessor: "status_text", width: 100 },
];

export const SubscribeList = ({ location }) => {
  const { search_params, Pagination, SearchBox, SortBox, FilterBox, TermBox } = useSearchParams(location);
  const { data } = useQuery(["getSubscribeList", search_params]);
  const history = useHistory();

  return (
    <Box>
      <Grid container justify="space-between">
        <Box display="flex" alignItems="center">
          <Title>결제 관리</Title>
          <FilterBox ml={2} filter_item="is_status" item_list={filter_list} />
          <FilterBox ml={2} filter_item="gubun" item_list={filter_list2} />
        </Box>

        <Box ml="auto">
          <SortBox ml={3} item_list={sort_list} default_item="settlement_pk" />
          <TermBox ml={3} />
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={subscribe_columns}
          data={data?.data?.settlementList || []}
          onRowClick={(row) => history.push(`/subscribe/${row.settlement_pk}`)}
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
