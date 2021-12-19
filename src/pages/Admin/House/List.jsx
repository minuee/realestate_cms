import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { areaState } from "state";
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
    label: "등록순",
    value: "reg_date",
  },
  /*
  {
    label: "급매물순",
    value: "fast",
  },
  */
  {
    label: "매매평균순",
    value: "deal",
  },
  {
    label: "전세평균순",
    value: "rent",
  },
];
const house_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  { Header: "아파트명", accessor: "articlename", minWidth: 230 },
  { Header: "시·도", accessor: "depth1_cortarname" },
  { Header: "시·군·구", accessor: "depth2_cortarname" },
  { Header: "읍·면·동", accessor: "depth3_cortarname" },
  { Header: "상세주소", accessor: "detailaddress" },
  // {
  //   Header: () => <span style={{ color: "#00b65f" }}>급매물</span>,
  //   id: "trade_fast_deal",
  //   accessor: ({ trade_fast_deal }) => (
  //     <span style={{ color: "#00b65f" }}>{trade_fast_deal ? `${trade_fast_deal}억` : "-"}</span>
  //   ),
  // },
  {
    Header: "매매평균",
    id: "trade_avg_price",
    accessor: ({ trade_avg_price }) => (trade_avg_price ? `${trade_avg_price}억` : "-"),
  },
  {
    Header: "전세평균",
    id: "rent_avg_price",
    accessor: ({ rent_avg_price }) => (rent_avg_price ? `${rent_avg_price}억` : "-"),
  },
];

export const HouseList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { search_params, Pagination, SearchBox, SortBox, AreaBox } = useSearchParams(location);
  const { data } = useQuery(["getHouseList", search_params]);

  return (
    <Box>
      <Grid container justify="space-between">
        <Box display="flex">
          <Title>아파트 DATA</Title>

          <AreaBox ml={1} />
        </Box>

        <SortBox item_list={sort_list} default_item="reg_date" />
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={house_columns}
          data={data?.data || []}
          onRowClick={(row) =>
            history.push({
              pathname: `/house/${row.apart_code}/${row.fast_deal_pk}`,
              state: row,
            })
          }
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
