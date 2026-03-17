import "./globals.css";

export const metadata = {
  title: "X Intelligence Dashboard",
  description: "Trusted-source dashboard for X topics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
