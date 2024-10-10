// import type { Metadata } from "next";
// import { Plus_Jakarta_Sans } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider"

// import { cn } from '@/lib/utils'

// const fontSans = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   weight : ['300','400','500','600','700'],
//   variable: '--font-sans'
// })

// export const metadata: Metadata = {
//   title: "Doctor On Go",
//   description: "A healthcare managment system",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', fontSans.variable)}>
//       <ThemeProvider
//         attribute="class"
//         defaultTheme="dark"
//         >
//        {children}
//       </ThemeProvider>
//         </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Font setup
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

// Metadata
export const metadata: Metadata = {
  title: "Doctor On Go",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* Theme Provider */}
        <ThemeProvider attribute="class" defaultTheme="dark">
          {/* Navigation Bar */}
          <nav className="bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-lg font-bold">Doctor On Go</div>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-gray-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="hover:text-gray-400">
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/registerDoctor" className="hover:text-gray-400">
                    Register Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/loginDoctor" className="hover:text-gray-400">
                    Login Doctor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track-application"
                    className="hover:text-gray-400"
                  >
                    Track Application
                  </Link>
                </li>

                <li>
                  <Link href="/about" className="hover:text-gray-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-400">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
