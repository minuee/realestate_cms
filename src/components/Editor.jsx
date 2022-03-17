import React from "react";
import { makeStyles, Box } from "@material-ui/core";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const useStyles = makeStyles({
  container: {
    "& .ck-content": {
      height: "500px",
    },
  },
});

export const Editor = ({ data, setData }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onReady={(editor) => data && editor.setData(data)}
        onChange={(e, editor) => {
          const data = editor.getData();
          setData(data);
        }}
        config={{
          toolbar: {
            items: ["heading", "|", "bold", "italic", "bulletedList", "numberedList", "blockQuote", "undo", "redo"],
          },
        }}
      />
    </Box>
  );
};
