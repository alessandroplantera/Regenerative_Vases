import localFont from "next/font/local";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CustomCursor from "./components/CustomCursor"; // Importa il cursore

const sAntique = localFont({
  src: "./fonts/SAntique.otf",
  variable: "--font-s-antique",
});
const sRegular = localFont({
  src: "./fonts/SRegular.otf",
  variable: "--font-s-regular",
});
const sThin = localFont({
  src: "./fonts/SThin.otf",
  variable: "--font-s-thin",
});
const ppbold = localFont({
  src: "./fonts/PP-Bold.otf",
  variable: "--font-ppbold",
});
const ppregular = localFont({
  src: "./fonts/PP-Regular.otf",
  variable: "--font-ppregular",
});

export const metadata = {
  title: "Regenerative Vases",
  description: "Regenerative design from waste materials",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // suppressHydrationWarning
        className={`${sAntique.variable} ${sRegular.variable} ${sThin.variable} ${ppbold.variable} ${ppregular.variable} antialiased`}
      >
        <CustomCursor /> {/* Usa il cursore */}
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
