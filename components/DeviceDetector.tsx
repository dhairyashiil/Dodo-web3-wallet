'use client'

import { useEffect, useState } from 'react'

export default function DeviceDetector({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  if (isMobile) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 bg-gradient-to-br from-purple-300 to-violet-950 px-4 text-center">
        <div className="w-full max-w-xl rounded-lg border border-gray-300 bg-white p-6 text-gray-800">
          <h2 className="mb-2 text-lg font-semibold">Hi there!</h2>
          <p className="mb-3">
            I understand this can be frustrating, but at the moment, I&apos;m focused on building
            the
            <span className="font-semibold"> Token Launchpad</span> feature.
          </p>
          <p className="mb-5">
            Once that&apos;s complete, I&apos;ll work on making the website fully responsive for
            mobile devices.
          </p>
          <p className="mb-5 text-lg font-bold">
            In the meantime, PLEASE access the site using a
            <span className="font-semibold"> laptop, computer, or tablet</span>.
          </p>
          <p>Thanks so much for your patience and understanding xD</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
