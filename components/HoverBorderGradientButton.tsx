"use client";
import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { div } from "motion/react-client";
import Image from "next/image";

export function HoverBorderGradientDemo() {
  return (
    // <div className="m-40 flex justify-center text-center">
    <div>
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-gray-950 bg-white text-black dark:text-white flex items-center space-x-2"
      >
        {/* <RocketChatLogoSmall /> */}
        <span>Contact Me</span>
      </HoverBorderGradient>
    </div>
  );
}

const RocketChatLogoSmall = () => {
  return (
    <div className="bg-blue-50 inline-block">
      <Image
        src={"/dodo-logo.svg"}
        width={100}
        height={60}
        alt={"Rocket Chat Logo"}
        className="w-5 h-5 shrink-0 rounded-md shadow-2xl"
      />
    </div>
  );
};
