import type { AccountDictionary } from '../../account-types';

const account: AccountDictionary = {
  metaTitle: 'Contul animalului — VetClinic (demo)',
  title: 'Contul animalului',
  subtitle: 'Tot ce contează despre sănătatea prietenului tău',
  backToSite: 'Spre site-ul clinicii',
  demoLabel: 'Cont demonstrativ · Toate datele sunt fictive',
  footerMotto: 'Împreună pentru un mâine mai bun pentru ei',
  storageNotice:
    'Demo: modificările se salvează doar în acest browser și nu se sincronizează cu alte dispozitive. Nu introduceți date personale sau medicale reale.',
  dataNotice: {
    migrated: 'Datele demo anterioare ale contului au fost mutate în noul format — nu s-a pierdut nimic.',
    recovered:
      'Datele demo salvate erau deteriorate, așa că s-au încărcat datele inițiale. O copie a datelor anterioare este păstrată în acest browser.',
    unavailable:
      'Stocarea browserului nu este disponibilă: demo-ul funcționează, dar modificările se pierd la reîncărcarea paginii.',
    notSaved: 'Modificările nu au putut fi salvate în acest browser. Rămân valabile doar până la reîncărcarea paginii.',
  },
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
    added:
      'Programare demo creată doar în acest browser; așteaptă confirmarea în panoul de administrare demo. Clinica nu a fost notificată.',
    cancelled: 'Anulată de clinică: {when}',
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
    text:
      'Toate modificările din acest browser vor fi șterse: animalele, programările demo din cont, din panoul de administrare și din calendarul site-ului, precum și programul medicilor revin la datele demo inițiale.',
    confirm: 'Da, resetează',
    done: 'Datele demo au fost resetate.',
  },

  records: {
    names: {
      murchyk: 'Murcik',
      luna: 'Luna',
      bella: 'Bella',
      rocky: 'Rocky',
      simba: 'Simba',
      max: 'Max',
    },
    breeds: {
      europeanShorthair: 'European cu păr scurt',
      goldenRetriever: 'Golden Retriever',
      britishShorthair: 'British cu păr scurt',
      beagle: 'Beagle',
      maineCoon: 'Maine Coon',
      labrador: 'Labrador Retriever',
    },
    owners: {
      anna: 'Ana Popescu',
      iryna: 'Irina Dumitru',
      oleh: 'Oleg Stan',
      marko: 'Marco Ionescu',
    },
    reasons: {
      checkup: 'Control de rutină',
      vaccination: 'Vaccinare',
      dental: 'Control stomatologic',
      consultation: 'Consultație',
      tests: 'Analize',
      ultrasound: 'Ecografie',
      visit: 'Programare (rezervare demo)',
    },
    otherSpecies: 'Alt animal',
    statuses: {
      pending: 'Așteaptă confirmarea',
      confirmed: 'Confirmată',
      completed: 'Finalizată',
      cancelled: 'Anulată',
    },
    doctors: { koval: 'Olena Koval', melnyk: 'Andrii Melnyk' },
    notes: {
      checkupNote: 'Control de rutină efectuat. Proprietarul a primit recomandări generale de îngrijire.',
      vaccinationNote:
        'Vaccinarea a fost adăugată în program; următoarea dată a fost stabilită împreună cu proprietarul.',
      dentalNote: 'Examinare a cavității bucale; data următorului control a fost stabilită împreună cu medicul.',
      completedNote: 'Consultație finalizată (înregistrare demo fără date medicale).',
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
