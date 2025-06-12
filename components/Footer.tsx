import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <section className="mx-auto max-w-7xl border-t px-4">
      <div className="flex justify-between py-8">
        <p className="tracking-tight text-primary">
          Designed and Developed by{' '}
          <Link href={'https://x.com/Dhaiiryashiil'} className="font-bold">
            Dhairyashil
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Footer
