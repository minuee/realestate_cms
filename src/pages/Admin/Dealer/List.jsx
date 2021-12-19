import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useSearchParams } from "hooks";
import { apiObject } from "api";
import dayjs from "dayjs";

import { makeStyles, Box, Grid } from "@material-ui/core";
import { Typography } from "components/Mui";
import { ColumnTable, Title, ExcelButton } from "components";

const bizNoFormatter = (num, type) => {
  var formatNum = '';
  try{
       if (num.length == 10) {
            if (type == 0) {
                 formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-*****');
            } else {
                  formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
            }
       }
  } catch(e) {
       formatNum = num;
       console.log(e);
  }
  return formatNum;
}

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
    label: "대기",
    value: "wait",
  },
  {
    label: "신청중",
    value: "request",
  },
  {
    label: "승인",
    value: "approval",
  },
  {
    label: "승인거절",
    value: "reject",
  },
  {
    label: "유료이용중",
    value: "service",
  },
  {
    label: "무료이용만료(1개월)",
    value: "freeend",
  }
];
const sort_item_list = [
  {
    label: "가입일자순",
    value: "reg_date",
  },
  {
    label: "사업자명순",
    value: "nickname",
  },
  {
    label: "대표자명순",
    value: "name",
  },
];

const dealer_columns = [
  { Header: "번호", accessor: "no", width: 80 },
  { Header: "이메일주소", accessor: "uid" },
  /*{ Header: "사업자명", accessor: "company_name" },*/
  {
    Header: "사업자명",
    id: "company_name",
    accessor: ({ company_name,business_code }) => 
    {
      return (
        <Box py={0}>
          <Typography variant="body2" fontWeight="500">{company_name}</Typography>
          <Typography variant="body2" fontWeight="500" pt={1}>({bizNoFormatter(business_code,'1')})</Typography>
        </Box>
      );
    }
  },
  { Header: "대표자명", accessor: "name", width: 100 },
  { Header: "전화번호", accessor: "telephone" },
  /*{ Header: "사업자 등록번호", accessor: "business_code", width: 160 },*/
  {
    Header: "가입일자",
    id: "reg_date",
    accessor: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD"),
    width: 120,
  },
  {
    Header: "승인일자",
    id: "confirm_date",
    accessor: ({ confirm_date,isServiceIng }) => confirm_date ? dayjs(confirm_date).format("YYYY-MM-DD") + (isServiceIng == true ? '  \n (유료사용중)' : '' ) : null,
    width: 120,
    
  },
  {
    Header: "승인상태",
    id: "approval_code",
    accessor: ({ agent, agent_status_text }) => {
      let tmp;
      switch (agent.is_status) {
        case "wait":
          tmp = {
            color: "#000",
            bgcolor: "#fff",
          };
          break;
        case "request":
          tmp = {
            color: "#ff0000",
            bgcolor: "#fff",
          };
          break;
        case "approval":
          tmp = {
            color: "#000",
            bgcolor: "#ddd",
          };
          break;
        case "reject":
          tmp = {
            color: "#fff",
            bgcolor: "#666",
          };
          break;
        default :
          tmp = {
            color: "#000",
            bgcolor: "#fff",
          };
          break;
      }
      return (
        <Box color={tmp?.color} bgcolor={tmp?.bgcolor} border="solid 1px #ddd" borderRadius="20px" py={1}>
          <Typography variant="body2" fontWeight="500">
            {agent_status_text}
          </Typography>
        </Box>
      );
    },
    width: 120,
  },
];

export const DealerList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { search_params, Pagination, SearchBox,SearchBox2, SortBox, FilterBox,TermBox } = useSearchParams(location);
  const { data } = useQuery(["getMemberList", { member_type: "A", ...search_params }]);

  return (
    <Box>
      <Grid container justify="space-between">
        <Title>착한중개인</Title>
        <FilterBox ml={2} filter_item="is_status" item_list={filter_list} />
        <Box ml="auto">
          <SortBox ml={3} item_list={sort_item_list} default_item="reg_date" />
          <TermBox ml={3} />
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={dealer_columns}
          data={data?.data?.userList || []}
          onRowClick={(row) => history.push(`/member/dealer/${row.member_pk}`)}
        />
      </Box>

      <Box position="relative" display="flex" justifyContent="space-between" alignItems="center">
        <SearchBox2 placeholder={'전체 이메일을 입력'} />
        <Pagination total={data?.total} />
        <SearchBox placeholder={'대표자명을 입력'}/>
      </Box>
    </Box>
  );
};
