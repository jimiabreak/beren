import type { SanityImageSource } from '@sanity/image-url'
import SanityImage from '@/components/sanity/SanityImage'

interface TeamCardProps {
  name: string
  role?: string
  image: SanityImageSource
}

export default function TeamCard({ name, role, image }: TeamCardProps) {
  return (
    <div className="text-center">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4">
        <SanityImage
          image={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <h3 className="font-serif text-xl">{name}</h3>
      {role && <p className="text-sm text-muted-foreground mt-1">{role}</p>}
    </div>
  )
}
