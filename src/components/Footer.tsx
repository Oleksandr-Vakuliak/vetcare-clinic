import type { Dictionary } from '@/lib/i18n/types';
import { PawIcon } from './icons';

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span className="brand">
          <span className="brand__mark">
            <PawIcon width={20} height={20} />
          </span>
          <span className="brand__text">{dict.header.clinicName}</span>
        </span>
        <p style={{ color: '#c8d6cd', fontSize: '0.9rem' }}>{dict.footer.rights}</p>
        <span className="demo-badge">{dict.footer.demoBadge}</span>
      </div>
    </footer>
  );
}
