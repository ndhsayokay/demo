import type { Metadata } from "next";
import "./globals.css";
import "./management.css";

export const metadata: Metadata = {
  title: "Clubspace · Prototype quản lý CLB",
  description: "Wireframe tương tác cho không gian CLB, kênh trò chuyện và tuyển thành viên.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
