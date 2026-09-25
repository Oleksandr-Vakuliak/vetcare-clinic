import type { AccountDictionary } from '../../account-types';

const account: AccountDictionary = {
  metaTitle: 'Contul animalului — VetClinic (demo)',
  title: 'Contul animalului',
  subtitle: 'Tot ce contează despre sănătatea prietenului tău',
  backToSite: 'Spre site-ul clinicii',
  demoLabel: 'Cont demonstrativ · Toate datele sunt fictive',
  footerMotto: 'Împreună pentru un mâine mai bun pentru ei',
  storageNotice:
    'Modificările sunt salvate doar în acest browser. Nu introdu date personale sau medicale reale.',
  loading: 'Se încarcă contul…',
  close: 'Închide',
  cancel: 'Anulează',

  pets: {
    switcherLabel: 'Animalele tale',
    add: 'Adaugă un animal',
    edit: 'Editează profilul',
    species: { cat: 'Pisică', dog: 'Câine' },
    stockImageAlt: { cat: 'Ilustrație: pisică', dog: 'Ilustrație: câine' },
    photoAlt: '{name} — fotografie',
    age: {
      years: { one: '{n} an', few: '{n} ani', many: '{n} de ani', other: '{n} de ani' },
      months: { one: '{n} lună', few: '{n} luni', many: '{n} de luni', other: '{n} de luni' },
      lessThanMonth: 'mai puțin de o lună',
    },
    ageLabel: 'Vârstă',
    breedLabel: 'Rasă',
    breedUnknown: 'Rasă nespecificată',
    weight: 'Greutate: {value} kg',
  },

  appointment: {
    title: 'Următoarea programare',
    doctor: 'Medic: {name}',
    book: 'Programează o vizită',
    empty: 'Nu ai nicio programare. Alege un moment convenabil — durează un minut.',
    added: 'Programare demonstrativă adăugată doar în acest browser. Clinica nu a fost notificată.',
  },

  vaccineReminder: {
    label: 'Următorul vaccin: {date}',
    none: 'Niciun vaccin programat',
    view: 'Vezi',
  },

  tabs: {
    label: 'Fișă medicală (demo)',
    visits: 'Istoric vizite',
    vaccines: 'Vaccinări',
    documents: 'Documente',
  },

  visits: {
    heading: 'Vizite recente',
    open: 'Detalii vizită: {date}',
    empty: 'Nu au fost vizite încă.',
    emptyNew:
      'Un animal nou nu are încă istoric: acesta va apărea după vizitele la clinică. Nu inventăm nimic în avans.',
    detailsTitle: 'Detalii vizită',
    dateLabel: 'Data',
    reasonLabel: 'Motiv',
    doctorLabel: 'Medic',
    noteLabel: 'Notă',
    demoNote: 'Aceasta este o notă demonstrativă, nu un document medical.',
  },

  vaccines: {
    heading: 'Vaccinări',
    nameLabel: 'Vaccin',
    doneLabel: 'Efectuat',
    nextLabel: 'Următor',
    notPlanned: 'Neprogramat',
    empty: 'Nu există înregistrări de vaccinare.',
    emptyNew:
      'Un animal nou nu are încă înregistrări de vaccinare. Medicul stabilește programul în timpul vizitei.',
    disclaimer: 'Datele sunt orientative și nu reprezintă recomandări medicale.',
  },

  documents: {
    heading: 'Documente',
    demoBadge: 'Demo',
    view: 'Vezi',
    empty: 'Niciun document.',
    emptyNew: 'Un animal nou nu are încă documente: acestea apar după vizite.',
    disclaimer: 'Toate documentele sunt exemple demonstrative, fără valoare legală.',
  },

  booking: {
    title: 'Programare: {name}',
    intro: 'Alege o dată și o oră liberă. Datele trecute și orele ocupate nu sunt disponibile.',
    confirm: 'Adaugă programarea',
    chooseSlot: 'Alege mai întâi data și ora.',
    errors: {
      past: 'Această oră a trecut deja. Alege alta.',
      busy: 'Această oră este ocupată. Alege alta.',
      taken: 'Există deja o programare la această oră. Alege alta.',
      invalid: 'Programarea nu a putut fi adăugată. Încearcă din nou.',
    },
  },

  form: {
    addTitle: 'Animal nou',
    editTitle: 'Editează profilul',
    name: 'Nume',
    species: 'Specie',
    speciesPlaceholder: 'Alege specia',
    breed: 'Rasă',
    breedHint: 'Opțional',
    birthDate: 'Data nașterii',
    weight: 'Greutate, kg',
    weightHint: 'De exemplu, 4,5',
    photoNote: 'În loc de fotografie este afișată o imagine standard cu o pisică sau un câine.',
    save: 'Salvează',
    errors: {
      required: 'Completează acest câmp.',
      invalidDate: 'Introdu o dată validă.',
      futureDate: 'Data nașterii nu poate fi în viitor.',
      tooOld: 'Verifică data: un animal nu poate avea peste 40 de ani.',
      invalidWeight: 'Introdu o greutate mai mare de zero (până la 150 kg).',
    },
  },

  reset: {
    button: 'Resetează datele demo',
    title: 'Resetezi datele demo?',
    text: 'Toate modificările tale din acest browser vor fi șterse, iar contul va reveni la datele demo inițiale.',
    confirm: 'Da, resetează',
    done: 'Datele demo au fost resetate.',
  },

  records: {
    names: { murchyk: 'Murcik', luna: 'Luna' },
    breeds: { europeanShorthair: 'European cu păr scurt', goldenRetriever: 'Golden Retriever' },
    reasons: {
      checkup: 'Control de rutină',
      vaccination: 'Vaccinare',
      dental: 'Control stomatologic',
      visit: 'Programare (rezervare demo)',
    },
    doctors: { koval: 'Olena Koval', melnyk: 'Andrii Melnyk' },
    notes: {
      checkupNote: 'Control de rutină efectuat. Proprietarul a primit recomandări generale de îngrijire.',
      vaccinationNote:
        'Vaccinarea a fost adăugată în program; următoarea dată a fost stabilită împreună cu proprietarul.',
      dentalNote: 'Examinare a cavității bucale; data următorului control a fost stabilită împreună cu medicul.',
    },
    vaccines: {
      rabies: 'Rabie',
      complexCat: 'Vaccin combinat pentru pisici',
      complexDog: 'Vaccin combinat pentru câini',
    },
    documents: {
      afterCheckup: 'Recomandări după control',
      vaccineNote: 'Notă privind vaccinarea',
      careTips: 'Sfaturi de îngrijire',
      afterCheckupBody: [
        'Document demonstrativ. Nu este un raport medical.',
        'Sfaturi generale: urmărește apetitul, activitatea și greutatea animalului tău.',
        'Dacă observi schimbări de comportament sau de stare generală, contactează clinica.',
      ],
      vaccineNoteBody: [
        'Document demonstrativ. Nu este un pașaport pentru animale sau un certificat oficial.',
        'Vezi lista vaccinărilor și a datelor în fila „Vaccinări”.',
        'Datele din acest cont sunt orientative și nu reprezintă recomandări medicale.',
      ],
      careTipsBody: [
        'Document demonstrativ.',
        'În fiecare zi: apă proaspătă, plimbări sau joacă regulată, îngrijirea blănii.',
        'Discută întrebările despre alimentație și sănătate cu medicul.',
      ],
    },
  },
};

export default account;
