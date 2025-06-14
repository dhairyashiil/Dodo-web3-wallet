import React from 'react'
import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card'

export function DraggableCardDemo() {
  const items = [
    {
      title: '#4793',
      description: 'Bored Ape Yacht Club',
      image:
        'https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/c04b8fdac7bc63599741fe54f81ae6/60c04b8fdac7bc63599741fe54f81ae6.png?w=1000',
      mobileClass: 'top-20 left-[5%] rotate-[-5deg]',
      desktopClass: 'top-10 left-[20%] rotate-[-5deg]',
    },
    {
      title: 'Elemental #13547',
      description: 'Azuki Elementals',
      image:
        'https://i2.seadn.io/ethereum/0xb6a37b5d14d502c3ab0ae6f3a0e058bc9517786e/31c2497229949731207af6d143f7ed/3031c2497229949731207af6d143f7ed.png?w=1000',
      mobileClass: 'top-80 left-[50%] rotate-[10deg]',
      desktopClass: 'top-40 left-[25%] rotate-[-7deg]',
    },
    {
      title: 'DeGod #1695',
      description: 'DeGod',
      image: 'https://metadata.degods.com/g/1694-dead-rm.png',
      mobileClass: 'top-10 left-[30%] rotate-[8deg]',
      desktopClass: 'top-5 left-[40%] rotate-[8deg]',
    },
    {
      title: '#5154',
      description: 'Bored Ape Kennel Club',
      image:
        'https://i2.seadn.io/ethereum/0xba30e5f9bb24caa003e9f2f0497ad287fdf95623/29b37c0eeb9397de96bbb4f2a6caa416.png?w=1000',
      mobileClass: 'top-80 left-[50%] rotate-[10deg]',
      desktopClass: 'top-32 left-[55%] rotate-[10deg]',
    },
    {
      title: 'Elemental #10455',
      description: 'Azuki Elementals',
      image:
        'https://i2.seadn.io/ethereum/0xb6a37b5d14d502c3ab0ae6f3a0e058bc9517786e/cd3726755c13bcfe9ebef76300374c/99cd3726755c13bcfe9ebef76300374c.png?w=1000',
      mobileClass: 'top-40 right-[15%] rotate-[2deg]',
      desktopClass: 'top-20 right-[35%] rotate-[2deg]',
    },
    {
      title: 'Kanpai Panda',
      description: 'Kanpai Pandas',
      image:
        'https://i2.seadn.io/ethereum/0xacf63e56fd08970b43401492a02f6f38b6635c91/31126108b61f62fdc62282fa2487c6/1d31126108b61f62fdc62282fa2487c6.png?w=1000',
      mobileClass: 'top-60 left-[35%] rotate-[-7deg]',
      desktopClass: 'top-24 left-[45%] rotate-[-7deg]',
    },
    {
      title: 'Swag Apes #230',
      description: 'Swag Apes',
      image:
        'https://i2.seadn.io/ape_chain/0xab80f606fdb974b7131036fb605af779d0d03053/3142c6dbd6b7952a74be4d3a9216ec/3f3142c6dbd6b7952a74be4d3a9216ec.webp?w=1000',
      mobileClass: 'top-16 left-[20%] rotate-[4deg]',
      desktopClass: 'top-8 left-[35%] rotate-[4deg]',
    },
  ]

  return (
    <DraggableCardContainer className="relative flex min-h-[70vh] w-full items-center justify-center overflow-clip md:min-h-[70vh] xl:min-h-[75vh]">
      <p className="absolute top-4 mx-auto max-w-xs px-4 text-center text-xs font-black text-neutral-400 dark:text-neutral-800 sm:max-w-sm sm:-translate-y-3/4 sm:text-sm">
        This NFT is shown for example purposes only. We do not own it. All rights belong to the
        original owner/creator.
      </p>
      {items.map((item, index) => (
        <DraggableCardBody
          key={index}
          className={`absolute w-fit ${item.mobileClass} sm:${item.desktopClass}`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="pointer-events-none relative z-10 h-48 w-48 object-cover sm:h-64 sm:w-64 md:h-80 md:w-80"
          />
          <h3 className="mt-2 w-48 text-center text-lg font-bold text-neutral-700 dark:text-neutral-300 sm:mt-4 sm:w-64 sm:text-xl md:w-80 md:text-2xl">
            {item.title}
          </h3>
          <p className="mt-1 w-48 text-center text-xs text-neutral-700 dark:text-neutral-300 sm:mt-2 sm:w-64 sm:text-sm md:w-80">
            {item.description}
          </p>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  )
}
