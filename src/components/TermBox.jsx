import React, { useState } from "react";
import dayjs from "dayjs";

import { makeStyles, Box, InputAdornment } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { EventNote } from "@material-ui/icons";
import { Button } from "components/Mui";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "inline-flex",
    alignItems: "center",

    "& > .MuiFormControl-root": {
      width: "10rem",
    },
  },
}));

export const TermBox = ({ term_start, term_end, onTermSearch, ...props }) => {
  const classes = useStyles();

  const [termStart, setTermStart] = useState(term_start ? dayjs.unix(term_start) : null);
  const [termEnd, setTermEnd] = useState(term_end ? dayjs.unix(term_end) : null);

  function handleTermSearch() {
    if (
      term_start ==
        dayjs()
          .subtract(1, "M")
          .unix() &&
      term_end == dayjs().unix()
    ) {
      return;
    }

    onTermSearch({
      term_start: termStart?.unix(),
      term_end: termEnd?.unix(),
    });
  }

  return (
    <Box className={classes.container} {...props}>
      <DatePicker
        value={termStart || dayjs().subtract(1, "M")}
        maxDate={termEnd || undefined}
        onChange={(d) => setTermStart(d.startOf("day"))}
        format="YYYY-MM-DD"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <EventNote />
            </InputAdornment>
          ),
        }}
      />
      <Box mx={1} fontWeight="700">
        -
      </Box>
      <DatePicker
        value={termEnd || dayjs()}
        minDate={termStart || undefined}
        onChange={(d) => setTermEnd(d.endOf("day"))}
        format="YYYY-MM-DD"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <EventNote />
            </InputAdornment>
          ),
        }}
      />

      <Button ml={1} color="primary" onClick={handleTermSearch}>
        검색
      </Button>
      {/* <Button
        ml={1}
        onClick={() => {
          setTermStart(null);
          setTermEnd(null);
        }}
      >
        초기화
      </Button> */}
    </Box>
  );
};
