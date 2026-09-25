'use client';

import { useRef, useState } from 'react';
import { appointmentsForPet } from '@/lib/clinic/appointments';
import { nextAppointment } from '@/lib/account/state';
import { clinicNow } from '@/lib/clinic/time';
import PetImage from '../account/PetImage';
import {
  doctorName,
  fill,
  formatAge,
  formatDate,
  formatWeight,
  ownerName,
  petBreed,
  petName,
  reasonText,
  statusLabel,
} from '../account/format';
import { useDemoState } from '../demo-store';
import { PencilIcon, PlusIcon, SearchIcon } from '../icons';
import { useAdmin } from './AdminContext';
import PetDialog from './PetDialog';
import { formatShortDate, formatWhen } from './format';
import { useAppointmentActions } from './useAppointmentActions';

// "Улюбленці": searchable list of demo pets and a card with basic data, the
// fictional owner and the appointment history. Only basic data can be edited.
export default function PetsView() {
  const { a, d, locale } = useAdmin();
  const state = useDemoState();
  const actions = useAppointmentActions(state);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ type: 'add' | 'edit'; opener: HTMLElement } | null>(null);
  const cardTitle = useRef<HTMLHeadingElement>(null);

  if (!state) return <p className="account-loading">{a.loading}</p>;

  const p = a.pets;
  const q = query.trim().toLocaleLowerCase();
  const pets = state.pets
    .map((pet) => ({ pet, name: petName(pet, d), owner: ownerName(pet, d) }))
    .filter((x) => !q || x.name.toLocaleLowerCase().includes(q) || x.owner.toLocaleLowerCase().includes(q))
    .sort((x, y) => x.name.localeCompare(y.name, locale));
  const selected = state.pets.find((pet) => pet.id === selectedId) ?? pets[0]?.pet ?? null;

  function choose(id: string) {
    setSelectedId(id);
    // Move focus to the card so keyboard and screen-reader users land on it.
    requestAnimationFrame(() => cardTitle.current?.focus());
  }

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-title">{p.title}</h1>
        <button type="button" className="btn btn--primary btn--lg" onClick={(e) => setDialog({ type: 'add', opener: e.currentTarget })}>
          <PlusIcon width={20} height={20} /> {p.add}
        </button>
      </div>

      <div className="pets-layout">
        <section className="admin-card admin-panel" aria-labelledby="pets-list">
          <h2 id="pets-list" className="visually-hidden">
            {p.title}
          </h2>
          <div className="admin-field admin-field--search" role="search">
            <label htmlFor="pets-q" className="visually-hidden">
              {a.filters.search}
            </label>
            <SearchIcon width={20} height={20} className="admin-field__icon" />
            <input id="pets-q" type="search" value={query} placeholder={p.searchPlaceholder} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {pets.length === 0 ? (
            <p className="account-empty">{p.empty}</p>
          ) : (
            <ul className="pet-list">
              {pets.map(({ pet, name, owner }) => (
                <li key={pet.id}>
                  <button
                    type="button"
                    className="pet-list__item"
                    aria-pressed={selected?.id === pet.id}
                    aria-label={fill(p.open, { name })}
                    onClick={() => choose(pet.id)}
                  >
                    <PetImage pet={pet} alt="" sizes="48px" className="admin-pet__img" />
                    <span>
                      <strong className="admin-pet__name">{name}</strong>
                      <span className="admin-pet__meta">
                        {d.pets.species[pet.species]} · {owner}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {selected && renderCard(selected)}
      </div>

      {actions.element}
      {dialog?.type === 'add' && (
        <PetDialog returnFocus={dialog.opener} onClose={() => setDialog(null)} onAdded={(id) => setSelectedId(id)} />
      )}
      {dialog?.type === 'edit' && selected && (
        <PetDialog pet={selected} returnFocus={dialog.opener} onClose={() => setDialog(null)} />
      )}
    </>
  );

  function renderCard(pet: NonNullable<typeof selected>) {
    const name = petName(pet, d);
    const history = appointmentsForPet(state!, pet.id);
    const next = nextAppointment(state!, pet.id, clinicNow());
    return (
      <section className="admin-card admin-panel pet-card" aria-labelledby="pet-card-title">
        <div className="pet-card__head">
          <PetImage
            pet={pet}
            alt={pet.photo ? fill(d.pets.photoAlt, { name }) : d.pets.stockImageAlt[pet.species]}
            sizes="160px"
            className="pet-card__photo"
          />
          <div>
            <h2 id="pet-card-title" className="admin-h2" tabIndex={-1} ref={cardTitle}>
              {name}
            </h2>
            {pet.inAccount && <span className="demo-tag">{p.inAccount}</span>}
            <dl className="pet-card__facts">
              <dt>{d.form.species}</dt>
              <dd>{d.pets.species[pet.species]}</dd>
              <dt>{d.pets.breedLabel}</dt>
              <dd>{petBreed(pet, d) ?? d.pets.breedUnknown}</dd>
              <dt>{p.birthDate}</dt>
              <dd>
                {formatDate(pet.birthDate, locale)} ({formatAge(pet.birthDate, d, locale)})
              </dd>
              <dt>{p.weight}</dt>
              <dd>{fill(d.pets.weight, { value: formatWeight(pet.weightKg, locale) }).replace(/^[^:]*:\s*/, '')}</dd>
              <dt>{p.owner}</dt>
              <dd>{ownerName(pet, d)}</dd>
              <dt>{p.nextVisit}</dt>
              <dd>{next ? formatWhen(next.date, next.time, locale) : p.none}</dd>
            </dl>
            <button type="button" className="btn btn--outline btn--sm" onClick={(e) => setDialog({ type: 'edit', opener: e.currentTarget })}>
              <PencilIcon width={18} height={18} /> {p.edit}
            </button>
          </div>
        </div>
        <p className="demo-hint">{p.scopeNote}</p>

        <h3 className="admin-subtitle">{p.history}</h3>
        {history.length === 0 ? (
          <p className="account-empty">{p.noHistory}</p>
        ) : (
          <ul className="record-list">
            {history.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  className="record-row admin-history-row"
                  onClick={(e) => actions.openDetails(x.id, e.currentTarget)}
                  aria-label={`${a.actions.details}: ${formatWhen(x.date, x.time, locale)}`}
                >
                  <span className="record-row__date">
                    {formatShortDate(x.date, locale)} · {x.time}
                  </span>
                  <span>{reasonText(x.reason, d)}</span>
                  <span className="record-row__muted">{doctorName(x.doctorId, d)}</span>
                  <span className={`status-badge status-badge--${x.status}`}>{statusLabel(x.status, d)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }
}
