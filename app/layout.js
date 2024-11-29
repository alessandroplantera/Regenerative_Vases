import localFont from "next/font/local";
import "./globals.css";

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
  title: "Studio Blando",
  description: "Pagina interattiva con design innovativo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sAntique.variable} ${sRegular.variable} ${sThin.variable} ${ppbold.variable} ${ppregular.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
