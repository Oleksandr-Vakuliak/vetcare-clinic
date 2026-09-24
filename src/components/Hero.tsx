import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n/types';

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="hero" aria-label={dict.hero.title}>
      <div className="hero__media">
        <Image
          src="/images/hero.jpg"
          alt={dict.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <p className="hero__badge">{dict.hero.badge}</p>

      <div className="container hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">{dict.hero.title}</h1>
          <p className="hero__subtitle">{dict.hero.subtitle}</p>
          <div className="hero__actions">
            <a href="#booking" className="btn btn--primary">
              {dict.hero.ctaBooking}
            </a>
            <a href="#contacts" className="btn btn--ghost">
              {dict.hero.ctaContact}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
