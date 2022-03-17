import React from "react";

import { Box } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";

export const SortBox = ({ search_params, item_list = [], default_item, onSort, ...props }) => {
  function handleSort(value) {
    let update = {
      sort_item: value,
    };

    if (value == (search_params.sort_item || default_item)) {
      update.sort_type = search_params?.sort_type === "asc" ? "desc" : "asc";
    } else {
      update.sort_type = "desc";
    }

    onSort(update);
  }

  return (
    <Box display="inline-block" {...props}>
      {item_list.map((item, index) => {
        let is_cur = item.value === (search_params.sort_item || default_item);

        return (
          <Button p={0.5} mr={1} variant="text" onClick={() => handleSort(item.value)} key={index}>
            <Typography variant="body2" fontWeight={is_cur ? "700" : undefined}>
              {item.label}
            </Typography>
            {is_cur && <>{search_params?.sort_type === "asc" ? <ArrowDropUp /> : <ArrowDropDown />}</>}
          </Button>
        );
      })}
    </Box>
  );
};
