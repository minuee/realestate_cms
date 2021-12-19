import React, { forwardRef } from "react";
import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  ratio_box: {
    position: "relative",
    width: (props) => props.width,
    paddingTop: (props) => `calc(${props.width} / ${props.ratio})`,

    "& > *": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  },
});

export const RatioBox = forwardRef((props, ref) => {
  const { width, ratio = "1", children, ...otherProps } = props;
  const classes = useStyles({ width, ratio });

  return (
    <Box ref={ref} className={classes.ratio_box} {...otherProps}>
      <Box>{children}</Box>
    </Box>
  );
});
