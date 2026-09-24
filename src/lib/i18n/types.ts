// The translation contract. Every dictionary (ro/uk/en/…) must match this shape
// exactly, so components can be written once and reused for every language.

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  /** Native language name, e.g. "Українська" (used for accessibility labels). */
  langName: string;
  nav: {
    services: string;
    doctors: string;
    booking: string;
    contacts: string;
    emergency: string;
  };
  header: {
    clinicName: string;
    tagline: string;
    openMenu: string;
    closeMenu: string;
    languageLabel: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaBooking: string;
    ctaContact: string;
    imageAlt: string;
    badge: string;
  };
  services: {
    title: string;
    /** Exactly six items, fixed order:
     * checkup, vaccination, tests, dentistry, ultrasound, consultation. */
    items: Array<{ title: string; description: string }>;
  };
  about: {
    title: string;
    text: string;
    /** Note that the team profiles are fictional / for demonstration. */
    demoNote: string;
    team: Array<{ name: string; role: string; bio: string; imageAlt: string }>;
  };
  booking: {
    title: string;
    /** "Демокалендар — години умовні" */
    demoNote: string;
    calendar: {
      prevMonth: string;
      nextMonth: string;
      selectDatePrompt: string;
      legendFree: string;
      legendBusy: string;
      noSlots: string;
      /** Accessible label prefix for a day button, e.g. "Обрати {date}". */
      chooseDay: string;
      pastDay: string;
    };
    form: {
      selectedLabel: string;
      noSelection: string;
      nameLabel: string;
      namePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      animalLabel: string;
      animalOptions: { cat: string; dog: string; other: string };
      reasonLabel: string;
      reasonPlaceholder: string;
      commLangLabel: string;
      submit: string;
      errors: {
        nameRequired: string;
        phoneRequired: string;
        phoneInvalid: string;
        dateRequired: string;
      };
      demoSuccess: string;
    };
  };
  messengers: {
    title: string;
    text: string;
    whatsapp: string;
    telegram: string;
    demoNote: string;
  };
  emergency: {
    sectionTitle: string;
    sectionText: string;
    call: string;
    floatingLabel: string;
    modalTitle: string;
    modalText: string;
    hoursLabel: string;
    hoursValue: string;
    contactLabel: string;
    close: string;
    demoNote: string;
  };
  contacts: {
    title: string;
    addressLabel: string;
    address: string;
    hoursLabel: string;
    hours: string;
    mapPlaceholder: string;
    demoBadge: string;
  };
  footer: {
    demoBadge: string;
    rights: string;
  };
}
