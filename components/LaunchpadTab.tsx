'use client'

import CreateToken from './CreateToken'
import { Tabs } from './ui/tabs'

export function LaunchpadTabsDemo() {
  const tabs = [
    {
      title: 'Token Launchpad',
      value: 'launchpad',
      content: (
        <div className="relative -mt-24 h-full w-full rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 text-white">
          <div className="p-10 pb-0 text-xl font-bold md:text-4xl">
            <p>Token Launchpad</p>
          </div>
          <div className="h-[calc(100%-80px)] overflow-y-auto p-10 pt-5 [-ms-overflow-style:none] [scrollbar-width:none]">
            <CreateToken />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="b relative mx-auto flex h-[20rem] w-full max-w-5xl flex-col items-start justify-start [perspective:1000px] md:h-[40rem]">
      <Tabs tabs={tabs} />
    </div>
  )
}
