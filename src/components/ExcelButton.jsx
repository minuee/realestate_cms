import React from "react";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "hooks";
import { apiObject } from "api";

import { DescriptionOutlined } from "@material-ui/icons";
import { Button } from "components/Mui";

export const ExcelButton = ({ path, params, ...props }) => {
  const location = useLocation();
  const { search_params } = useSearchParams(location);

  async function exportExcel() {
    // let url = await apiObject.getExcelLink({ path, search_params, params });
    console.log("excel export called");

    // if (url) {
    //   window.open(url);
    // }
  }

  return (
    <div />
    // <Button p={1} onClick={exportExcel} {...props}>
    //   <DescriptionOutlined />
    //   엑셀저장
    // </Button>
  );
};
