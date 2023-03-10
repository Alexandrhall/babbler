import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FormEvent, useEffect, useRef, useState } from "react";
import { login, useAuth } from "../../src/contexts/authContext";
import { useAppDispatch, useAppSelector } from "../../src/redux/hooks";
import { updateDetails } from "../../src/redux/auth";
import router from "next/router";
import Link from "next/link";

const theme = createTheme({
  palette: {
    primary: {
      main: "#171717",
    },
  },
});

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const user = useAuth();
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await login(emailRef.current!.value, passwordRef.current!.value);
    } catch {
      setError(true);
      dispatch(
        updateDetails({
          user: {
            id: "",
            role: "",
            email: "",
            username: "",
          },
          msg: "Failed to login",
        })
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user !== null && auth.user.id !== "") {
      router.replace("/");
    }
  }, [auth, user]);

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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={emailRef}
              error={error ? true : false}
              helperText={auth.msg ? auth.msg : null}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={passwordRef}
              error={error ? true : false}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
