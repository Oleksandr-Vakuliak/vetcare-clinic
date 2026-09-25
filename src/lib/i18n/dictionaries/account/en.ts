import type { AccountDictionary } from '../../account-types';

const account: AccountDictionary = {
  metaTitle: 'Pet account — VetClinic (demo)',
  title: 'Pet account',
  subtitle: 'Everything important about your friend’s health',
  backToSite: 'To the clinic website',
  demoLabel: 'Demo account · All data is fictional',
  footerMotto: 'Together for their better tomorrow',
  storageNotice:
    'Changes are saved only in this browser. Do not enter real personal or medical data.',
  loading: 'Loading the account…',
  close: 'Close',
  cancel: 'Cancel',

  pets: {
    switcherLabel: 'Your pets',
    add: 'Add a pet',
    edit: 'Edit profile',
    species: { cat: 'Cat', dog: 'Dog' },
    stockImageAlt: { cat: 'Illustration: cat', dog: 'Illustration: dog' },
    photoAlt: '{name} — photo',
    age: {
      years: { one: '{n} year', few: '{n} years', many: '{n} years', other: '{n} years' },
      months: { one: '{n} month', few: '{n} months', many: '{n} months', other: '{n} months' },
      lessThanMonth: 'less than a month',
    },
    ageLabel: 'Age',
    breedLabel: 'Breed',
    breedUnknown: 'Breed not specified',
    weight: 'Weight: {value} kg',
  },

  appointment: {
    title: 'Next appointment',
    doctor: 'Vet: {name}',
    book: 'Book an appointment',
    empty: 'No appointments scheduled. Pick a convenient time — it takes a minute.',
    added: 'Demo appointment added in this browser only. The clinic has not been notified.',
  },

  vaccineReminder: {
    label: 'Next vaccination: {date}',
    none: 'No vaccinations scheduled',
    view: 'View',
  },

  tabs: {
    label: 'Medical record (demo)',
    visits: 'Visit history',
    vaccines: 'Vaccinations',
    documents: 'Documents',
  },

  visits: {
    heading: 'Recent visits',
    open: 'Visit details: {date}',
    empty: 'No visits yet.',
    emptyNew:
      'A new pet has no history yet: it will appear after visits to the clinic. We don’t invent anything in advance.',
    detailsTitle: 'Visit details',
    dateLabel: 'Date',
    reasonLabel: 'Reason',
    doctorLabel: 'Vet',
    noteLabel: 'Note',
    demoNote: 'This is a demo note, not a medical record.',
  },

  vaccines: {
    heading: 'Vaccinations',
    nameLabel: 'Vaccination',
    doneLabel: 'Given',
    nextLabel: 'Next',
    notPlanned: 'Not scheduled',
    empty: 'No vaccination records.',
    emptyNew: 'A new pet has no vaccination records yet. The vet sets the schedule during a visit.',
    disclaimer: 'Dates are illustrative and are not medical advice.',
  },

  documents: {
    heading: 'Documents',
    demoBadge: 'Demo',
    view: 'View',
    empty: 'No documents.',
    emptyNew: 'A new pet has no documents yet: they appear after visits.',
    disclaimer: 'All documents are demo samples with no legal force.',
  },

  booking: {
    title: 'Book an appointment: {name}',
    intro: 'Choose a date and a free time. Past dates and busy hours are unavailable.',
    confirm: 'Add appointment',
    chooseSlot: 'Choose a date and time first.',
    errors: {
      past: 'This time has already passed. Choose another one.',
      busy: 'This time is busy. Choose another one.',
      taken: 'This time is already booked. Choose another one.',
      invalid: 'Could not add the appointment. Please try again.',
    },
  },

  form: {
    addTitle: 'New pet',
    editTitle: 'Edit profile',
    name: 'Name',
    species: 'Species',
    speciesPlaceholder: 'Choose species',
    breed: 'Breed',
    breedHint: 'Optional',
    birthDate: 'Date of birth',
    weight: 'Weight, kg',
    weightHint: 'For example, 4.5',
    photoNote: 'A standard cat or dog image is shown instead of a photo.',
    save: 'Save',
    errors: {
      required: 'Please fill in this field.',
      invalidDate: 'Enter a valid date.',
      futureDate: 'The date of birth can’t be in the future.',
      tooOld: 'Check the date: a pet can’t be over 40 years old.',
      invalidWeight: 'Enter a weight above zero (up to 150 kg).',
    },
  },

  reset: {
    button: 'Reset demo data',
    title: 'Reset demo data?',
    text: 'All your changes in this browser will be removed and the account will return to the initial demo data.',
    confirm: 'Yes, reset',
    done: 'Demo data has been reset.',
  },

  records: {
    names: { murchyk: 'Murchyk', luna: 'Luna' },
    breeds: { europeanShorthair: 'European Shorthair', goldenRetriever: 'Golden Retriever' },
    reasons: {
      checkup: 'Routine check-up',
      vaccination: 'Vaccination',
      dental: 'Dental check',
      visit: 'Appointment (demo booking)',
    },
    doctors: { koval: 'Olena Koval', melnyk: 'Andrii Melnyk' },
    notes: {
      checkupNote: 'Routine check-up done. The owner received general care tips.',
      vaccinationNote: 'Vaccination added to the schedule; the next date was agreed with the owner.',
      dentalNote: 'Mouth examination; the next check date was agreed with the vet.',
    },
    vaccines: {
      rabies: 'Rabies',
      complexCat: 'Combined vaccine for cats',
      complexDog: 'Combined vaccine for dogs',
    },
    documents: {
      afterCheckup: 'After-check-up notes',
      vaccineNote: 'Vaccination note',
      careTips: 'Care tips',
      afterCheckupBody: [
        'Demo document. Not a medical report.',
        'General tips: keep an eye on your pet’s appetite, activity and weight.',
        'If you notice changes in behaviour or well-being, contact the clinic.',
      ],
      vaccineNoteBody: [
        'Demo document. Not a pet passport or an official certificate.',
        'See the Vaccinations tab for the list of vaccinations and dates.',
        'Dates in this account are illustrative and are not medical advice.',
      ],
      careTipsBody: [
        'Demo document.',
        'Every day: fresh water, regular walks or play, coat care.',
        'Discuss feeding and health questions with the vet.',
      ],
    },
  },
};

export default account;
