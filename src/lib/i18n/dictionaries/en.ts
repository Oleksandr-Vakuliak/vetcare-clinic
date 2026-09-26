import type { Dictionary } from '../types';

const dict: Dictionary = {
  meta: {
    title: "VetClinic — care for cats and dogs",
    description:
      "Demo website for a veterinary clinic: services, medical team, and convenient online booking. Help for cats and dogs.",
  },
  langName: "English",
  nav: {
    services: "Services",
    doctors: "Doctors",
    booking: "Booking",
    contacts: "Contacts",
    emergency: "Emergency",
    account: "Pet account",
    prices: "Prices",
  },
  header: {
    clinicName: "VetClinic",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageLabel: "Site language",
  },
  hero: {
    title: "Care for those you love",
    subtitle: "Help for cats and dogs. Book an appointment without the hassle.",
    ctaBooking: "Choose a time",
    ctaContact: "Contact us",
    imageAlt: "Veterinarian holding a cat",
    note: "More happy days together",
  },
  demoGuide: {
    title: "This is a demo — try it in a minute",
    text: "All data is fictional and stays only in your browser.",
    steps: [
      { title: "Book a visit", text: "In the pet account, choose Murchyk or Luna and a free time.", link: "Pet account" },
      { title: "Confirm it", text: "In the admin panel, find the request “Awaiting confirmation”.", link: "Admin panel" },
      { title: "Check the status", text: "Go back to the pet account — the visit is now confirmed.", link: "Pet account" },
    ],
    formNote: "The booking form below also sends a request to the admin panel.",
  },
  services: {
    title: "Our services",
    items: [
      {
        title: "Checkup",
        description: "Initial examination and health assessment of your pet.",
      },
      {
        title: "Vaccination",
        description: "Routine vaccinations to protect against common diseases.",
      },
      {
        title: "Tests",
        description: "Laboratory diagnostics and interpretation of results.",
      },
      {
        title: "Dentistry",
        description: "Dental care, cleaning, and treatment of the oral cavity.",
      },
      {
        title: "Ultrasound",
        description: "Ultrasound examination of internal organs.",
      },
      {
        title: "Consultation",
        description: "Advice on care, nutrition, and preventive health.",
      },
    ],
  },
  prices: {
    title: "Prices",
    note: "Approximate prices for our main services.",
    from: "from {price}",
    demoNote: "Demo prices. The exact cost is set by the vet after the exam.",
    groups: [
      { items: ["Initial exam", "Follow-up exam"] },
      { items: ["Combined vaccine (cat/dog)", "Rabies vaccine"] },
      { items: ["Complete blood count", "Biochemistry panel"] },
      { items: ["Ultrasonic scaling", "Tooth extraction"] },
      { items: ["Abdominal ultrasound", "Cardiac ultrasound"] },
      { items: ["Nutrition & care consultation", "Online consultation"] },
    ],
  },
  about: {
    title: "Meet our team",
    text: "We are a small veterinary clinic where every patient is treated with attention and care. We help cats and dogs feel healthy and happy.",
    demoNote: "Profiles are created for demonstration purposes.",
    team: [
      {
        name: "Veterinarian",
        role: "General practitioner",
        bio: "Demonstration profile of a general practice veterinarian.",
        imageAlt: "Veterinarian portrait",
      },
      {
        name: "Veterinarian",
        role: "Surgeon",
        bio: "Demonstration profile of a veterinary surgeon.",
        imageAlt: "Veterinarian portrait",
      },
    ],
  },
  booking: {
    title: "Choose a convenient time",
    note: "Care starts here",
    demoNote: "Demo calendar — times are approximate.",
    calendar: {
      prevMonth: "Previous month",
      nextMonth: "Next month",
      selectDatePrompt: "Select a date to see available time slots.",
      legendFree: "Available",
      legendBusy: "Busy",
      noSlots: "No available time slots for this date.",
      chooseDay: "Choose",
      pastDay: "unavailable",
      availableOn: "Available times on",
      legendOtherMonth: "Other month",
    },
    form: {
      selectedLabel: "Selected date and time",
      noSelection: "Date and time have not been selected yet.",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      phoneLabel: "Phone",
      phonePlaceholder: "+40 700 000 000",
      petNameLabel: "Pet’s name",
      petNamePlaceholder: "Your pet’s name",
      animalLabel: "Animal",
      animalOptions: { cat: "Cat", dog: "Dog", other: "Other" },
      reasonLabel: "Reason for visit",
      commLangLabel: "Preferred communication language",
      submit: "Book appointment",
      errors: {
        nameRequired: "Please enter your name.",
        phoneRequired: "Please enter your phone number.",
        phoneInvalid: "Enter a valid phone number.",
        dateRequired: "Please select a date and time in the calendar.",
        petNameRequired: "Please enter your pet’s name.",
        slotUnavailable: "This time has just become unavailable. Please choose another.",
      },
      demoSuccess:
        "Demo appointment created in this browser only. It is waiting for confirmation in the demo admin panel. Nothing was sent to anyone.",
      demoHint:
        "Demo: the request is saved only in this browser; the phone number is not stored or sent anywhere.",
    },
  },
  messengers: {
    title: "Prefer to message us?",
    text: "Write to us in a messenger — we will reply as soon as possible.",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    note: "Write the way you like",
    demoNote: "Demo mode: messenger contacts are not yet configured.",
  },
  emergency: {
    sectionTitle: "Need emergency assistance?",
    sectionText: "Call us to check availability.",
    call: "Call now",
    floatingLabel: "Emergency",
    modalTitle: "Emergency assistance",
    modalText: "Call us to check availability.",
    hoursLabel: "Working hours",
    hoursValue: "Mon–Sun, 09:00–19:00",
    contactLabel: "Contact",
    close: "Close",
    demoNote: "Demo mode: phone number is not yet configured.",
  },
  contacts: {
    title: "Contacts",
    addressLabel: "Address",
    address: "Romania (demo address).",
    hoursLabel: "Working hours",
    hours: "Mon–Sun, 09:00–19:00",
    mapPlaceholder: "Map will appear once a real address is available.",
    demoBadge: "Demo project",
  },
  footer: {
    demoBadge: "Demo project",
    rights: "Fictional website created for portfolio.",
    adminLink: "Admin demo",
    tagline: "Care today — health tomorrow",
  },
};

export default dict;
