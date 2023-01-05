import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { AuthProvider, useAuth } from "../src/contexts/authContext";
import Head from "next/head";
import { useEffect } from "react";
import router from "next/router";
import SignIn from "./login";

export default function App({ Component, pageProps }: AppProps) {
  const user = useAuth();

  return (
    <Provider store={store}>
      <AuthProvider>
        <Head>
          <title>BabbleR</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}
