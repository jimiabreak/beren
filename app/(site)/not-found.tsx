import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <h1 className="font-serif text-6xl sm:text-8xl font-bold text-foreground mb-4">404</h1>
      <h2 className="font-serif text-2xl sm:text-3xl mb-4">Page Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button href="/" variant="primary">
        Return Home
      </Button>
    </div>
  )
}
