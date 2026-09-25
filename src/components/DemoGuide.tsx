import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import { ArrowRightIcon } from './icons';

// "How to try the demo" band under the hero: the shortest path through the
// three parts (pet account → admin panel → pet account). Static, no JS.
export default function DemoGuide({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const g = dict.demoGuide;
  const hrefs = [`/${locale}/account`, `/${locale}/admin/appointments`, `/${locale}/account`];

  return (
    <section className="demo-guide" aria-labelledby="demo-guide-title">
      <div className="container">
        <div className="demo-guide__head">
          <h2 id="demo-guide-title" className="demo-guide__title">
            {g.title}
          </h2>
          <p className="demo-guide__text">{g.text}</p>
        </div>
        <ol className="demo-guide__steps">
          {g.steps.map((step, i) => (
            <li key={i} className="demo-guide__step">
              <span className="demo-guide__num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="demo-guide__step-title">{step.title}</h3>
                <p>{step.text}</p>
                <Link href={hrefs[i]} className="demo-guide__link">
                  {step.link} <ArrowRightIcon width={16} height={16} />
                </Link>
              </div>
            </li>
          ))}
        </ol>
        <p className="demo-guide__note">{g.formNote}</p>
      </div>
    </section>
  );
}
