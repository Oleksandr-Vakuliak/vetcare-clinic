import type { AccountDictionary } from '../../account-types';

const account: AccountDictionary = {
  metaTitle: 'Konto pupila — VetKlinika (demo)',
  title: 'Konto pupila',
  subtitle: 'Wszystko, co ważne o zdrowiu Twojego przyjaciela',
  backToSite: 'Na stronę kliniki',
  demoLabel: 'Konto demonstracyjne · Wszystkie dane są fikcyjne',
  footerMotto: 'Razem dla ich lepszego jutra',
  storageNotice:
    'Zmiany są zapisywane tylko w tej przeglądarce. Nie wprowadzaj prawdziwych danych osobowych ani medycznych.',
  loading: 'Wczytywanie konta…',
  close: 'Zamknij',
  cancel: 'Anuluj',

  pets: {
    switcherLabel: 'Twoje zwierzęta',
    add: 'Dodaj zwierzę',
    edit: 'Edytuj profil',
    species: { cat: 'Kot', dog: 'Pies' },
    stockImageAlt: { cat: 'Ilustracja: kot', dog: 'Ilustracja: pies' },
    photoAlt: '{name} — zdjęcie',
    age: {
      years: { one: '{n} rok', few: '{n} lata', many: '{n} lat', other: '{n} roku' },
      months: { one: '{n} miesiąc', few: '{n} miesiące', many: '{n} miesięcy', other: '{n} miesiąca' },
      lessThanMonth: 'mniej niż miesiąc',
    },
    ageLabel: 'Wiek',
    breedLabel: 'Rasa',
    breedUnknown: 'Rasa nieokreślona',
    weight: 'Waga: {value} kg',
  },

  appointment: {
    title: 'Najbliższa wizyta',
    doctor: 'Lekarz: {name}',
    book: 'Umów wizytę',
    empty: 'Brak zaplanowanych wizyt. Wybierz dogodny termin — zajmie to minutę.',
    added: 'Demonstracyjna wizyta dodana tylko w tej przeglądarce. Klinika nie została powiadomiona.',
  },

  vaccineReminder: {
    label: 'Kolejne szczepienie: {date}',
    none: 'Brak zaplanowanych szczepień',
    view: 'Zobacz',
  },

  tabs: {
    label: 'Karta medyczna (demo)',
    visits: 'Historia wizyt',
    vaccines: 'Szczepienia',
    documents: 'Dokumenty',
  },

  visits: {
    heading: 'Ostatnie wizyty',
    open: 'Szczegóły wizyty: {date}',
    empty: 'Nie było jeszcze żadnych wizyt.',
    emptyNew:
      'Nowe zwierzę nie ma jeszcze historii: pojawi się ona po wizytach w klinice. Niczego nie wymyślamy z góry.',
    detailsTitle: 'Szczegóły wizyty',
    dateLabel: 'Data',
    reasonLabel: 'Powód',
    doctorLabel: 'Lekarz',
    noteLabel: 'Notatka',
    demoNote: 'To demonstracyjna notatka, a nie dokumentacja medyczna.',
  },

  vaccines: {
    heading: 'Szczepienia',
    nameLabel: 'Szczepienie',
    doneLabel: 'Wykonano',
    nextLabel: 'Kolejne',
    notPlanned: 'Nie zaplanowano',
    empty: 'Brak wpisów o szczepieniach.',
    emptyNew: 'Nowe zwierzę nie ma jeszcze wpisów o szczepieniach. Harmonogram ustala lekarz podczas wizyty.',
    disclaimer: 'Daty są orientacyjne i nie stanowią porady medycznej.',
  },

  documents: {
    heading: 'Dokumenty',
    demoBadge: 'Demo',
    view: 'Zobacz',
    empty: 'Brak dokumentów.',
    emptyNew: 'Nowe zwierzę nie ma jeszcze dokumentów: pojawiają się one po wizytach.',
    disclaimer: 'Wszystkie dokumenty są przykładami demonstracyjnymi i nie mają mocy prawnej.',
  },

  booking: {
    title: 'Umów wizytę: {name}',
    intro: 'Wybierz datę i wolną godzinę. Terminy z przeszłości i zajęte godziny są niedostępne.',
    confirm: 'Dodaj wizytę',
    chooseSlot: 'Najpierw wybierz datę i godzinę.',
    errors: {
      past: 'Ta godzina już minęła. Wybierz inną.',
      busy: 'Ta godzina jest zajęta. Wybierz inną.',
      taken: 'Na tę godzinę jest już wizyta. Wybierz inną.',
      invalid: 'Nie udało się dodać wizyty. Spróbuj ponownie.',
    },
  },

  form: {
    addTitle: 'Nowe zwierzę',
    editTitle: 'Edytuj profil',
    name: 'Imię',
    species: 'Gatunek',
    speciesPlaceholder: 'Wybierz gatunek',
    breed: 'Rasa',
    breedHint: 'Opcjonalnie',
    birthDate: 'Data urodzenia',
    weight: 'Waga, kg',
    weightHint: 'Na przykład 4,5',
    photoNote: 'Zamiast zdjęcia wyświetlana jest standardowa ilustracja kota lub psa.',
    save: 'Zapisz',
    errors: {
      required: 'Uzupełnij to pole.',
      invalidDate: 'Podaj poprawną datę.',
      futureDate: 'Data urodzenia nie może być w przyszłości.',
      tooOld: 'Sprawdź datę: zwierzę nie może mieć więcej niż 40 lat.',
      invalidWeight: 'Podaj wagę większą od zera (do 150 kg).',
    },
  },

  reset: {
    button: 'Zresetuj dane demo',
    title: 'Zresetować dane demo?',
    text: 'Wszystkie Twoje zmiany w tej przeglądarce zostaną usunięte, a konto wróci do początkowych danych demo.',
    confirm: 'Tak, resetuj',
    done: 'Dane demo zostały zresetowane.',
  },

  records: {
    names: { murchyk: 'Mruczek', luna: 'Luna' },
    breeds: { europeanShorthair: 'Europejski krótkowłosy', goldenRetriever: 'Golden retriever' },
    reasons: {
      checkup: 'Badanie kontrolne',
      vaccination: 'Szczepienie',
      dental: 'Kontrola stomatologiczna',
      visit: 'Wizyta (rezerwacja demo)',
    },
    doctors: { koval: 'Ołena Kowal', melnyk: 'Andrij Melnyk' },
    notes: {
      checkupNote: 'Wykonano badanie kontrolne. Właściciel otrzymał ogólne wskazówki dotyczące pielęgnacji.',
      vaccinationNote: 'Szczepienie dodano do harmonogramu; kolejny termin ustalono z właścicielem.',
      dentalNote: 'Badanie jamy ustnej; termin kolejnej kontroli ustalono z lekarzem.',
    },
    vaccines: {
      rabies: 'Wścieklizna',
      complexCat: 'Szczepionka skojarzona dla kotów',
      complexDog: 'Szczepionka skojarzona dla psów',
    },
    documents: {
      afterCheckup: 'Zalecenia po badaniu',
      vaccineNote: 'Notatka o szczepieniu',
      careTips: 'Wskazówki dotyczące pielęgnacji',
      afterCheckupBody: [
        'Dokument demonstracyjny. Nie jest to dokumentacja medyczna.',
        'Ogólne wskazówki: obserwuj apetyt, aktywność i wagę swojego zwierzęcia.',
        'Jeśli zauważysz zmiany w zachowaniu lub samopoczuciu, skontaktuj się z kliniką.',
      ],
      vaccineNoteBody: [
        'Dokument demonstracyjny. Nie jest to paszport zwierzęcia ani oficjalny certyfikat.',
        'Listę szczepień i dat znajdziesz w zakładce „Szczepienia”.',
        'Daty na tym koncie są orientacyjne i nie stanowią porady medycznej.',
      ],
      careTipsBody: [
        'Dokument demonstracyjny.',
        'Codziennie: świeża woda, regularne spacery lub zabawa, pielęgnacja sierści.',
        'Pytania dotyczące żywienia i zdrowia omawiaj z lekarzem.',
      ],
    },
  },
};

export default account;
