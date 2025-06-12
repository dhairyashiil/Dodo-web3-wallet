import DeviceDetector from '@/components/DeviceDetector'
import { SidebarDemo } from '@/components/Sidebar'

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <DeviceDetector>
          <SidebarDemo>{children}</SidebarDemo>
        </DeviceDetector>
      </body>
    </html>
  )
}
