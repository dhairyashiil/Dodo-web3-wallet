'use client'

import CreateToken from './CreateToken'
import { Tabs } from './ui/tabs'

export function LaunchpadTabsDemo() {
  const tabs = [
    {
      title: 'Solana',
      value: 'launchpad',
      content: (
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-4 text-xl font-bold text-white md:p-6 md:text-2xl lg:p-10 lg:text-4xl">
          <div className="p-10 pb-0 pt-4 text-xl font-bold md:text-4xl">
            <p>Solana Token Creator</p>
          </div>
          <div className="h-[calc(100%-80px)] overflow-y-auto p-10 pt-5 [-ms-overflow-style:none] [scrollbar-width:none]">
            <CreateToken />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="relative mx-auto flex h-[30rem] w-full max-w-5xl flex-col items-start justify-start [perspective:1000px] sm:h-[35rem] md:h-[40rem]">
      <Tabs tabs={tabs} />
    </div>
  )
}
