'use client'

import { useEffect, useState } from 'react'

export default function DeviceDetector({ children }: { children: React.ReactNode }) {
  const [isAllowedDevice, setIsAllowedDevice] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const userAgent = navigator.userAgent.toLowerCase()
      const screenWidth = window.innerWidth

      // Basic detection: block if it's a known mobile/tablet OR if it's a touch device with smaller screen
      const isMobileOrTablet =
        /iphone|ipod|android|blackberry|bb|playbook|tablet|kindle|silk|opera mini|windows phone|ipad/.test(
          userAgent
        ) ||
        isTouchDevice ||
        screenWidth < 1024 // optional stricter screen width limit for tablets

      setIsAllowedDevice(!isMobileOrTablet)
    }

    // Run detection initially
    checkDevice()

    // Listen for resize events
    window.addEventListener('resize', checkDevice)

    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  if (!isAllowedDevice) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 bg-gradient-to-br from-purple-300 to-violet-950 px-4 text-center">
        <div className="w-full max-w-xl rounded-lg border border-gray-300 bg-white p-6 text-gray-800">
          <h2 className="mb-2 text-lg font-semibold">Hey there!</h2>
          <p className="mb-3">
            I am currently focused on adding new features and crafting a pixel-perfect desktop
            experience.
          </p>
          <p className="mb-5">
            Also, for the best experience using external wallets (via the wallet adapter), please
            use a<span className="font-semibold"> laptop or desktop computer</span>.
          </p>
          <p className="mb-5 text-lg font-bold">
            Mobile phones and tablets are not supported at this time.
          </p>
          <p>Thanks so much for your understanding and support 😊</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
