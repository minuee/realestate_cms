import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useSearchParams } from "hooks";
import { thousandSeparator } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import { makeStyles, Box, Grid } from "@material-ui/core";
import { ColumnTable, Title, ExcelButton } from "components";

const useStyles = makeStyles((theme) => ({}));

const sort_list = [
  {
    label: "가입일자순",
    value: "reg_date",
  },
  {
    label: "닉네임순",
    value: "nickname",
  },
  {
    label: "이용횟수순",
    value: "login_count",
  },
];

const customer_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  {
    Header: "이메일주소",
    accessor: "uid",
    // width: 200,
  },
  {
    Header: "닉네임",
    accessor: "nickname",
  },
  {
    Header: "가입일자",
    id: "reg_date",
    accessor: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD"),
    width: 120,
  },
  {
    Header: "이용횟수",
    id: "login_count",
    accessor: ({ login_count }) => thousandSeparator(login_count),
    width: 100,
  },
  {
    Header: "비고",
    id: "join_type_text",
    accessor: ({ is_status, join_type_text }) =>
      is_status === "stop" ? <span style={{ color: "red" }}>이용중지</span> : join_type_text,
    width: 160,
  },
];

export const CustomerList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { search_params, Pagination, SearchBox,SearchBox2, SortBox, TermBox } = useSearchParams(location);
  const { data } = useQuery(["getMemberList", { member_type: "N", ...search_params }]);

  return (
    <Box>
      <Grid container justify="space-between">
        <Title>일반회원</Title>

        <Box ml="auto">
          <SortBox ml={3} item_list={sort_list} default_item="reg_date" />
          <TermBox ml={3} />
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={customer_columns}
          data={data?.data?.userList || []}
          onRowClick={(row) => history.push(`/member/customer/${row.member_pk}`)}
        />
      </Box>

      <Box position="relative" display="flex" justifyContent="space-between" alignItems="center">
        <SearchBox2 placeholder={'전체 이메일을 입력'}/>
        <Pagination total={data?.total} />
        <SearchBox placeholder={'닉네임을 입력'}/>
      </Box>
    </Box>
  );
};
