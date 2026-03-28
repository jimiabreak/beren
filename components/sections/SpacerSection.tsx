import { stegaClean } from '@sanity/client/stega'

interface SpacerSectionProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap: Record<string, string> = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
}

export default function SpacerSection({ size = 'md' }: SpacerSectionProps) {
  const cleanSize = stegaClean(size)
  return <div className={sizeMap[cleanSize] || sizeMap.md} aria-hidden="true" />
}
