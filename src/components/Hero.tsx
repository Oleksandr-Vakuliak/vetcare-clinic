import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n/types';
import { HeartIcon } from './icons';

export default function Hero({ dict }: { dict: Dictionary }) {
  const cut = dict.hero.note.lastIndexOf(' ') + 1;
  const noteHead = dict.hero.note.slice(0, cut);
  const noteTail = dict.hero.note.slice(cut);

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
          <p className="handnote hero__note">
            {noteHead}
            {/* Keep the last word and the heart together on one line. */}
            <span className="nowrap">
              {noteTail} <HeartIcon width={22} height={22} />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
