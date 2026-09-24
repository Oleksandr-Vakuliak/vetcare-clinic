import type { Dictionary } from '@/lib/i18n/types';
import { siteContacts } from '@/lib/site-config';

export default function Contacts({ dict }: { dict: Dictionary }) {
  return (
    <section id="contacts" className="section section--alt">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">{dict.contacts.title}</h2>
          <span className="demo-badge">{dict.contacts.demoBadge}</span>
        </div>

        <div className="contacts-grid">
          <dl className="contacts__list">
            <dt>{dict.contacts.addressLabel}</dt>
            <dd>{dict.contacts.address}</dd>
            <dt>{dict.contacts.hoursLabel}</dt>
            <dd>{dict.contacts.hours}</dd>
          </dl>

          {siteContacts.mapEmbedUrl ? (
            <iframe
              className="map-placeholder"
              src={siteContacts.mapEmbedUrl}
              title={dict.contacts.title}
              style={{ border: 0 }}
              loading="lazy"
            />
          ) : (
            <div className="map-placeholder" role="img" aria-label={dict.contacts.mapPlaceholder}>
              {dict.contacts.mapPlaceholder}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
