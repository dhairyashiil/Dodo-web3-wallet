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
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-4 text-xl font-bold text-white md:p-6 md:text-2xl lg:p-10 lg:text-4xl">
          <p>Token Holdings</p>
          <Token />
        </div>
      ),
    },
    {
      title: 'Collectibles',
      value: 'collectibles',
      content: (
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-4 text-xl font-bold text-white md:p-6 md:text-2xl lg:p-10 lg:text-4xl">
          <p>Collectibles tab</p>
          <Collectibles />
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
