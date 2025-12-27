import QueryProvider from "@/components/providers/query-provider";
import Navbar from "@/components/navbar/navbar"; // Same path, new code
import "./globals.css";

export const metadata = {
  title: "LMS",
  description: "Learning Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
