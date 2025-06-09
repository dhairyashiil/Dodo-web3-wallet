"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { HoverBorderGradientDemo } from "./HoverBorderGradientButton";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      <p className="text-black dark:text-white"></p>
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-7xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <div className="flex items-center justify-between w-full h-7">
          {/* Left side - Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="bg-blue-50 inline-block">
                <Image
                  src={"/dodo-logo.svg"}
                  width={100}
                  height={60}
                  alt={"Rocket Chat Logo"}
                  className=""
                />
              </div>
            </Link>
          </div>

          {/* Center - Menu Items */}
          <div className="flex items-center space-x-4">
            

            <MenuItem setActive={setActive} active={active} item="Home">
              <div className="flex flex-col space-y-4 text-sm p-4">
                <HoveredLink href="/receive">Receive</HoveredLink>
                <HoveredLink href="/send">Send</HoveredLink>
                <HoveredLink href="/swap">Swap</HoveredLink>
                <HoveredLink href="/buy">Buy</HoveredLink>
                <HoveredLink href="/airdrop">Airdrop</HoveredLink>
              </div>
            </MenuItem>

            <HoveredLink href="/swap">Swap</HoveredLink>

            <MenuItem setActive={setActive} active={active} item="Search">
              <div className="flex flex-col space-y-4 text-sm p-4">
                <HoveredLink href="/search">Tokens</HoveredLink>
                <HoveredLink href="/search">Lists</HoveredLink>
                <HoveredLink href="/search">Sites</HoveredLink>
                <HoveredLink href="/search">Collections</HoveredLink>
                <HoveredLink href="/search">Learn</HoveredLink>
              </div>
            </MenuItem>

            <HoveredLink href="/activity">Recent Activity</HoveredLink>
            {/* Right side - Buttons */}
            {/* <div className="flex items-center space-x-4">
              <HoverBorderGradientDemo />
              <AnimatedModalDemo />
            </div> */}
          
          </div>

        </div>
      </Menu>
    </div>
  );
}
