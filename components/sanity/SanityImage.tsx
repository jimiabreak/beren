import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/sanity/lib/image'

interface SanityImageProps {
  image: SanityImageSource
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
  blurDataURL?: string
}

export default function SanityImage({
  image,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  priority = false,
  blurDataURL,
}: SanityImageProps) {
  if (!image || typeof image === 'string' || !('asset' in image)) return null

  const blurProps = blurDataURL
    ? { placeholder: 'blur' as const, blurDataURL }
    : {}

  if (fill) {
    const imageUrl = urlFor(image)
      .auto('format')
      .quality(80)
      .url()

    const hotspot = (image as { hotspot?: { x: number; y: number } })?.hotspot
    const objectPosition = hotspot
      ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
      : undefined

    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes={sizes || '100vw'}
        className={className}
        priority={priority}
        style={{ objectPosition }}
        {...blurProps}
      />
    )
  }

  const w = width || 800
  const h = height || 600

  const imageUrl = urlFor(image)
    .auto('format')
    .quality(80)
    .width(w)
    .height(h)
    .fit('crop')
    .url()

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      className={className}
      priority={priority}
      {...blurProps}
    />
  )
}
