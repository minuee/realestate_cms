import "regenerator-runtime/runtime";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "styles/global.css";

import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./styles";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";

import { RecoilRoot } from "recoil";

import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { apiObject } from "api";

const queryFn = async ({ queryKey }) => {
  if (!apiObject[queryKey[0]]) return;
  return await apiObject[queryKey[0]](queryKey[1]);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      queryFn,
    },
  },
});

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <CssBaseline />
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById("root"),
);
