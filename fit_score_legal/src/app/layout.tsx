// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Router from "./router";
import { Toaster } from "@/components/ui/sonner";
import { Roboto_Mono, Roboto_Serif } from "next/font/google";
import { AuthProvider } from "@/context/AuthProvider";

// Fonte 1: Roboto Mono
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-mono",
});

// Fonte 2: Roboto Serif
const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-serif",
});

export const metadata: Metadata = {
  title: "FitScore - Legal",
};
// app/layout.tsx// app/layout.tsx
export default function Layout() {
  return (
    <html lang="en" className={`${robotoMono.variable} ${robotoSerif.variable}`}>
      <body className="flex flex-col min-h-screen font-sans relative  ">
        {/* SVGs como background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          {/* SVG superior */}
          <svg
            className="absolute top-0 left-0 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#0099ff"
              fillOpacity="0.9"
              d="M0,224L34.3,224C68.6,224,137,224,206,192C274.3,160,343,96,411,64C480,32,549,32,617,69.3C685.7,107,754,181,823,197.3C891.4,213,960,171,1029,176C1097.1,181,1166,235,1234,256C1302.9,277,1371,267,1406,261.3L1440,256L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
            />
          </svg>

          {/* SVG inferior */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#0099ff"
              fillOpacity="0.9"
              d="M0,224L34.3,224C68.6,224,137,224,206,192C274.3,160,343,96,411,64C480,32,549,32,617,69.3C685.7,107,754,181,823,197.3C891.4,213,960,171,1029,176C1097.1,181,1166,235,1234,256C1302.9,277,1371,267,1406,261.3L1440,256L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
            />
          </svg>
        </div>

        <Toaster position="top-right" richColors theme="light" duration={4000} />

        <AuthProvider>
          <main className="flex-1 container-fluid font-[var(--font-roboto-mono)] relative z-10">
    <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-b from-blue-800/80 via-blue-900/80 to-gray-900 ">
   <div className="bg-gray-50 p-8 rounded-xl shadow-xl space-y-6 backdrop-blur-sm border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
  <Router />
</div>
        </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
