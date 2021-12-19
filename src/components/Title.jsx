import React from "react";
import { Typography } from "components/Mui";

export const Title = ({ children, ...props }) => {
  return (
    <Typography display="inline" color="textPrimary" variant="h5" fontWeight="700" {...props}>
      {children}
    </Typography>
  );
};
