'use client'
import React from 'react'
import { HoverBorderGradient } from './ui/hover-border-gradient'
import { div } from 'motion/react-client'
import Image from 'next/image'

export function HoverBorderGradientDemo() {
  return (
    // <div className="m-40 flex justify-center text-center">
    <div>
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="flex items-center space-x-2 bg-white text-black dark:bg-gray-950 dark:text-white"
      >
        {/* <RocketChatLogoSmall /> */}
        <span>Contact Me</span>
      </HoverBorderGradient>
    </div>
  )
}

const RocketChatLogoSmall = () => {
  return (
    <div className="inline-block bg-blue-50">
      <Image
        src={'/dodo-logo.svg'}
        width={100}
        height={60}
        alt={'Rocket Chat Logo'}
        className="h-5 w-5 shrink-0 rounded-md shadow-2xl"
      />
    </div>
  )
}
