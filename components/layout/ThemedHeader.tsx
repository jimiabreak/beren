'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ThemedHeaderProps {
  theme?: 'light' | 'dark';
}

export default function ThemedHeader({ theme = 'light' }: ThemedHeaderProps) {
  const textColor = theme === 'light' ? 'text-brand-blue' : 'text-cream';
  const pathname = usePathname();

  return (
    <header className="relative z-50 bg-transparent py-4 md:py-7 px-4 w-full">
      <nav className="grid grid-cols-3 items-start max-w-[1512px] mx-auto gap-2 md:gap-4">
        <Link
          href="/info"
          aria-current={pathname === '/info' ? 'page' : undefined}
          className={`font-sans ${textColor} text-3xl sm:text-2xl md:text-4xl lg:text-[60px] tracking-[-0.06em] hover:opacity-70 transition-all duration-300 text-left`}
        >
          Info
        </Link>
        <Link
          href="/menu"
          aria-current={pathname === '/menu' ? 'page' : undefined}
          className={`font-sans ${textColor} text-3xl sm:text-2xl md:text-4xl lg:text-[60px] tracking-[-0.06em] hover:opacity-70 transition-all duration-300 text-center`}
        >
          Menu
        </Link>
        <a
          href="https://order.spoton.com/so-commonwealth-cafe-53/birmingham-mi/5ec45f979adef31aa78c2002/"
          target="_blank"
          rel="noopener noreferrer"
          className={`font-sans ${textColor} text-3xl sm:text-2xl md:text-4xl lg:text-[60px] tracking-[-0.06em] hover:opacity-70 transition-all duration-300 text-right leading-tight`}
        >
          <span className="hidden sm:inline">Order Now</span>
          <span className="sm:hidden">Order</span>
        </a>
      </nav>
    </header>
  );
}
