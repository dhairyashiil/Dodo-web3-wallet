"use client";

import Collectibles from "./Collectibles";
import Token from "./Token";
import { Tabs } from "./ui/tabs";

export function DashboardTabsDemo() {
  const tabs = [
    {
      title: "Tokens",
      value: "tokens",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900 -mt-10">
          <p>Token Holdings</p>
          <Token />
        </div>
      ),
    },
    {
      title: "Collectibles",
      value: "collectibles",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900 -mt-24">
          <p>Collectibles tab</p>
          <Collectibles />
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
