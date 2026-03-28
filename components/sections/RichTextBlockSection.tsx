import { PortableText } from '@portabletext/react'
import Container from '@/components/layout/Container'

type PortableTextValue = Parameters<typeof PortableText>[0]['value']

interface RichTextBlockSectionProps {
  heading?: string
  content?: PortableTextValue
}

export default function RichTextBlockSection({ heading, content }: RichTextBlockSectionProps) {
  if (!content) return null
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className={`max-w-3xl ${heading ? '' : 'mx-auto text-center'}`}>
          {heading && (
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-8">
              {heading}
            </h2>
          )}
          <div className="text-base md:text-lg leading-relaxed text-foreground/80">
            <PortableText value={content} />
          </div>
        </div>
      </Container>
    </section>
  )
}
