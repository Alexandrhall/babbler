import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRef, useState } from "react";
import { createUser } from "../../src/contexts/authContext";
import { doc, setDoc } from "firebase/firestore";
import { database } from "../../src/firebase";
import router from "next/router";
import Link from "next/link";
import validator from "validator";

const theme = createTheme({
  palette: {
    primary: {
      main: "#171717",
    },
  },
});

export default function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passworConfdRef = useRef<HTMLInputElement>(null);
  const [errObject, setErrObject] = useState({
    username: false,
    email: false,
    password: false,
    passwordConf: false,
  });

  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const passRegex =
    /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let validated = false;

    if (!validator.isEmail(emailRef.current!.value)) {
      setErrObject((prev) => {
        return {
          ...prev,
          email: true,
        };
      });
    } else {
      setErrObject((prev) => {
        return {
          ...prev,
          email: false,
        };
      });
    }
    if (
      !validator.isStrongPassword(passwordRef.current!.value) ||
      passwordRef.current!.value === ""
    ) {
      setErrObject((prev) => {
        return {
          ...prev,
          password: true,
        };
      });
    } else {
      setErrObject((prev) => {
        return {
          ...prev,
          password: false,
        };
      });
    }
    if (
      usernameRef.current!.value.length > 3 &&
      usernameRef.current!.value.length < 17
    ) {
      setErrObject((prev) => {
        return {
          ...prev,
          username: false,
        };
      });
    } else {
      setErrObject((prev) => {
        return {
          ...prev,
          username: true,
        };
      });
    }
    if (passwordRef.current!.value === passworConfdRef.current!.value) {
      setErrObject((prev) => {
        return {
          ...prev,
          passwordConf: false,
        };
      });
    } else {
      setErrObject((prev) => {
        return {
          ...prev,
          passwordConf: true,
        };
      });
    }

    console.log();
    if (
      errObject.email.valueOf() === false &&
      errObject.username.valueOf() === false &&
      errObject.password.valueOf() === false &&
      errObject.passwordConf.valueOf() === false
    ) {
      validated = true;
    }

    if (validated) {
      try {
        await createUser(emailRef.current!.value, passwordRef.current!.value)
          .then(async (usrCred) => {
            await setDoc(doc(database, "users", usrCred.user.uid), {
              email: emailRef.current!.value,
              role: "regular",
              username: usernameRef.current!.value,
              photoUrl:
                "https://firebasestorage.googleapis.com/v0/b/babbler-af9c3.appspot.com/o/images%2Fdefault-avatar.jpg?alt=media&token=bcebfc0d-2e0c-403a-8cfb-b388dd25f952",
            });
          })
          .finally(() => {
            router.push("/");
          });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  type="text"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  inputRef={usernameRef}
                  error={errObject.username}
                  helperText={
                    errObject.username
                      ? "Username between 4-16 characters"
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={emailRef}
                  type="email"
                  error={errObject.email}
                  helperText={errObject.email ? "Incorrect Email" : null}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  inputRef={passwordRef}
                  error={errObject.password}
                  helperText={
                    errObject.password
                      ? "At least 8 charaters, 1 lower case, 1 upper case, 1 special , 1 number"
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Password Confirmation"
                  type="password"
                  id="passwordConfirm"
                  autoComplete="new-password"
                  inputRef={passworConfdRef}
                  error={errObject.passwordConf}
                  helperText={
                    errObject.passwordConf ? "passwords don´t match " : null
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
