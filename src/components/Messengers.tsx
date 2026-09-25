import type { Dictionary } from '@/lib/i18n/types';
import { siteContacts, whatsappLink, telegramLink } from '@/lib/site-config';
import { WhatsAppIcon, TelegramIcon } from './icons';

export default function Messengers({ dict }: { dict: Dictionary }) {
  const wa = whatsappLink(siteContacts.whatsapp);
  const tg = telegramLink(siteContacts.telegram);
  const configured = Boolean(wa || tg);

  const waContent = (
    <>
      <WhatsAppIcon width={26} height={26} /> {dict.messengers.whatsapp}
    </>
  );
  const tgContent = (
    <>
      <TelegramIcon width={26} height={26} /> {dict.messengers.telegram}
    </>
  );

  return (
    <section id="messengers" className="section section--compact">
      <div className="container messengers">
        <div className="messengers__text">
          <h2 className="section__title">{dict.messengers.title}</h2>
          <p>{dict.messengers.text}</p>
          {!configured && <p className="demo-note">{dict.messengers.demoNote}</p>}
        </div>

        <div className="messengers__buttons">
          {wa ? (
            <a className="messenger-btn messenger-btn--wa" href={wa} target="_blank" rel="noopener noreferrer">
              {waContent}
            </a>
          ) : (
            <button type="button" className="messenger-btn messenger-btn--wa" disabled aria-disabled="true">
              {waContent}
            </button>
          )}
          {tg ? (
            <a className="messenger-btn messenger-btn--tg" href={tg} target="_blank" rel="noopener noreferrer">
              {tgContent}
            </a>
          ) : (
            <button type="button" className="messenger-btn messenger-btn--tg" disabled aria-disabled="true">
              {tgContent}
            </button>
          )}
        </div>

        <p className="handnote messengers__note">{dict.messengers.note}&nbsp;☺</p>
      </div>
    </section>
  );
}
