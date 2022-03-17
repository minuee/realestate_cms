import React from "react";
import { makeStyles, Box } from "@material-ui/core";

const useStyles = makeStyles({
  img: {
    backgroundImage: ({ src }) => `url(${src || "/image/no_image.png"})`,
    backgroundSize: ({ objectFit }) => objectFit || "contain",
    backgroundPosition: ({ objectPosition }) => objectPosition || "center",
    backgroundRepeat: "no-repeat",
    backgroundOrigin: "content-box",
  },
});

export const Image = ({ src, objectFit, objectPosition, ...props }) => {
  const classes = useStyles({
    src,
    objectFit,
    objectPosition,
  });

  return <Box className={classes.img} width="100%" height="100%" {...props} />;
};
