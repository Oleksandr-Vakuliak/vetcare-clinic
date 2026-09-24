import type { Dictionary } from '@/lib/i18n/types';
import { siteContacts, whatsappLink, telegramLink } from '@/lib/site-config';
import { WhatsAppIcon, TelegramIcon } from './icons';

export default function Messengers({ dict }: { dict: Dictionary }) {
  const wa = whatsappLink(siteContacts.whatsapp);
  const tg = telegramLink(siteContacts.telegram);
  const configured = Boolean(wa || tg);

  return (
    <section id="messengers" className="section">
      <div className="container">
        <div className="card messengers">
          <h2 className="section__title">{dict.messengers.title}</h2>
          <p style={{ color: 'var(--color-muted)' }}>{dict.messengers.text}</p>

          <div className="messengers__buttons">
            {wa ? (
              <a
                className="btn btn--primary"
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon width={20} height={20} /> {dict.messengers.whatsapp}
              </a>
            ) : (
              <button type="button" className="btn btn--primary" disabled aria-disabled="true">
                <WhatsAppIcon width={20} height={20} /> {dict.messengers.whatsapp}
              </button>
            )}

            {tg ? (
              <a
                className="btn btn--outline"
                href={tg}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TelegramIcon width={20} height={20} /> {dict.messengers.telegram}
              </a>
            ) : (
              <button type="button" className="btn btn--outline" disabled aria-disabled="true">
                <TelegramIcon width={20} height={20} /> {dict.messengers.telegram}
              </button>
            )}
          </div>

          {!configured && <p className="demo-note">{dict.messengers.demoNote}</p>}
        </div>
      </div>
    </section>
  );
}
