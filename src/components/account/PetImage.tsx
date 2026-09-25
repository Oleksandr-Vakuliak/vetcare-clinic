import Image from 'next/image';
import type { Pet } from '@/lib/account/types';

const photos = { cat: '/images/pet-cat.jpg', dog: '/images/pet-dog.jpg' } as const;

interface Props {
  pet: Pet;
  alt: string;
  /** Rendered size hint for next/image. */
  sizes: string;
  className?: string;
  priority?: boolean;
}

// Demo pets have a photo; new pets get a neutral stock illustration of a cat or a dog.
export default function PetImage({ pet, alt, sizes, className, priority }: Props) {
  if (pet.photo) {
    return (
      <span className={className}>
        <Image
          src={photos[pet.photo]}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: 'cover', objectPosition: pet.photo === 'dog' ? 'center 20%' : 'center' }}
        />
      </span>
    );
  }
  return (
    <span className={`${className ?? ''} pet-illustration`} role="img" aria-label={alt}>
      {pet.species === 'cat' ? <CatShape /> : <DogShape />}
    </span>
  );
}

function CatShape() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M14 12l9 10a22 22 0 0 1 18 0l9-10 2 20c2 3 3 6 3 9 0 10-10 17-23 17S9 51 9 41c0-3 1-6 3-9l2-20Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="25" cy="38" r="2.6" fill="#fff" />
      <circle cx="39" cy="38" r="2.6" fill="#fff" />
      <path d="M29.5 45h5L32 48Z" fill="#fff" />
    </svg>
  );
}

function DogShape() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M20 14c6-3 18-3 24 0l8 4c3 2 3 6 1 14l-3 9c-1 9-8 15-18 15s-17-6-18-15l-3-9c-2-8-2-12 1-14l8-4Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="25" cy="34" r="2.6" fill="#fff" />
      <circle cx="39" cy="34" r="2.6" fill="#fff" />
      <ellipse cx="32" cy="44" rx="4" ry="3" fill="#fff" />
    </svg>
  );
}
