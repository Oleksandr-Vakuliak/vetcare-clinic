// Translation contract for the demo "Pet account" (/[locale]/account).
// Kept separate from `Dictionary` so the home page doesn't ship these texts.
// Placeholders like {date} are filled in by `fill()` in the account UI.

/** CLDR plural categories used by Intl.PluralRules (ro/uk/en/pl need these four). */
export type PluralForms = { one: string; few: string; many: string; other: string };

export interface AccountDictionary {
  metaTitle: string;
  title: string;
  subtitle: string;
  backToSite: string;
  /** "Демонстраційний кабінет · Усі дані вигадані" */
  demoLabel: string;
  footerMotto: string;
  storageNotice: string;
  /** Explains how the local data was loaded (shown in the account and the admin panel). */
  dataNotice: { migrated: string; recovered: string; unavailable: string; notSaved: string };
  loading: string;
  close: string;
  cancel: string;

  pets: {
    switcherLabel: string;
    add: string;
    edit: string;
    species: { cat: string; dog: string };
    /** Alt text for the stock illustration of a new pet, e.g. "Ілюстрація: кіт". */
    stockImageAlt: { cat: string; dog: string };
    photoAlt: string; // "{name} — фото"
    age: { years: PluralForms; months: PluralForms; lessThanMonth: string };
    ageLabel: string;
    breedLabel: string;
    breedUnknown: string;
    weight: string; // "Вага: {value} кг"
  };

  appointment: {
    title: string;
    doctor: string; // "Лікар: {name}"
    book: string;
    empty: string;
    added: string;
    /** "Скасовано клінікою: {when}" — an upcoming appointment cancelled in the admin panel. */
    cancelled: string;
  };

  vaccineReminder: {
    label: string; // "Наступне щеплення: {date}"
    none: string;
    view: string;
  };

  tabs: { label: string; visits: string; vaccines: string; documents: string };

  visits: {
    heading: string;
    open: string; // accessible label "Деталі візиту: {date}"
    empty: string;
    emptyNew: string;
    detailsTitle: string;
    dateLabel: string;
    reasonLabel: string;
    doctorLabel: string;
    noteLabel: string;
    demoNote: string;
  };

  vaccines: {
    heading: string;
    nameLabel: string;
    doneLabel: string;
    nextLabel: string;
    notPlanned: string;
    empty: string;
    emptyNew: string;
    disclaimer: string;
  };

  documents: {
    heading: string;
    demoBadge: string;
    view: string;
    empty: string;
    emptyNew: string;
    disclaimer: string;
  };

  booking: {
    title: string; // "Запис на прийом: {name}"
    intro: string;
    confirm: string;
    chooseSlot: string;
    errors: { past: string; busy: string; taken: string; invalid: string };
  };

  form: {
    addTitle: string;
    editTitle: string;
    name: string;
    species: string;
    speciesPlaceholder: string;
    breed: string;
    breedHint: string;
    birthDate: string;
    weight: string;
    weightHint: string;
    photoNote: string;
    save: string;
    errors: {
      required: string;
      invalidDate: string;
      futureDate: string;
      tooOld: string;
      invalidWeight: string;
    };
  };

  reset: {
    button: string;
    title: string;
    text: string;
    confirm: string;
    done: string;
  };

  /** Demo records referenced by key from the seed data. */
  records: {
    names: { murchyk: string; luna: string; bella: string; rocky: string; simba: string; max: string };
    breeds: {
      europeanShorthair: string;
      goldenRetriever: string;
      britishShorthair: string;
      beagle: string;
      maineCoon: string;
      labrador: string;
    };
    /** Fictional owners (anna = the pet account's owner). */
    owners: { anna: string; iryna: string; oleh: string; marko: string };
    reasons: {
      checkup: string;
      vaccination: string;
      dental: string;
      consultation: string;
      tests: string;
      ultrasound: string;
      visit: string;
    };
    /** A site request may be for an animal other than a cat or a dog. */
    otherSpecies: string;
    statuses: { pending: string; confirmed: string; completed: string; cancelled: string };
    doctors: { koval: string; melnyk: string };
    notes: { checkupNote: string; vaccinationNote: string; dentalNote: string; completedNote: string };
    vaccines: { rabies: string; complexCat: string; complexDog: string };
    documents: {
      afterCheckup: string;
      vaccineNote: string;
      careTips: string;
      afterCheckupBody: string[];
      vaccineNoteBody: string[];
      careTipsBody: string[];
    };
  };
}
