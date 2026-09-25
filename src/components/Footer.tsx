import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import { siteContacts } from '@/lib/site-config';
import { ClockIcon, PawIcon, PinIcon } from './icons';

// Footer doubles as the contacts block (as in the design mockup): brand,
// address + hours, and the map slot. `#contacts` is the target of the nav link.
export default function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const c = dict.contacts;
  const year = new Date().getFullYear();

  return (
    <footer id="contacts" className="site-footer">
      <div className="container">
        <h2 className="visually-hidden">{c.title}</h2>

        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <span className="brand">
              <PawIcon className="brand__paw" width={30} height={30} fill="currentColor" stroke="none" />
              <span className="brand__name">{dict.header.clinicName}</span>
            </span>
            <p>{dict.footer.tagline}</p>
          </div>

          <dl className="site-footer__info">
            <div>
              <PinIcon width={22} height={22} />
              <dt className="visually-hidden">{c.addressLabel}</dt>
              <dd>{c.address}</dd>
            </div>
            <div>
              <ClockIcon width={22} height={22} />
              <dt>{c.hoursLabel}</dt>
              <dd>{c.hours}</dd>
            </div>
          </dl>

          {siteContacts.mapEmbedUrl ? (
            <iframe
              className="map-placeholder"
              src={siteContacts.mapEmbedUrl}
              title={c.title}
              style={{ border: 0 }}
              loading="lazy"
            />
          ) : (
            <div className="map-placeholder" role="img" aria-label={c.mapPlaceholder}>
              <PinIcon width={28} height={28} />
              <span>{c.mapPlaceholder}</span>
            </div>
          )}
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {dict.header.clinicName}. {dict.footer.rights}
          </p>
          {/* Secondary entry to the open demo admin panel (not a secured system). */}
          <Link href={`/${locale}/admin`} className="site-footer__admin">
            {dict.footer.adminLink}
          </Link>
          <span className="demo-badge">{dict.footer.demoBadge}</span>
        </div>
      </div>
    </footer>
  );
}
