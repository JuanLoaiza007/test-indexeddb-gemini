import { Nunito } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/_components/Sidebar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
});

export const metadata = {
  title: "FinTrack",
  description: "Financial control and analysis application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased flex flex-row`}>
        <Sidebar />
        <div className="flex flex-col w-full max-h-screen overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
