import React from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { Auth, AuthType, UserState } from "@psyrenpark/auth";
import { useSetRecoilState } from "recoil";
import { authState } from "state";
import { useConfirmModal } from "hooks";

import { makeStyles, Grid, Box, ButtonBase } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { Image } from "components";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100px",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "solid 1px #ddd",
  },

  account: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(5),

    "& > *": {
      marginRight: theme.spacing(2),
    },
    "& > :first-child": {
      fontSize: "3rem",
      color: "#aaa",
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const setAuth = useSetRecoilState(authState);
  const { mutate } = useMutation(Auth.signOut, {
    mutationKey: "signout",
    onSuccess: () => setAuth(UserState.NOT_SIGN),
    onError: () => alert("오류가 발생해 요청한 작업을 완료할 수 없습니다"),
  });
  const { ConfirmModal, openModal } = useConfirmModal(["logout"]);

  return (
    <>
      <Grid container className={classes.container}>
        <Box display="flex" alignItems="center" width="350px" height="100%" bgcolor="primary.main" px={5} color="#fff">
          <ButtonBase color="primary" style={{ borderRadius: "5px" }} onClick={() => history.push("/member/customer")}>
            <Image width="150px" height="50px" src="/image/logo_white.png" />
          </ButtonBase>
        </Box>

        <Box display="flex" alignItems="stretch" mr={2}>
          <Box className={classes.account}>
            <AccountCircle color="inherit" />
            <Typography fontWeight="500">관리자</Typography>
          </Box>

          <Button p={3} variant="contained" color="primary" onClick={() => openModal("logout")}>
            Logout
          </Button>
        </Box>
      </Grid>
      <ConfirmModal title="로그아웃하시겠습니까?" action={mutate} modalKey="logout" />
    </>
  );
};

export default Header;
