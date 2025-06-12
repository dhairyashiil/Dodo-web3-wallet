import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'

interface MnemonicDisplayProps {
  showMnemonic: boolean
  setShowMnemonic: (value: boolean) => void
  mnemonicWords: string[]
  copyToClipboard: (content: string) => void
}

const MnemonicDisplay = ({
  setShowMnemonic,
  showMnemonic,
  mnemonicWords,
  copyToClipboard,
}: MnemonicDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className="group flex cursor-pointer flex-col items-center gap-4 rounded-lg border border-primary/10 p-8"
    >
      <div
        className="flex w-full items-center justify-between"
        onClick={() => setShowMnemonic(!showMnemonic)}
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Your Secret Phrase</h2>
        <Button onClick={() => setShowMnemonic(!showMnemonic)} variant="ghost">
          {showMnemonic ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>
      </div>

      {showMnemonic && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="flex w-full flex-col items-center justify-center"
          onClick={() => copyToClipboard(mnemonicWords.join(' '))}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="mx-auto my-8 grid w-full grid-cols-2 items-center justify-center gap-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {mnemonicWords.map((word, index) => (
              <p
                key={index}
                className="rounded-lg bg-foreground/5 p-4 transition-all duration-300 hover:bg-foreground/10 md:text-lg"
              >
                {word}
              </p>
            ))}
          </motion.div>
          <div className="flex w-full items-center gap-2 text-sm text-primary/50 transition-all duration-300 group-hover:text-primary/80 md:text-base">
            <Copy className="size-4" /> Click Anywhere To Copy
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default MnemonicDisplay
