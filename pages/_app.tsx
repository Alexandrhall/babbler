import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { AuthProvider } from "../src/contexts/authContext";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material";
import { useRouter } from "next/router";
import Navbar from "../src/components/Navbar";
import RoomList from "../src/components/RoomList";
import Drawer from "../src/components/Drawer";

const theme = createTheme({
  palette: {
    primary: {
      main: "#171717",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader =
    router.route === "/login" || router.route === "/signup" ? false : true;

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Head>
            <title>BabbleR</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {showHeader ? (
            <>
              <Navbar />
              <main className="flex flex-row">
                {/* <RoomList /> */}
                <Drawer />
                <Component {...pageProps} />
              </main>
            </>
          ) : (
            <Component {...pageProps} />
          )}
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
