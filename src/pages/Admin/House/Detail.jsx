import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { divByBillion } from "common";

import { makeStyles, Box, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Typography, Button } from "components/Mui";
import { RowTable, ColumnTable, Title, Image } from "components";

const useStyles = makeStyles((theme) => ({}));

const type_columns = [
  { Header: "타입", id: "areaname", accessor: ({ areaname, heibo }) => `${areaname} (구 ${heibo}평)` },
  {
    Header: "매매",
    id: "trade_avg_price",
    accessor: ({ trade_avg_price }) => (trade_avg_price ? `${trade_avg_price}억` : "-"),
  },
  // {
  //   Header: "급매매",
  //   id: "trade_fast_deal",
  //   accessor: ({ fast_deal }) =>
  //     fast_deal ? (
  //       <span
  //         style={{ color: "#00b65f", cursor: "pointer" }}
  //         onClick={() => window.open(fast_deal.homepage)}
  //       >{`${divByBillion(fast_deal.trade_fast_deal)}억`}</span>
  //     ) : (
  //       "-"
  //     ),
  // },
  {
    Header: "전세",
    id: "rent_avg_price",
    accessor: ({ rent_avg_price }) => (rent_avg_price ? `${rent_avg_price}억` : "-"),
  },
  // {
  //   Header: "급전세",
  //   id: "trade_fast_rent",
  //   accessor: ({ fast_rent }) =>
  //     fast_rent ? (
  //       <span
  //         style={{ color: "#00b65f", cursor: "pointer" }}
  //         onClick={() => window.open(fast_rent.homepage)}
  //       >{`${divByBillion(fast_rent.trade_fast_rent)}억`}</span>
  //     ) : (
  //       "-"
  //     ),
  // },
];

export const HouseDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { state } = useLocation();
  const { apart_code, fast_deal_pk } = useParams();
  const { data, isLoading } = useQuery(["getHouseDetail", { apart_code, fast_deal_pk }]);

  return (
    <Box>
      <Title>{!state ? <Skeleton height="60px" width="400px" /> : state?.articlename}</Title>

      {!state ? (
        <Skeleton height="30px" width="600px" />
      ) : (
        <Box my={2} display="flex" alignItems="center">
          <Typography>
            {`${state?.depth1_cortarname || ""} ${state?.depth2_cortarname || ""} ${state?.depth3_cortarname ||
              ""} ${state?.detailaddress || ""}`}
          </Typography>

          <Typography mx={2}>|</Typography>

          <Typography>
            평균매매 &nbsp;
            <span style={{ fontSize: "inherit", fontWeight: "700" }}>
              {state?.trade_avg_price ? `${state?.trade_avg_price}억` : "-"}
            </span>
          </Typography>

          <Typography mx={2}>|</Typography>

          <Typography>
            평균전세 &nbsp;
            <span style={{ fontSize: "inherit", fontWeight: "700" }}>
              {state?.rent_avg_price ? `${state?.rent_avg_price}억` : "-"}
            </span>
          </Typography>

          {/* <Typography mx={2}>|</Typography>

          <Typography color="primary">
            급매물 &nbsp;
            <span style={{ fontSize: "inherit", fontWeight: "700" }}>
              {state?.trade_fast_deal ? `${state?.trade_fast_deal}억` : "-"}
            </span>
          </Typography> */}
        </Box>
      )}

      <Box mt={2}>
        <ColumnTable
          columns={type_columns}
          data={data?.data || []}
          // onRowClick={(row) => row.homepage && window.open(row.homepage)}
          // disableRowClick={(row) => !row.homepage}
        />
      </Box>

      <Grid container direction="column" alignItems="flex-end">
        <Typography mt={2} mb={4} color="textSecondary">
          *급매매/급전세 선택시 매물을 바로 볼 수 있습니다.
        </Typography>
      </Grid>
      <Grid container justify="flex-end">
        <Button width={150} py={1.5} mr={1} onClick={() => history.goBack()}>
          <Typography fontWeight="700">뒤로</Typography>
        </Button>
        <Button width={150} py={1.5} onClick={() => history.push("/house")}>
          <Typography fontWeight="700">처음으로</Typography>
        </Button>
      </Grid>
    </Box>
  );
};
