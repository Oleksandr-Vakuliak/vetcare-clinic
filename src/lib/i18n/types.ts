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
    /** Secondary link to the demo pet account (/[locale]/account). */
    account: string;
    prices: string;
  };
  header: {
    clinicName: string;
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
    /** Short handwritten accent next to the hero text. */
    note: string;
  };
  /** "How to try the demo" band under the hero: three steps (account → admin → account). */
  demoGuide: {
    title: string;
    text: string;
    steps: Array<{ title: string; text: string; link: string }>;
    formNote: string;
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
  prices: {
    title: string;
    /** Short intro line above the price groups. */
    note: string;
    /** Template for a starting price; "{price}" is replaced with the formatted amount,
     * e.g. "від {price}" / "from {price}". */
    from: string;
    /** Prices are demonstrative/approximate; the exact cost is set after the exam. */
    demoNote: string;
    /** Exactly six groups, same fixed order as `services.items`:
     * checkup, vaccination, tests, dentistry, ultrasound, consultation.
     * Each group has exactly two item names; the matching amounts live in
     * `priceList` in `site-config.ts` (same order). */
    groups: Array<{ items: string[] }>;
  };
  booking: {
    title: string;
    /** Short handwritten accent. */
    note: string;
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
      /** Heading prefix above the time slots, e.g. "Доступний час на" + "12 жовтня". */
      availableOn: string;
      legendOtherMonth: string;
    };
    form: {
      selectedLabel: string;
      noSelection: string;
      nameLabel: string;
      namePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      petNameLabel: string;
      petNamePlaceholder: string;
      animalLabel: string;
      animalOptions: { cat: string; dog: string; other: string };
      reasonLabel: string;
      commLangLabel: string;
      submit: string;
      errors: {
        nameRequired: string;
        phoneRequired: string;
        phoneInvalid: string;
        dateRequired: string;
        petNameRequired: string;
        /** The chosen slot was taken meanwhile (e.g. in another tab). */
        slotUnavailable: string;
      };
      demoSuccess: string;
      /** Small note under the submit button. */
      demoHint: string;
    };
  };
  messengers: {
    title: string;
    text: string;
    whatsapp: string;
    telegram: string;
    /** Short handwritten accent. */
    note: string;
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
    /** Secondary footer link to the demo admin panel (/[locale]/admin). */
    adminLink: string;
    tagline: string;
  };
}
