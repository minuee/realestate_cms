import React, { useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { Auth, AuthType, UserState } from "@psyrenpark/auth";
import { useSetRecoilState } from "recoil";
import { authState } from "state";
import { useForm, Controller } from "react-hook-form";
import { encrypt, decrypt } from "common";
import Cookies from "js-cookie";

import {
  makeStyles,
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { PersonOutline, LockOutlined, HighlightOff } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { Image } from "components";

const useStyles = makeStyles((theme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    background: "#fff",
    padding: theme.spacing(4),
  },
  form_wrapper: {
    margin: theme.spacing(2, 0),
    display: "flex",
    flexDirection: "column",

    "& > *": {
      margin: theme.spacing(0.5, 0),
    },
  },
  form: {
    width: theme.spacing(50),
    borderRadius: theme.spacing(6),

    "&::-internal-autofill-selected": {
      background: "unset",
    },
  },
}));

export const SignIn = ({}) => {
  const classes = useStyles();
  const { control, register, setValue, errors, setError, handleSubmit } = useForm();
  const setAuth = useSetRecoilState(authState);
  const { mutate } = useMutation((form) => signIn(form), { mutationKey: "signin" });

  async function signIn(form) {
    if (!form.store_id_yn) Cookies.remove("id");

    Auth.signInProcess(
      {
        authType: AuthType.EMAIL,
        email: form.user_id,
        password: form.user_password,
      },
      async (data) => {
        if (form.store_id_yn) {
          Cookies.set("id", encrypt(form.user_id));
        }

        setAuth(UserState.SIGNED);
      },
      (data) => {
        console.log("signInFuntion -> error", data);
      },
      (e) => {
        setError("user_id", {});
        setError("user_password", {});
        console.log({ e });
        alert("오류가 발생해 로그인할 수 없습니다");
      },
    );
  }

  useEffect(() => {
    if (Cookies.get("id")) {
      setValue("user_id", decrypt(Cookies.get("id")));
      setValue("store_id_yn", true);
    }
  }, []);

  return (
    <Image
      src="/image/signin.png"
      objectFit="cover"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minWidth="600px"
    >
      <Container maxWidth="sm">
        <Box className={classes.content}>
          <Box mt={8} mb={4} textAlign="center">
            <Image width="200px" height="50px" src="/image/logo.png" />
            <Typography mt={1} color="textSecondary">
              관리자 전용페이지
            </Typography>
          </Box>

          <Box className={classes.form_wrapper}>
            <TextField
              name="user_id"
              placeholder="ID"
              // defaultValue="test1000@ruu.kr"
              inputRef={register({ required: true })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(mutate)()}
              InputProps={{
                classes: {
                  root: classes.form,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline fontSize="large" style={{ color: "#bbb" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton onClick={() => setValue("user_id", "")}>
                    <HighlightOff />
                  </IconButton>
                ),
              }}
              error={!!errors?.user_id}
            />
            <TextField
              name="user_password"
              placeholder="PASSWORD"
              // defaultValue="test1000@ruu.kr"
              type="password"
              inputRef={register({ required: true })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(mutate)()}
              InputProps={{
                classes: {
                  root: classes.form,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined fontSize="large" style={{ color: "#bbb" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton onClick={() => setValue("user_password", "")}>
                    <HighlightOff />
                  </IconButton>
                ),
              }}
              error={!!errors?.user_password}
            />
            <Controller
              render={({ value, onChange }) => (
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  onChange={(e) => onChange(e.target.checked)}
                  checked={value}
                  label={
                    <Typography variant="subtitle2" color="textSecondary">
                      아이디 저장
                    </Typography>
                  }
                />
              )}
              control={control}
              name="store_id_yn"
              defaultValue={false}
            />
          </Box>

          <Button className={classes.form} py={2} color="primary" onClick={handleSubmit(mutate)}>
            <Typography color="inherit" variant="h6" fontWeight="700">
              Login
            </Typography>
          </Button>

          <Typography mt={8} color="textSecondary" variant="body2">
            Copyright(C) company name, All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Image>
  );
};
