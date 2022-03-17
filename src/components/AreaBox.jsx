import React from "react";
import { useQuery } from "react-query";
import { makeStyles, Box, Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  area_wrapper: {
    display: "inline-block",
    "& > *": {
      marginLeft: theme.spacing(1),
    },
  },
}));

export const AreaBox = ({ search_params, onAreaChange, ...props }) => {
  const classes = useStyles();
  const { data, isFetching } = useQuery(
    ["getHouseArea", { area_sido: search_params.area_sido, area_sigungu: search_params.area_sigungu }],
    { staleTime: Infinity },
  );

  return (
    <Box className={classes.area_wrapper} {...props}>
      <Select
        margin="dense"
        value={isFetching ? "" : search_params.area_sido || ""}
        onChange={(e) => onAreaChange({ area_sido: e.target.value, area_sigungu: "", area_eupmyeon: "" })}
      >
        <MenuItem value="">시·도</MenuItem>
        {data?.area_sido.map((item) => (
          <MenuItem value={item.cortarno} key={item.cortarno}>
            {item.cortarname}
          </MenuItem>
        ))}
      </Select>

      <Select
        margin="dense"
        value={isFetching ? "" : search_params.area_sigungu || ""}
        onChange={(e) => onAreaChange({ area_sigungu: e.target.value, area_eupmyeon: "" })}
      >
        <MenuItem value="">시·군·구</MenuItem>
        {data?.area_sigungu.map((item) => (
          <MenuItem value={item.cortarno} key={item.cortarno}>
            {item.cortarname}
          </MenuItem>
        ))}
      </Select>

      <Select
        margin="dense"
        value={isFetching ? "" : search_params.area_eupmyeon || ""}
        onChange={(e) => onAreaChange({ area_eupmyeon: e.target.value })}
      >
        <MenuItem value="">읍·면·동</MenuItem>
        {data?.area_eupmyeon.map((item) => (
          <MenuItem value={item.cortarno} key={item.cortarno}>
            {item.cortarname}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
