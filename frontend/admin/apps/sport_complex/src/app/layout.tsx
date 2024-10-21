import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@shared/context/GlobalContext";
import { getFolders } from "@shared/utils/common/getFolders";
import { GlobalAlert } from "@shared/components/Alert";
import { NavBar, SideBar } from "@shared/components/NavigationBar";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const folders = getFolders();
  return (
    <html lang="en">
      <body className={inter.className} id="root">
        <GlobalProvider>
        <GlobalAlert />
          <div className={` flex flex-col h-full min-h-screen`}>
            <div className="fixed top-0 left-0 right-0 z-10">
              <NavBar />
            </div>
            <div className="flex flex-grow pt-[64px]">
              <div className="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-72 z-10">
                <SideBar folders={folders} />
              </div>
              <main className={`flex-grow ml-72 p-6 overflow-y-auto`}>
                {children}
              </main>
            </div>
          </div>
        </GlobalProvider>

      </body>
    </html>
  );
}