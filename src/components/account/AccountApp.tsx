'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { AccountDictionary } from '@/lib/i18n/account-types';
import type { Locale } from '@/lib/i18n/config';
import type { PetDocument, TabId, Visit } from '@/lib/account/types';
import {
  addPet,
  documentsFor,
  nextAppointment,
  nextVaccination,
  petById,
  selectPet,
  selectTab,
  updatePet,
  vaccinationsFor,
  visitsFor,
} from '@/lib/account/state';
import {
  CalendarIcon,
  ChevronRightIcon,
  NoteIcon,
  PawIcon,
  PencilIcon,
  PlusIcon,
  UserIcon,
  WeightIcon,
} from '../icons';
import { newId, resetAccount, updateAccount, useAccountState } from './store';
import {
  fill,
  formatAge,
  formatDate,
  formatDayMonth,
  formatWeight,
  petBreed,
  petName,
} from './format';
import Dialog from './Dialog';
import PetForm, { petToInput } from './PetForm';
import PetImage from './PetImage';
import BookingDialog from './BookingDialog';

interface Props {
  site: Dictionary;
  d: AccountDictionary;
  locale: Locale;
}

// `opener` is the button that opened the dialog; focus returns to it on close.
type Modal = (
  | { type: 'add' }
  | { type: 'edit' }
  | { type: 'book' }
  | { type: 'visit'; visit: Visit }
  | { type: 'document'; doc: PetDocument }
  | { type: 'reset' }
) & { opener?: HTMLElement };

const TABS: TabId[] = ['visits', 'vaccines', 'documents'];

export default function AccountApp({ site, d, locale }: Props) {
  const state = useAccountState();
  const [modal, setModal] = useState<Modal | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    visits: null,
    vaccines: null,
    documents: null,
  });

  // Server render and the first client render: no data yet (it lives in this
  // browser). Show a same-language placeholder of the same shape.
  if (!state) {
    return (
      <div className="account-loading" aria-busy="true">
        <p>{d.loading}</p>
      </div>
    );
  }

  const pet = petById(state, state.ui.petId) ?? state.pets[0];
  const name = petName(pet, d);
  const breed = petBreed(pet, d);
  // A pet without any records (e.g. just added): empty states explain why.
  const visits = visitsFor(state, pet.id);
  const vaccinations = vaccinationsFor(state, pet.id);
  const documents = documentsFor(state, pet.id);
  const isNewPet = visits.length === 0 && vaccinations.length === 0 && documents.length === 0;
  const now = new Date();
  const appointment = nextAppointment(state, pet.id, now);
  const vaccine = nextVaccination(state, pet.id, now);
  const tab = state.ui.tab;

  function choosePet(id: string) {
    setNotice(null);
    updateAccount((s) => selectPet(s, id));
  }

  function chooseTab(next: TabId, focus = false) {
    updateAccount((s) => selectTab(s, next));
    if (focus) tabRefs.current[next]?.focus();
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const i = TABS.indexOf(tab);
    const map: Record<string, number> = {
      ArrowRight: (i + 1) % TABS.length,
      ArrowLeft: (i - 1 + TABS.length) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    };
    if (event.key in map) {
      event.preventDefault();
      chooseTab(TABS[map[event.key]], true);
    }
  }

  function viewVaccines() {
    chooseTab('vaccines', true);
    tabRefs.current.vaccines?.scrollIntoView({ block: 'center' });
  }

  return (
    <>
      {/* Pet switcher */}
      <div className="pet-switcher" role="group" aria-label={d.pets.switcherLabel}>
        {state.pets.map((item) => {
          const itemName = petName(item, d);
          return (
            <button
              key={item.id}
              type="button"
              className="pet-chip"
              aria-pressed={item.id === pet.id}
              onClick={() => choosePet(item.id)}
            >
              <PetImage pet={item} alt="" sizes="44px" className="pet-chip__img" />
              <span className="pet-chip__name">{itemName}</span>
            </button>
          );
        })}
        <button type="button" className="pet-chip pet-chip--add" onClick={(e) => setModal({ opener: e.currentTarget, type: 'add' })}>
          <PlusIcon width={22} height={22} />
          {d.pets.add}
        </button>
      </div>

      <div className="account-grid">
        {/* Profile */}
        <section className="account-card profile" aria-labelledby="pet-name">
          <PetImage
            pet={pet}
            alt={pet.photo ? fill(d.pets.photoAlt, { name }) : d.pets.stockImageAlt[pet.species]}
            sizes="(min-width: 960px) 420px, 90vw"
            className="profile__photo"
            priority
          />
          <div className="profile__body">
            <h2 className="profile__name" id="pet-name">
              {name} <PawIcon width={26} height={26} fill="currentColor" stroke="none" />
            </h2>
            <span className="profile__species">{d.pets.species[pet.species]}</span>
            <dl className="profile__facts">
              <div>
                <dt>
                  <CalendarIcon width={22} height={22} />
                  <span className="visually-hidden">{d.pets.ageLabel}</span>
                </dt>
                <dd>{formatAge(pet.birthDate, d, locale)}</dd>
              </div>
              <div>
                <dt>
                  <PawIcon width={22} height={22} />
                  <span className="visually-hidden">{d.pets.breedLabel}</span>
                </dt>
                <dd>{breed ?? d.pets.breedUnknown}</dd>
              </div>
              <div>
                <dt>
                  <WeightIcon width={22} height={22} />
                </dt>
                <dd>{fill(d.pets.weight, { value: formatWeight(pet.weightKg, locale) })}</dd>
              </div>
            </dl>
            <button type="button" className="btn btn--outline profile__edit" onClick={(e) => setModal({ opener: e.currentTarget, type: 'edit' })}>
              <PencilIcon width={18} height={18} /> {d.pets.edit}
            </button>
          </div>
        </section>

        {/* Next appointment */}
        <section className="account-card appointment" aria-labelledby="appt-title">
          <div className="appointment__head">
            <span className="icon-circle">
              <CalendarIcon width={26} height={26} />
            </span>
            <h2 id="appt-title">{d.appointment.title}</h2>
          </div>
          {appointment ? (
            <div className="appointment__body">
              <p className="appointment__when">
                {formatDayMonth(appointment.date, locale)} · {appointment.time}
              </p>
              <p className="appointment__reason">
                {d.records.reasons[appointment.reasonKey as keyof typeof d.records.reasons] ??
                  appointment.reasonKey}
              </p>
              <p className="appointment__doctor">
                <UserIcon width={22} height={22} />
                {fill(d.appointment.doctor, {
                  name:
                    d.records.doctors[appointment.doctorKey as keyof typeof d.records.doctors] ??
                    appointment.doctorKey,
                })}
              </p>
            </div>
          ) : (
            <p className="appointment__empty">{d.appointment.empty}</p>
          )}
          {notice && (
            <p className="account-notice" role="status">
              {notice}
            </p>
          )}
          <button type="button" className="btn btn--primary btn--block btn--lg" onClick={(e) => setModal({ opener: e.currentTarget, type: 'book' })}>
            {d.appointment.book}
          </button>
        </section>
      </div>

      {/* Next vaccination */}
      <section className="vaccine-banner" aria-label={d.vaccines.heading}>
        <span className="icon-circle icon-circle--light">
          <CalendarIcon width={26} height={26} />
        </span>
        <p>
          {vaccine?.nextDate
            ? fill(d.vaccineReminder.label, { date: formatDayMonth(vaccine.nextDate, locale) })
            : d.vaccineReminder.none}
        </p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={viewVaccines}>
          {d.vaccineReminder.view}
        </button>
      </section>

      {/* Tabs */}
      <div className="account-tabs" role="tablist" aria-label={d.tabs.label}>
        {TABS.map((id) => (
          <button
            key={id}
            ref={(el) => {
              tabRefs.current[id] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            className="account-tab"
            onClick={() => chooseTab(id)}
            onKeyDown={onTabKey}
          >
            {d.tabs[id]}
          </button>
        ))}
      </div>

      <div className="account-panel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'visits' && renderVisits()}
        {tab === 'vaccines' && renderVaccines()}
        {tab === 'documents' && renderDocuments()}
      </div>

      {/* Local-only data notice + reset */}
      <div className="account-storage">
        <p>{d.storageNotice}</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={(e) => setModal({ opener: e.currentTarget, type: 'reset' })}>
          {d.reset.button}
        </button>
      </div>

      {modal?.type === 'add' && (
        <Dialog returnFocus={modal.opener} title={d.form.addTitle} closeLabel={d.close} onClose={() => setModal(null)}>
          <PetForm
            d={d}
            onCancel={() => setModal(null)}
            onSubmit={(value) => {
              updateAccount((s) => addPet(s, value, newId('pet')));
              setNotice(null);
              setModal(null);
            }}
          />
        </Dialog>
      )}

      {modal?.type === 'edit' && (
        <Dialog returnFocus={modal.opener} title={d.form.editTitle} closeLabel={d.close} onClose={() => setModal(null)}>
          <PetForm
            d={d}
            initial={{ input: petToInput(pet, name, breed) }}
            onCancel={() => setModal(null)}
            onSubmit={(value) => {
              updateAccount((s) => updatePet(s, pet.id, value));
              setModal(null);
            }}
          />
        </Dialog>
      )}

      {modal?.type === 'book' && (
        <BookingDialog
          returnFocus={modal.opener}
          site={site}
          d={d}
          locale={locale}
          state={state}
          petId={pet.id}
          petName={name}
          onClose={() => setModal(null)}
          onBooked={(next) => {
            updateAccount(() => next);
            setNotice(d.appointment.added);
            setModal(null);
          }}
        />
      )}

      {modal?.type === 'visit' && (
        <Dialog returnFocus={modal.opener} title={d.visits.detailsTitle} closeLabel={d.close} onClose={() => setModal(null)}>
          <dl className="details">
            <dt>{d.visits.dateLabel}</dt>
            <dd>{formatDate(modal.visit.date, locale)}</dd>
            <dt>{d.visits.reasonLabel}</dt>
            <dd>{reason(modal.visit.reasonKey)}</dd>
            <dt>{d.visits.doctorLabel}</dt>
            <dd>{doctor(modal.visit.doctorKey)}</dd>
            <dt>{d.visits.noteLabel}</dt>
            <dd>{d.records.notes[modal.visit.noteKey as keyof typeof d.records.notes] ?? '—'}</dd>
          </dl>
          <p className="demo-hint">{d.visits.demoNote}</p>
        </Dialog>
      )}

      {modal?.type === 'document' && (
        <Dialog returnFocus={modal.opener} title={docTitle(modal.doc)} closeLabel={d.close} onClose={() => setModal(null)}>
          <p className="doc-meta">
            <span className="demo-tag">{d.documents.demoBadge}</span> {formatDate(modal.doc.date, locale)}
          </p>
          <div className="doc-body">
            {docBody(modal.doc).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </Dialog>
      )}

      {modal?.type === 'reset' && (
        <Dialog returnFocus={modal.opener} title={d.reset.title} closeLabel={d.close} onClose={() => setModal(null)}>
          <p>{d.reset.text}</p>
          <div className="dialog-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setModal(null)}>
              {d.cancel}
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                resetAccount();
                setNotice(d.reset.done);
                setModal(null);
              }}
            >
              {d.reset.confirm}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );

  // --- helpers (closures over the current state and dictionary) ---

  function reason(key: string) {
    return d.records.reasons[key as keyof typeof d.records.reasons] ?? key;
  }
  function doctor(key: string) {
    return d.records.doctors[key as keyof typeof d.records.doctors] ?? key;
  }
  function docTitle(doc: PetDocument) {
    return d.records.documents[doc.titleKey as 'afterCheckup' | 'vaccineNote' | 'careTips'] ?? doc.titleKey;
  }
  function docBody(doc: PetDocument): string[] {
    const body = d.records.documents[doc.bodyKey as 'afterCheckupBody' | 'vaccineNoteBody' | 'careTipsBody'];
    return Array.isArray(body) ? body : [];
  }

  function empty(text: string) {
    return <p className="account-empty">{text}</p>;
  }

  function renderVisits() {
    return (
      <>
        <h3 className="account-panel__title">{d.visits.heading}</h3>
        {visits.length === 0 ? (
          empty(isNewPet ? d.visits.emptyNew : d.visits.empty)
        ) : (
          <ul className="record-list">
            {visits.map((visit) => (
              <li key={visit.id}>
                <button
                  type="button"
                  className="record-row"
                  aria-label={fill(d.visits.open, { date: formatDate(visit.date, locale) })}
                  onClick={(e) => setModal({ opener: e.currentTarget, type: 'visit', visit })}
                >
                  <span className="record-row__date">{formatDate(visit.date, locale)}</span>
                  <span>{reason(visit.reasonKey)}</span>
                  <span className="record-row__muted">{doctor(visit.doctorKey)}</span>
                  <ChevronRightIcon width={20} height={20} className="record-row__chevron" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  function renderVaccines() {
    return (
      <>
        <h3 className="account-panel__title">{d.vaccines.heading}</h3>
        {vaccinations.length === 0 ? (
          empty(isNewPet ? d.vaccines.emptyNew : d.vaccines.empty)
        ) : (
          <>
            <div className="record-table-wrap">
              <table className="record-table">
                <thead>
                  <tr>
                    <th scope="col">{d.vaccines.nameLabel}</th>
                    <th scope="col">{d.vaccines.doneLabel}</th>
                    <th scope="col">{d.vaccines.nextLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinations.map((v) => (
                    <tr key={v.id}>
                      <th scope="row">
                        {d.records.vaccines[v.nameKey as keyof typeof d.records.vaccines] ?? v.nameKey}
                      </th>
                      <td>{formatDate(v.date, locale)}</td>
                      <td>{v.nextDate ? formatDate(v.nextDate, locale) : d.vaccines.notPlanned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="demo-hint">{d.vaccines.disclaimer}</p>
          </>
        )}
      </>
    );
  }

  function renderDocuments() {
    return (
      <>
        <h3 className="account-panel__title">{d.documents.heading}</h3>
        {documents.length === 0 ? (
          empty(isNewPet ? d.documents.emptyNew : d.documents.empty)
        ) : (
          <>
            <ul className="record-list">
              {documents.map((doc) => (
                <li key={doc.id} className="record-row record-row--static">
                  <span className="record-row__date">
                    <NoteIcon width={20} height={20} /> {docTitle(doc)}
                  </span>
                  <span className="record-row__muted">{formatDate(doc.date, locale)}</span>
                  <span>
                    <span className="demo-tag">{d.documents.demoBadge}</span>
                  </span>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={(e) => setModal({ opener: e.currentTarget, type: 'document', doc })}
                  >
                    {d.documents.view}
                  </button>
                </li>
              ))}
            </ul>
            <p className="demo-hint">{d.documents.disclaimer}</p>
          </>
        )}
      </>
    );
  }
}
