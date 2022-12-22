import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { database } from "../firebase";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useEffect(() => {
    console.log("hej");

    getDocs(collection(database, "test")).then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
  }, []);
  return (
    <>
      <Head>
        <title>BabbleR</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Hello there</h1>
      </main>
    </>
  );
}
