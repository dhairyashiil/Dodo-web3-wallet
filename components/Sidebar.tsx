// components/sidebar.tsx
"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsExchange,
  IconBrandTabler,
  IconFeatherFilled,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import WalletGenerator from "./WalletGenerator";

export function SidebarDemo({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/home",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      active: pathname === "/",
    },
    {
      label: "Airdrop/Receive",
      href: "/home/receive",
      icon: (
        <IconArrowNarrowDown className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      active: pathname === "/home/receive",
    },
    {
      label: "Send",
      href: "/home/send",
      icon: (
        <IconArrowNarrowUp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      active: pathname === "/home/send",
    },
    {
      label: "Swap",
      href: "/home/swap",
      icon: (
        <IconArrowsExchange className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      active: pathname === "/home/swap",
    },
    {
      label: "Accounts",
      href: "/home/accounts",
      icon: (
        <IconUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      active: pathname === "/home/accounts",
    },
    {
      label: "Settings",
      href: "/home/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      active: pathname === "/home/settings",
    },
    {
      label: "Logout",
      href: "/home/logout",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      active: pathname === "/home/logout",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-screen w-screen"
        // "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        // "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={() => router.push(link.href)}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Dhairyashil Shinde",
                href: "https://x.com/Dhaiiryashiil",
                icon: (
                  <img
                    src="https://avatars.githubusercontent.com/u/93669429?v=4"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main content area */}
      {/* <main className="flex flex-1 overflow-auto"> */}
      <main className="flex-1 overflow-y-auto">
        {/* <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900"> */}
        <div className="h-full w-full flex-1 flex-col gap-2 bg-white p-2 md:p-10 dark:bg-neutral-900">
          {children}
        </div>
      </main>
    </div>
  );
}

// Rest of your logo components remain the same
export const Logo = () => {
  return (
    <a
      href="/home"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <IconFeatherFilled className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Dodo
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <IconFeatherFilled className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    </a>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <WalletGenerator />
      </div>
    </div>
  );
};
