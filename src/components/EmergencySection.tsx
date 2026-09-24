import type { Dictionary } from '@/lib/i18n/types';
import { siteContacts, telLink } from '@/lib/site-config';
import { PhoneIcon } from './icons';

export default function EmergencySection({ dict }: { dict: Dictionary }) {
  const phone = telLink(siteContacts.emergencyPhone ?? siteContacts.phone);

  return (
    <section id="emergency" className="section">
      <div className="container">
        <div className="emergency-band">
          <h2>{dict.emergency.sectionTitle}</h2>
          <p>{dict.emergency.sectionText}</p>

          {phone ? (
            <a className="btn btn--danger" href={phone}>
              <PhoneIcon width={20} height={20} /> {dict.emergency.call}
            </a>
          ) : (
            <>
              <button type="button" className="btn btn--danger" disabled aria-disabled="true">
                <PhoneIcon width={20} height={20} /> {dict.emergency.call}
              </button>
              <p className="demo-note" style={{ background: 'var(--color-red-soft)', color: 'var(--color-red-dark)' }}>
                {dict.emergency.demoNote}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
