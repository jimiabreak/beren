import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'

interface LogoBarSectionProps {
  heading?: string
  logos?: Array<{ _key: string; asset: SanityImageSource; alt?: string }>
  grayscale?: boolean
}

export default function LogoBarSection({ heading, logos, grayscale = true }: LogoBarSectionProps) {
  const hasLogos = logos && logos.length > 0

  return (
    <section className="py-16 md:py-20">
      <Container>
        {heading && (
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground text-center mb-10">
            {heading}
          </h2>
        )}
        {hasLogos ? (
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <div
                key={logo._key}
                className={`h-8 md:h-10 transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)] ${grayscale ? 'grayscale' : ''} opacity-40 hover:opacity-100 hover:grayscale-0`}
              >
                <SanityImage
                  image={logo}
                  alt={logo.alt || ''}
                  height={40}
                  width={120}
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-12">
            {['Client', 'Client', 'Client', 'Client', 'Client'].map((name, i) => (
              <span key={i} className="font-mono text-sm uppercase tracking-widest text-muted-foreground opacity-40">
                {name}
              </span>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
