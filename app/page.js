import Head from "next/head";
import Scrollytelling from "./components/Scrollytelling";
import "./globals.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Scrollytelling Example</title>
        <meta
          name="description"
          content="Landing page con scrollytelling animato"
        />
      </Head>
      <main>
        <Scrollytelling />
      </main>
    </>
  );
}
