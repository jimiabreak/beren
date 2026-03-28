import { stegaClean } from '@sanity/client/stega'
import HeroSection from '@/components/sections/HeroSection'
import FeatureGridSection from '@/components/sections/FeatureGridSection'
import RichTextBlockSection from '@/components/sections/RichTextBlockSection'
import ImageGallerySection from '@/components/sections/ImageGallerySection'
import TestimonialCarouselSection from '@/components/sections/TestimonialCarouselSection'
import CtaBannerSection from '@/components/sections/CtaBannerSection'
import VideoSection from '@/components/sections/VideoSection'
import TeamGridSection from '@/components/sections/TeamGridSection'
import FaqAccordionSection from '@/components/sections/FaqAccordionSection'
import StatsBarSection from '@/components/sections/StatsBarSection'
import LogoBarSection from '@/components/sections/LogoBarSection'
import SpacerSection from '@/components/sections/SpacerSection'
import NewsletterSectionBlock from '@/components/sections/NewsletterSectionBlock'
import SplitContent from '@/components/sections/SplitContent'
import ContactForm from '@/components/sections/ContactForm'
import Embed from '@/components/sections/Embed'
import BlogGridSection from '@/components/sections/BlogGridSection'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sectionComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  featureGrid: FeatureGridSection,
  richTextBlock: RichTextBlockSection,
  imageGallery: ImageGallerySection,
  testimonialCarousel: TestimonialCarouselSection,
  ctaBanner: CtaBannerSection,
  videoSection: VideoSection,
  teamGrid: TeamGridSection,
  faqAccordion: FaqAccordionSection,
  statsBar: StatsBarSection,
  logoBar: LogoBarSection,
  spacer: SpacerSection,
  newsletterSection: NewsletterSectionBlock,
  splitContent: SplitContent,
  contactForm: ContactForm,
  embed: Embed,
  blogGrid: BlogGridSection,
}

interface SectionRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections?: Array<{ _type: string; _key: string; [key: string]: any }>
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) return null
  return (
    <>
      {sections.map((section) => {
        const cleanType = stegaClean(section._type)
        const Component = sectionComponents[cleanType]
        if (!Component) {
          console.warn(`Unknown section type: ${cleanType}`)
          return null
        }
        return <Component key={section._key} {...section} />
      })}
    </>
  )
}
