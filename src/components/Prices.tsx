import type { Dictionary } from '@/lib/i18n/types';
import { localeMeta, type Locale } from '@/lib/i18n/config';
import { priceList, priceCurrency } from '@/lib/site-config';

export default function Prices({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const formatter = new Intl.NumberFormat(localeMeta[locale].intl, {
    style: 'currency',
    currency: priceCurrency,
    maximumFractionDigits: 0,
  });

  return (
    <section id="prices" className="section">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">{dict.prices.title}</h2>
        </div>
        <p className="prices__note">{dict.prices.note}</p>

        <ul className="prices-grid">
          {dict.prices.groups.map((group, i) => {
            const groupTitle = dict.services.items[i]?.title ?? '';
            const amounts = priceList[i] ?? [];
            return (
              <li key={i} className="price-group">
                <h3 className="price-group__title">{groupTitle}</h3>
                <dl className="price-list">
                  {group.items.map((name, j) => {
                    const price = formatter.format(amounts[j]?.amount ?? 0);
                    return (
                      <div key={j} className="price-row">
                        <dt>{name}</dt>
                        <dd>{dict.prices.from.replace('{price}', price)}</dd>
                      </div>
                    );
                  })}
                </dl>
              </li>
            );
          })}
        </ul>

        <p className="demo-note prices__demo">{dict.prices.demoNote}</p>
      </div>
    </section>
  );
}
