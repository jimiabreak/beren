import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
  target?: string
  rel?: string
}

const variants = {
  primary: 'bg-foreground text-background hover:opacity-80',
  secondary: 'bg-transparent border-2 border-accent text-muted-foreground hover:bg-accent hover:text-background',
  outline: 'bg-transparent border-2 border-accent text-muted-foreground hover:bg-accent hover:text-background',
}

const sizes = {
  sm: 'px-6 py-3 text-sm',
  md: 'px-8 py-3.5 text-base',
  lg: 'px-10 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ariaLabel,
  target,
  rel,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans uppercase tracking-wider transition-[color,background-color,border-color,opacity,transform] duration-200 ease-out min-h-touch active:scale-[0.97] active:transition-transform active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
  const classes = cn(baseStyles, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className)

  if (href) {
    const isExternal = href.startsWith('http')
    if (isExternal) {
      return (
        <a href={href} className={classes} aria-label={ariaLabel} target={target || '_blank'} rel={rel || 'noopener noreferrer'}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
