import { SidebarDemo } from "@/components/Sidebar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarDemo>{children}</SidebarDemo>
      </body>
    </html>
  );
}
