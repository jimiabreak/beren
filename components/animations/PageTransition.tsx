'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for a smooth, natural feel
    },
  },
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="enter"
    >
      {children}
    </motion.div>
  )
}
