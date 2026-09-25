import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n/types';

const teamPhotos = ['/images/vet-1.jpg', '/images/vet-2.jpg'];

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section id="team" className="section section--alt">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">{dict.about.title}</h2>
        </div>

        <div className="about-grid">
          <div className="about__text">
            <p className="about__lead">{dict.about.text}</p>
            <p className="about__note">{dict.about.demoNote}</p>
          </div>

          <ul className="team-grid">
            {dict.about.team.map((member, i) => (
              <li key={i} className="team-card">
                <div className="team-card__photo">
                  <Image
                    src={teamPhotos[i] ?? teamPhotos[0]}
                    alt={member.imageAlt}
                    width={800}
                    height={1000}
                    loading="lazy"
                    sizes="(min-width: 560px) 160px, 40vw"
                  />
                </div>
                <div className="team-card__body">
                  <span className="team-card__role">{member.role}</span>
                  <h3>{member.name}</h3>
                  <p>{member.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
