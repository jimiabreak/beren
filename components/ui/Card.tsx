import Image from 'next/image';
import { CardProps } from '@/types';

export default function Card({
  title,
  description,
  image,
  imageAlt = '',
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  const baseStyles = 'rounded-lg overflow-hidden transition-all duration-200';

  const variantStyles = {
    default: 'bg-cream-50',
    elevated: 'bg-cream-50 shadow-md hover:shadow-lg',
    outline: 'bg-transparent border-2 border-cream-300 hover:border-coffee-500',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div className={combinedStyles}>
      {image && (
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {title && (
          <h3 className="text-title text-charcoal-900 mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-charcoal-700 text-base mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
