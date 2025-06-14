'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
}) => {
  const { scrollYProgress } = useScroll()

  const [visible, setVisible] = useState(true)

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === 'number') {
      let direction = current! - scrollYProgress.getPrevious()!

      if (scrollYProgress.get() > 0) {
        setVisible(true)
      } else {
        if (direction < 0) {
          setVisible(true)
        } else {
          setVisible(true)
        }
      }
    }
  })

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          'fixed inset-x-0 top-10 z-[5000] mx-auto flex max-w-fit rounded-full border border-gray-300 bg-white p-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]',
          className
        )}
        style={{
          right: '2rem', // Position from the right edge
          left: 'auto', // Override the default inset-x-0
          margin: '0', // Remove auto margin
        }}
      >
        <div className="transition-transform duration-300 hover:scale-105">
          <WalletMultiButton
            style={{
              backgroundColor: '#FB923C',
              position: 'relative',
              borderRadius: '9999px',
              borderWidth: '1px',
              borderColor: '#e5e5e5',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#000',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
