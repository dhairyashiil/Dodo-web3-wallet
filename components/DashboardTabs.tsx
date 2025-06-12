'use client'

import Collectibles from './Collectibles'
import Token from './Token'
import { Tabs } from './ui/tabs'

export function DashboardTabsDemo() {
  const tabs = [
    {
      title: 'Tokens',
      value: 'tokens',
      content: (
        <div className="relative -mt-10 h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Token Holdings</p>
          <Token />
        </div>
      ),
    },
    {
      title: 'Collectibles',
      value: 'collectibles',
      content: (
        <div className="relative -mt-24 h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Collectibles tab</p>
          <Collectibles />
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
