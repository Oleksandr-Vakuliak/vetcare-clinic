import type { Dictionary } from '@/lib/i18n/types';
import { siteContacts, telLink } from '@/lib/site-config';
import { BellIcon, PhoneIcon } from './icons';

export default function EmergencySection({ dict }: { dict: Dictionary }) {
  const phone = telLink(siteContacts.emergencyPhone ?? siteContacts.phone);

  return (
    <section id="emergency" className="section section--compact">
      <div className="container">
        <div className="emergency-band">
          <span className="emergency-band__icon" aria-hidden="true">
            <BellIcon width={28} height={28} />
          </span>

          <div className="emergency-band__text">
            <h2>{dict.emergency.sectionTitle}</h2>
            <p>{dict.emergency.sectionText}</p>
            {!phone && <p className="emergency-band__demo">{dict.emergency.demoNote}</p>}
          </div>

          {phone ? (
            <a className="btn btn--danger btn--lg" href={phone}>
              <PhoneIcon width={22} height={22} /> {dict.emergency.call}
            </a>
          ) : (
            <button type="button" className="btn btn--danger btn--lg" disabled aria-disabled="true">
              <PhoneIcon width={22} height={22} /> {dict.emergency.call}
            </button>
          )}

          {/* Real working hours instead of an invented on-call clinic (SPEC 5.7). */}
          <p className="emergency-band__after">
            <strong>{dict.emergency.hoursLabel}</strong>
            <br />
            {dict.emergency.hoursValue}
          </p>
        </div>
      </div>
    </section>
  );
}
