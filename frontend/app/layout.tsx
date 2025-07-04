import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Buddy",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'/>
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Toaster
          position="top-center"
          toastOptions={{
              duration: 5000,
              style: {
                  background: '#363636',
                  color: '#fff',
              },
              success: {
                  duration: 3000,
              },

              error: {
                  duration: 3000
              }
          }}
      />
      {children}
      </body>
      </html>
  );
}
