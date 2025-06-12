"use client";

import AirdropToken from "./AirdropToken";
import Collectibles from "./Collectibles";
import SendToken from "./SendToken";
import { Tabs } from "./ui/tabs";

export function TransactionTabsDemo() {
  const tabs = [
    {
      title: "Send",
      value: "send",
      content: (
        <div className="w-full relative h-full rounded-2xl text-white bg-gradient-to-br from-purple-700 to-violet-900 -mt-24">
          <div className="p-10 pb-0 text-xl md:text-4xl font-bold">
            <p>Send Token</p>
          </div>
          <div className="overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] h-[calc(100%-80px)] p-10 pt-5">
            <SendToken />
          </div>
        </div>
      ),
    },
    {
      title: "Airdrop",
      value: "airdrop",
      content: (
        <div className="w-full relative h-full rounded-2xl text-white bg-gradient-to-br from-purple-700 to-violet-900 -mt-24">
          <div className="p-10 pb-0 text-xl md:text-4xl font-bold">
            <p>Airdrop Token</p>
          </div>
          <div className="overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] h-[calc(100%-80px)] p-10 pt-5">
            <AirdropToken />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start">
      <Tabs tabs={tabs} />
    </div>
  );
}
