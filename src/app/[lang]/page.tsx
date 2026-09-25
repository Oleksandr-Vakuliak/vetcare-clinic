import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale } from '@/lib/i18n/config';
import Header from '@/components/Header';
import EmergencyFab from '@/components/EmergencyFab';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Booking from '@/components/Booking';
import Messengers from '@/components/Messengers';
import EmergencySection from '@/components/EmergencySection';
import Footer from '@/components/Footer';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Header dict={dict} locale={lang} />
      <main id="main">
        <Hero dict={dict} />
        <Services dict={dict} />
        <About dict={dict} />

        <section id="booking" className="section section--tint">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">{dict.booking.title}</h2>
            </div>
            <Booking dict={dict} locale={lang} />
          </div>
        </section>

        <Messengers dict={dict} />
        <EmergencySection dict={dict} />
      </main>
      <Footer dict={dict} locale={lang} />
      <EmergencyFab dict={dict} />
    </>
  );
}
