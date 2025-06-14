'use client'
import { cn } from '@/lib/utils'
import React, { useState, createContext, useContext, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconMenu2, IconX } from '@tabler/icons-react'

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
  active?: boolean
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-close sidebar on mobile when resizing to desktop
      if (window.innerWidth >= 768 && isMobile) {
        setOpenState(false)
      }
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [isMobile])

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  )
}

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
    </>
  )
}

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate, isMobile } = useSidebar()

  if (isMobile) return null

  return (
    <motion.div
      className={cn(
        'hidden min-h-[100dvh] w-[300px] shrink-0 bg-neutral-100 px-4 py-4 dark:bg-neutral-800 md:flex md:flex-col',
        className
      )}
      animate={{
        width: animate ? (open ? '300px' : '80px') : '300px',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const MobileSidebar = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { open, setOpen, isMobile } = useSidebar()

  // Prevent scrolling when mobile sidebar is open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open, isMobile])

  return (
    <div className={cn('w-0 md:hidden', className)} {...props}>
      <div className="flex h-16 w-full items-center justify-between bg-neutral-100 px-4 dark:bg-neutral-800 md:hidden">
        <button
          className="z-20 flex w-10 items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? (
            <IconX className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
          ) : (
            <IconMenu2 className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99] bg-black md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'fixed inset-y-0 left-0 z-[100] flex h-[100dvh] w-3/4 max-w-sm flex-col bg-white p-6 dark:bg-neutral-900',
                className
              )}
            >
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export const SidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: Links
  className?: string
  onClick?: (e: React.MouseEvent) => void
}) => {
  const { open, animate, isMobile, setOpen } = useSidebar() // Move useSidebar to top level

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e)
    // Auto-close sidebar on mobile when a link is clicked
    if (isMobile) {
      setOpen(false) // Now we can use setOpen directly
    }
  }

  return (
    <a
      href={link.href}
      onClick={handleClick}
      className={cn(
        'group/sidebar flex items-center justify-start gap-3 rounded-md px-3 py-3 transition-colors',
        'hover:bg-purple-200 dark:hover:bg-neutral-700',
        link.active ? 'bg-purple-600 dark:bg-neutral-700' : '',
        className
      )}
      {...props}
    >
      <span className="flex-shrink-0">{link.icon}</span>

      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
        className="!m-0 inline-block whitespace-nowrap !p-0 text-sm font-medium text-neutral-700 dark:text-neutral-200"
      >
        {link.label}
      </motion.span>
    </a>
  )
}