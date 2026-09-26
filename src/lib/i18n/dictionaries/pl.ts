import type { Dictionary } from '../types';

const dict: Dictionary = {
  meta: {
    title: 'VetKlinika — opieka nad kotami i psami',
    description:
      'Demonstracyjna strona kliniki weterynaryjnej: usługi, zespół lekarzy i wygodna rezerwacja online. Pomoc dla kotów i psów.',
  },
  langName: 'Polski',
  nav: {
    services: 'Usługi',
    doctors: 'Lekarze',
    booking: 'Rezerwacja',
    contacts: 'Kontakt',
    emergency: 'Pilna pomoc',
    account: 'Konto pupila',
    prices: 'Cennik',
  },
  header: {
    clinicName: 'VetKlinika',
    openMenu: 'Otwórz menu',
    closeMenu: 'Zamknij menu',
    languageLabel: 'Język strony',
  },
  hero: {
    title: 'Troska o tych, których kochasz',
    subtitle: 'Pomoc dla kotów i psów. Umów wizytę bez zbędnych telefonów.',
    ctaBooking: 'Wybierz termin',
    ctaContact: 'Skontaktuj się',
    imageAlt: 'Weterynarz trzymający kota',
    note: 'Więcej szczęśliwych dni razem',
  },
  demoGuide: {
    title: 'To projekt demo — wypróbuj go w minutę',
    text: 'Wszystkie dane są fikcyjne i zostają tylko w Twojej przeglądarce.',
    steps: [
      { title: 'Umów pupila', text: 'W koncie pupila wybierz Mruczka lub Lunę i wolny termin.', link: 'Konto pupila' },
      { title: 'Potwierdź wizytę', text: 'W panelu administratora znajdź zgłoszenie „Oczekuje na potwierdzenie”.', link: 'Panel administratora' },
      { title: 'Sprawdź status', text: 'Wróć do konta pupila — wizyta jest już potwierdzona.', link: 'Konto pupila' },
    ],
    formNote: 'Formularz rezerwacji poniżej także wysyła zgłoszenie do panelu administratora.',
  },
  services: {
    title: 'Nasze usługi',
    items: [
      {
        title: 'Badanie kontrolne',
        description: 'Wstępne badanie i ocena stanu zdrowia Twojego zwierzęcia.',
      },
      {
        title: 'Szczepienia',
        description: 'Rutynowe szczepienia chroniące przed najczęstszymi chorobami.',
      },
      {
        title: 'Badania',
        description: 'Diagnostyka laboratoryjna i interpretacja wyników.',
      },
      {
        title: 'Stomatologia',
        description: 'Opieka nad zębami, czyszczenie i leczenie jamy ustnej.',
      },
      {
        title: 'USG',
        description: 'Badanie ultrasonograficzne narządów wewnętrznych.',
      },
      {
        title: 'Konsultacja',
        description: 'Porady dotyczące pielęgnacji, żywienia i profilaktyki.',
      },
    ],
  },
  prices: {
    title: 'Cennik',
    note: 'Orientacyjne ceny głównych usług kliniki.',
    from: 'od {price}',
    demoNote: 'Ceny demonstracyjne. Dokładny koszt ustala lekarz po badaniu.',
    groups: [
      { items: ['Wizyta pierwsza', 'Wizyta kontrolna'] },
      { items: ['Szczepionka skojarzona (kot/pies)', 'Szczepionka przeciw wściekliźnie'] },
      { items: ['Morfologia krwi', 'Badanie biochemiczne'] },
      { items: ['Skaling ultradźwiękowy', 'Ekstrakcja zęba'] },
      { items: ['USG jamy brzusznej', 'USG serca'] },
      { items: ['Konsultacja żywieniowa i pielęgnacyjna', 'Konsultacja online'] },
    ],
  },
  about: {
    title: 'Poznaj nasz zespół',
    text: 'Jesteśmy małą kliniką weterynaryjną, w której każdy pacjent otoczony jest uwagą i troską. Pomagamy kotom i psom czuć się zdrowo i szczęśliwie.',
    demoNote: 'Profile zostały utworzone w celach demonstracyjnych.',
    team: [
      {
        name: 'Weterynarz',
        role: 'Lekarz ogólny',
        bio: 'Demonstracyjny profil lekarza weterynarii ogólnej.',
        imageAlt: 'Portret weterynarza',
      },
      {
        name: 'Weterynarz',
        role: 'Chirurg',
        bio: 'Demonstracyjny profil lekarza weterynarii — chirurga.',
        imageAlt: 'Portret weterynarza',
      },
    ],
  },
  booking: {
    title: 'Wybierz dogodny termin',
    note: 'Troska zaczyna się tutaj',
    demoNote: 'Kalendarz demonstracyjny — godziny są orientacyjne.',
    calendar: {
      prevMonth: 'Poprzedni miesiąc',
      nextMonth: 'Następny miesiąc',
      selectDatePrompt: 'Wybierz datę, aby zobaczyć dostępne godziny.',
      legendFree: 'Wolne',
      legendBusy: 'Zajęte',
      noSlots: 'Brak dostępnych godzin na ten dzień.',
      chooseDay: 'Wybierz dzień:',
      pastDay: 'niedostępne',
      availableOn: 'Dostępne godziny na',
      legendOtherMonth: 'Inny miesiąc',
    },
    form: {
      selectedLabel: 'Wybrana data i godzina',
      noSelection: 'Data i godzina nie zostały jeszcze wybrane.',
      nameLabel: 'Imię',
      namePlaceholder: 'Twoje imię',
      phoneLabel: 'Telefon',
      phonePlaceholder: '+40 700 000 000',
      petNameLabel: 'Imię zwierzęcia',
      petNamePlaceholder: 'Imię Twojego pupila',
      animalLabel: 'Zwierzę',
      animalOptions: { cat: 'Kot', dog: 'Pies', other: 'Inne' },
      reasonLabel: 'Powód wizyty',
      commLangLabel: 'Preferowany język komunikacji',
      submit: 'Umów wizytę',
      errors: {
        nameRequired: 'Podaj swoje imię.',
        phoneRequired: 'Podaj numer telefonu.',
        phoneInvalid: 'Podaj poprawny numer telefonu.',
        dateRequired: 'Wybierz datę i godzinę w kalendarzu.',
        petNameRequired: 'Podaj imię zwierzęcia.',
        slotUnavailable: 'Ten termin właśnie stał się niedostępny. Wybierz inny.',
      },
      demoSuccess:
        'Demonstracyjna rezerwacja utworzona tylko w tej przeglądarce. Czeka na potwierdzenie w demonstracyjnym panelu administratora. Nic nikomu nie wysłano.',
      demoHint:
        'Demo: zgłoszenie zapisuje się tylko w tej przeglądarce; numer telefonu nie jest zapisywany ani nigdzie wysyłany.',
    },
  },
  messengers: {
    title: 'Wolisz napisać?',
    text: 'Napisz do nas przez komunikator — odpowiemy najszybciej, jak to możliwe.',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    note: 'Pisz, jak Ci wygodnie',
    demoNote: 'Tryb demonstracyjny: kontakty do komunikatorów nie zostały jeszcze skonfigurowane.',
  },
  emergency: {
    sectionTitle: 'Potrzebujesz pilnej pomocy?',
    sectionText: 'Zadzwoń do nas, aby sprawdzić dostępność.',
    call: 'Zadzwoń teraz',
    floatingLabel: 'Pilna pomoc',
    modalTitle: 'Pilna pomoc',
    modalText: 'Zadzwoń do nas, aby sprawdzić dostępność.',
    hoursLabel: 'Godziny pracy',
    hoursValue: 'pon.–niedz., 09:00–19:00',
    contactLabel: 'Kontakt',
    close: 'Zamknij',
    demoNote: 'Tryb demonstracyjny: numer telefonu nie został jeszcze skonfigurowany.',
  },
  contacts: {
    title: 'Kontakt',
    addressLabel: 'Adres',
    address: 'Rumunia (adres demonstracyjny).',
    hoursLabel: 'Godziny pracy',
    hours: 'pon.–niedz., 09:00–19:00',
    mapPlaceholder: 'Mapa pojawi się, gdy będzie dostępny prawdziwy adres.',
    demoBadge: 'Projekt demonstracyjny',
  },
  footer: {
    demoBadge: 'Projekt demonstracyjny',
    rights: 'Fikcyjna strona stworzona do portfolio.',
    adminLink: 'Demo dla administratora',
    tagline: 'Troska dziś — zdrowie jutro',
  },
};

export default dict;
