import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00b65f",
      contrastText: "#fff",
    },
    secondary: {
      main: "#333",
      contrastText: "#fff",
    },
    disabled: "#999",

    text: {
      primary: "#000",
      secondary: "#999",
    },

    divider: "#707070",
  },

  props: {
    MuiButton: {
      variant: "contained",
      disableElevation: true,
    },
    MuiTextField: {
      variant: "outlined",
      FormHelperTextProps: {
        style: { display: "none" },
      },
    },
    MuiSelect: {
      variant: "outlined",
      displayEmpty: true,
    },
  },

  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: "#fff",
        color: "#000",
        border: "solid 1px #bbb",
      },
      containedPrimary: {
        color: "#fff",
      },
      outlinedPrimary: {
        backgroundColor: "#d32f2f",
        color: "#fff",
        border: "solid 1px #bbb !important",

        "&:hover": {
          backgroundColor: "#e57373 !important",
        },
      },
      outlinedSecondary: {
        color: "#d32f2f",
        border: "none !important",

        "&:hover": {
          color: "#d32f2f !important",
        },
      },
    },
    MuiTextField: {
      root: {
        backgroundColor: "#fff",
      },
    },
    MuiSelect: {
      outlined: {
        backgroundColor: "#fff",
      },
    },
  },

  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",

    h1: { fontWeight: "400" },
    h2: { fontWeight: "400" },
    h3: { fontWeight: "400" },
    h4: { fontWeight: "400" },
    h5: { fontWeight: "400" },
    h6: { fontWeight: "400" },
    caption: { color: "red" },
  },
});
