import type { Dictionary } from '@/lib/i18n/types';
import { serviceIcons } from './icons';

export default function Services({ dict }: { dict: Dictionary }) {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">{dict.services.title}</h2>
        </div>
        <ul className="services-grid">
          {dict.services.items.map((item, i) => {
            const Icon = serviceIcons[i] ?? serviceIcons[0];
            return (
              <li key={i} className="service-card">
                <span className="service-card__icon">
                  <Icon width={24} height={24} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
